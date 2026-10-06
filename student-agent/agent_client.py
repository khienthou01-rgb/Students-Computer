"""
Module: Student Agent Client Core Service
Maintains resilient WebSocket connection, heartbeat telemetry, adaptive screen streaming,
teacher broadcast reception, file transfer execution, and interactive remote assistance.
"""
import os
import sys

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8', errors='replace')

import time
import json
import asyncio
import urllib.request
import urllib.error
import webbrowser
import subprocess
import threading

import config
import hardware
import screen_capture
from remote_control import remote_controller
from broadcast_viewer import broadcast_viewer
from file_manager import file_manager
import process_manager

try:
    import websockets
except ImportError:
    websockets = None

class ConnectionState:
    DISCONNECTED = "DISCONNECTED"
    CONNECTING = "CONNECTING"
    ONLINE = "ONLINE"
    NETWORK_LOST = "NETWORK_LOST"
    RECONNECTING = "RECONNECTING"

class StudentAgentClient:
    def __init__(self, on_state_change=None):
        self.state = ConnectionState.DISCONNECTED
        self.config_data = config.load_config()
        self.on_state_change = on_state_change
        self.is_running = True
        self.current_ws = None
        self.lock_window = None
        self.last_error = ""
        self.is_streaming_screen = False
        self.stream_fps = 10
        self.stream_quality = "medium"

    def set_state(self, new_state):
        if self.state != new_state:
            self.state = new_state
            print(f"[Agent State] -> {new_state}")
            if self.on_state_change:
                try:
                    self.on_state_change(new_state)
                except Exception:
                    pass

    # -------------------------------------------------------------
    # 1. ENROLLMENT & MACHINE REGISTRATION
    # -------------------------------------------------------------
    def enroll_with_token(self, token, server_url):
        server_url = server_url.rstrip('/')
        specs = hardware.collect_full_hardware_specs()

        payload = {
            "token": token.strip().upper(),
            "machineId": specs["machineId"],
            "hostname": specs["hostname"],
            "hardware": specs,
            "agentVersion": "2.2.0"
        }

        req = urllib.request.Request(
            f"{server_url}/api/lab/enroll/register",
            data=json.dumps(payload).encode('utf-8'),
            headers={"Content-Type": "application/json; charset=utf-8"},
            method="POST"
        )

        try:
            with urllib.request.urlopen(req, timeout=12) as response:
                result = json.loads(response.read().decode('utf-8'))
                if result.get("success"):
                    self.config_data = {
                        "agentId": result["agentId"],
                        "machineId": result["machineId"],
                        "displayName": result["displayName"],
                        "secretKey": result["secretKey"],
                        "classroomId": result["classroomId"],
                        "classroomName": result["classroomName"],
                        "serverUrl": server_url,
                        "wsUrl": result.get("wsUrl", f"{server_url.replace('http', 'ws')}/ws/classroom"),
                        "enrolledAt": result.get("enrolledAt", time.time())
                    }
                    config.save_config(self.config_data)
                    print(f"✅ Enrolled successfully into {result['classroomName']} as {result['displayName']}!")
                    return True, result
                else:
                    return False, result.get("error", "Unknown enrollment error")
        except urllib.error.HTTPError as e:
            err_body = e.read().decode('utf-8')
            try:
                err_json = json.loads(err_body)
                return False, err_json.get("error", err_body)
            except Exception:
                return False, f"HTTP Error {e.code}: {err_body}"
        except Exception as e:
            return False, str(e)

    # -------------------------------------------------------------
    # 2. MAIN CONNECTION & RECONNECT LOOP
    # -------------------------------------------------------------
    async def start(self):
        if not websockets:
            print("❌ 'websockets' library is required. Please install via pip install websockets")
            return

        reconnect_delay = 1
        max_delay = 10

        while self.is_running:
            if not self.config_data.get("agentId") or not self.config_data.get("secretKey"):
                print("⚠️ Student Agent is not yet enrolled. Waiting for enrollment token...")
                self.set_state(ConnectionState.DISCONNECTED)
                await asyncio.sleep(3)
                self.config_data = config.load_config()
                continue

            ws_url = self.config_data.get("wsUrl")
            if not ws_url:
                server_url = self.config_data.get("serverUrl", "http://localhost:8080")
                ws_url = f"{server_url.replace('http', 'ws')}/ws/classroom"
                self.config_data["wsUrl"] = ws_url

            self.set_state(ConnectionState.CONNECTING if reconnect_delay == 1 else ConnectionState.RECONNECTING)

            try:
                print(f"[Agent] Connecting to {ws_url}...")
                async with websockets.connect(ws_url, ping_interval=15, ping_timeout=10) as ws:
                    self.current_ws = ws
                    reconnect_delay = 1

                    # Authenticate
                    auth_packet = {
                        "type": "AGENT_AUTH",
                        "agentId": self.config_data["agentId"],
                        "secretKey": self.config_data["secretKey"],
                        "machineId": self.config_data["machineId"]
                    }
                    await ws.send(json.dumps(auth_packet))

                    auth_reply_raw = await ws.recv()
                    auth_reply = json.loads(auth_reply_raw)

                    if auth_reply.get("type") != "AUTH_SUCCESS":
                        print(f"❌ Auth failed: {auth_reply.get('error')}")
                        self.set_state(ConnectionState.DISCONNECTED)
                        await asyncio.sleep(5)
                        continue

                    self.set_state(ConnectionState.ONLINE)
                    print(f"🟢 Connected to {auth_reply.get('classroomName', 'Classroom')} as {auth_reply.get('displayName')}!")

                    # Concurrent tasks: heartbeat, receiver, screen stream
                    heartbeat_task = asyncio.create_task(self._heartbeat_loop(ws))
                    receiver_task = asyncio.create_task(self._receiver_loop(ws))
                    stream_task = asyncio.create_task(self._screen_stream_loop(ws))

                    done, pending = await asyncio.wait(
                        [heartbeat_task, receiver_task, stream_task],
                        return_when=asyncio.FIRST_COMPLETED
                    )

                    for task in pending:
                        task.cancel()

            except Exception as e:
                self.last_error = str(e)
                print(f"⚠️ Connection lost ({e}). Reconnecting in {reconnect_delay}s...")
                self.set_state(ConnectionState.NETWORK_LOST)

            self.current_ws = None
            await asyncio.sleep(reconnect_delay)
            reconnect_delay = min(reconnect_delay * 1.5, max_delay)

    async def _heartbeat_loop(self, ws):
        while self.is_running:
            try:
                telemetry = hardware.collect_live_telemetry()
                packet = {
                    "type": "AGENT_HEARTBEAT",
                    "cpuUsage": telemetry.get("cpuUsage", 5),
                    "ramUsage": telemetry.get("ramUsage", 50),
                    "activeWindow": telemetry.get("activeWindow", "Desktop"),
                    "latencyMs": 1
                }
                await ws.send(json.dumps(packet))
                await asyncio.sleep(5)
            except Exception:
                break

    async def _screen_stream_loop(self, ws):
        # Adaptive screen capture loop (streams frames only when requested or every 3s in thumbnail mode)
        while self.is_running:
            try:
                if self.is_streaming_screen:
                    quality = 75 if self.stream_quality == "high" else (55 if self.stream_quality == "medium" else 40)
                    delay = 1.0 / max(1, self.stream_fps)
                    frame = screen_capture.capture_jpeg_frame(
                        max_width=640,
                        max_height=360,
                        quality=quality,
                        label=self.config_data.get("displayName", "PC-01")
                    )
                    if frame:
                        await ws.send(frame)
                    await asyncio.sleep(delay)
                else:
                    # Low-frequency thumbnail snapshot (every 3 seconds) for the dashboard card
                    frame = screen_capture.capture_jpeg_frame(
                        max_width=320,
                        max_height=180,
                        quality=45,
                        label=self.config_data.get("displayName", "PC-01")
                    )
                    if frame:
                        await ws.send(frame)
                    await asyncio.sleep(3.0)
            except Exception:
                await asyncio.sleep(2.0)

    async def _receiver_loop(self, ws):
        async for message in ws:
            try:
                data = json.loads(message)
                msg_type = data.get("type")

                if msg_type == "EXECUTE_COMMAND":
                    await self._handle_command(ws, data)

                elif msg_type == "START_SCREEN_STREAM":
                    self.is_streaming_screen = True
                    self.stream_fps = data.get("fps", 10)
                    self.stream_quality = data.get("quality", "medium")
                    print(f"[Stream] Started screen streaming (FPS: {self.stream_fps}, Quality: {self.stream_quality})")

                elif msg_type == "STOP_SCREEN_STREAM":
                    self.is_streaming_screen = False
                    print("[Stream] Stopped high-frequency screen streaming")

                elif msg_type == "BROADCAST_STARTED":
                    broadcast_viewer.start_viewing(data.get("teacherName", "Teacher"))

                elif msg_type == "BROADCAST_FRAME_DATA":
                    broadcast_viewer.update_frame(data.get("image"))

                elif msg_type == "BROADCAST_STOPPED":
                    broadcast_viewer.stop_viewing()

                elif msg_type == "START_REMOTE_CONTROL":
                    remote_controller.start_control(data.get("teacherName", "លោកគ្រូ ខៀន ធូ"))

                elif msg_type == "REMOTE_INPUT":
                    remote_controller.handle_input_event(data.get("event", {}))

                elif msg_type == "STOP_REMOTE_CONTROL":
                    remote_controller.stop_control()

            except Exception as e:
                print(f"[Command Receiver Error] {e}")

    # -------------------------------------------------------------
    # 3. COMMAND EXECUTION SANDBOX
    # -------------------------------------------------------------
    async def _handle_command(self, ws, cmd_packet):
        command = cmd_packet.get("command")
        command_id = cmd_packet.get("commandId")
        payload = cmd_packet.get("payload", {})
        issued_by = cmd_packet.get("issuedBy", "Teacher")

        print(f"⚡ [Command Received] {command} (from {issued_by})")
        success = True
        msg = "Executed successfully"

        try:
            if command == "LOCK_SCREEN":
                self._show_lock_screen(payload.get("message", "ថ្នាក់រៀនត្រូវបានចាក់សោ (Classroom Locked)"), issued_by)
            elif command == "UNLOCK_SCREEN":
                self._hide_lock_screen()
            elif command == "SHOW_MESSAGE":
                self._show_popup_message(payload.get("message", ""), payload.get("title", f"សារពី {issued_by}"))
            elif command == "OPEN_URL":
                url = payload.get("url")
                if url:
                    webbrowser.open(url)
            elif command == "RECEIVE_FILE":
                file_url = payload.get("fileUrl")
                file_name = payload.get("fileName")
                dest_dir = payload.get("destinationDir")
                ok, path_or_err = file_manager.receive_distributed_file(file_url, file_name, dest_dir)
                success = ok
                msg = f"Saved to {path_or_err}" if ok else path_or_err
            elif command == "GET_PROCESSES":
                apps = process_manager.get_running_approved_processes()
                reply_proc = {
                    "type": "PROCESSES_RESPONSE",
                    "processes": apps
                }
                await ws.send(json.dumps(reply_proc))
                return
            elif command == "LAUNCH_APP":
                app_name = payload.get("appName")
                ok, res_msg = process_manager.launch_approved_app(app_name)
                success = ok
                msg = res_msg
            elif command == "KILL_PROCESS":
                pid_or_name = payload.get("pid") or payload.get("processName")
                ok, res_msg = process_manager.close_process(pid_or_name)
                success = ok
                msg = res_msg
            elif command == "REBOOT":
                subprocess.Popen(["shutdown.exe", "/r", "/t", "5", "/c", f"Reboot by {issued_by}"])
            elif command == "SHUTDOWN":
                subprocess.Popen(["shutdown.exe", "/s", "/t", "5", "/c", f"Shutdown by {issued_by}"])
            else:
                success = False
                msg = f"Unknown or unauthorized command: {command}"
        except Exception as e:
            success = False
            msg = str(e)

        reply = {
            "type": "COMMAND_RESULT",
            "commandId": command_id,
            "action": command,
            "success": success,
            "message": msg
        }
        await ws.send(json.dumps(reply))

    # -------------------------------------------------------------
    # 4. ON-SCREEN LOCK & MESSAGE OVERLAYS
    # -------------------------------------------------------------
    def _show_lock_screen(self, message, teacher_name):
        def _run_lock():
            try:
                import tkinter as tk
                if self.lock_window and tk.Toplevel.winfo_exists(self.lock_window):
                    return
                root = tk.Tk()
                self.lock_window = root
                root.title("CLASSROOM LOCKED")
                root.attributes("-fullscreen", True)
                root.attributes("-topmost", True)
                root.configure(bg="#070510")

                lbl_lock = tk.Label(root, text="🔒 ថ្នាក់រៀនត្រូវបានចាក់សោ (CLASSROOM LOCKED)", font=("Segoe UI", 26, "bold"), fg="#38bdf8", bg="#070510")
                lbl_lock.pack(expand=True, pady=(100, 10))

                lbl_msg = tk.Label(root, text=message, font=("Kantumruy Pro", 18), fg="#ffffff", bg="#070510", wraplength=800)
                lbl_msg.pack(expand=True, pady=10)

                lbl_tch = tk.Label(root, text=f"គ្រូបង្រៀន: {teacher_name}", font=("Kantumruy Pro", 14), fg="#10b981", bg="#070510")
                lbl_tch.pack(expand=True, pady=(10, 100))

                root.mainloop()
            except Exception as e:
                print(f"[Lock Error] {e}")

        t = threading.Thread(target=_run_lock, daemon=True)
        t.start()

    def _hide_lock_screen(self):
        if self.lock_window:
            try:
                self.lock_window.destroy()
            except Exception:
                pass
            self.lock_window = None

    def _show_popup_message(self, message, title):
        def _run_popup():
            try:
                import tkinter as tk
                from tkinter import messagebox
                r = tk.Tk()
                r.withdraw()
                messagebox.showinfo(title, message)
                r.destroy()
            except Exception:
                pass

        t = threading.Thread(target=_run_popup, daemon=True)
        t.start()

    # -------------------------------------------------------------
    # 5. WINDOWS AUTO-START REGISTRATION
    # -------------------------------------------------------------
    def install_autostart(self):
        try:
            import winreg
            key = winreg.OpenKey(
                winreg.HKEY_CURRENT_USER,
                r"Software\Microsoft\Windows\CurrentVersion\Run",
                0,
                winreg.KEY_SET_VALUE
            )
            script_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "tis_student_agent.py"))
            python_exe = sys.executable
            pythonw = os.path.join(os.path.dirname(python_exe), "pythonw.exe")
            exec_bin = pythonw if os.path.exists(pythonw) else python_exe
            cmd = f'"{exec_bin}" "{script_path}" --silent'

            winreg.SetValueEx(key, "TISStudentAgent", 0, winreg.REG_SZ, cmd)
            winreg.CloseKey(key)
            print("✅ Registered in Windows Auto-Start successfully!")
            return True
        except Exception as e:
            print(f"⚠️ Could not register auto-start: {e}")
            return False
