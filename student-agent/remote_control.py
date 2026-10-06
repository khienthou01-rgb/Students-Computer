"""
Module: Student Agent Interactive Remote Control & Security Banner
Handles mouse/keyboard input simulation with explicit top warning banner.
"""
import ctypes
import threading
import tkinter as tk

# Mouse Event Flags
MOUSEEVENTF_MOVE = 0x0001
MOUSEEVENTF_LEFTDOWN = 0x0002
MOUSEEVENTF_LEFTUP = 0x0004
MOUSEEVENTF_RIGHTDOWN = 0x0008
MOUSEEVENTF_RIGHTUP = 0x0010
MOUSEEVENTF_MIDDLEDOWN = 0x0020
MOUSEEVENTF_MIDDLEUP = 0x0040
MOUSEEVENTF_WHEEL = 0x0800
MOUSEEVENTF_ABSOLUTE = 0x8000

# Keyboard Event Flags
KEYEVENTF_KEYDOWN = 0x0000
KEYEVENTF_KEYUP = 0x0002

class RemoteControlManager:
    def __init__(self):
        self.is_active = False
        self.banner_window = None
        self.teacher_name = "Teacher"

    def start_control(self, teacher_name="លោកគ្រូ ខៀន ធូ"):
        self.is_active = True
        self.teacher_name = teacher_name
        self._show_warning_banner()

    def stop_control(self):
        self.is_active = False
        self._hide_warning_banner()

    def _show_warning_banner(self):
        def _run_banner():
            try:
                if self.banner_window:
                    return
                root = tk.Tk()
                self.banner_window = root
                root.title("TIS Remote Control Notice")
                root.overrideredirect(True) # Borderless
                root.attributes("-topmost", True)
                root.attributes("-alpha", 0.92)

                # Width 480, height 40, centered at top of screen
                screen_w = root.winfo_screenwidth()
                x = int((screen_w - 480) / 2)
                root.geometry(f"480x42+{x}+8")
                root.configure(bg="#0f172a")

                frame = tk.Frame(root, bg="#0f172a", highlightbackground="#fbbf24", highlightthickness=2)
                frame.pack(fill=tk.BOTH, expand=True)

                lbl = tk.Label(
                    frame,
                    text=f"⚠️ Teacher Remote Control Active — {self.teacher_name}",
                    font=("Segoe UI", 10, "bold"),
                    fg="#fbbf24",
                    bg="#0f172a"
                )
                lbl.pack(pady=8)

                root.mainloop()
            except Exception as e:
                print(f"[Remote Banner Error] {e}")

        t = threading.Thread(target=_run_banner, daemon=True)
        t.start()

    def _hide_warning_banner(self):
        if self.banner_window:
            try:
                self.banner_window.destroy()
            except Exception:
                pass
            self.banner_window = None

    def handle_input_event(self, event_data):
        if not self.is_active:
            return

        event_type = event_data.get("type")
        try:
            screen_w = ctypes.windll.user32.GetSystemMetrics(0)
            screen_h = ctypes.windll.user32.GetSystemMetrics(1)

            if event_type == "mousemove":
                # Normalized coordinates (0.0 to 1.0)
                norm_x = float(event_data.get("x", 0))
                norm_y = float(event_data.get("y", 0))
                real_x = int(norm_x * screen_w)
                real_y = int(norm_y * screen_h)
                ctypes.windll.user32.SetCursorPos(real_x, real_y)

            elif event_type == "mousedown":
                btn = event_data.get("button", 0) # 0: left, 2: right
                flag = MOUSEEVENTF_LEFTDOWN if btn == 0 else MOUSEEVENTF_RIGHTDOWN
                ctypes.windll.user32.mouse_event(flag, 0, 0, 0, 0)

            elif event_type == "mouseup":
                btn = event_data.get("button", 0)
                flag = MOUSEEVENTF_LEFTUP if btn == 0 else MOUSEEVENTF_RIGHTUP
                ctypes.windll.user32.mouse_event(flag, 0, 0, 0, 0)

            elif event_type == "wheel":
                delta = int(event_data.get("deltaY", 0))
                # Negative delta = scroll down
                ctypes.windll.user32.mouse_event(MOUSEEVENTF_WHEEL, 0, 0, -delta, 0)

            elif event_type == "keydown":
                vk_code = int(event_data.get("keyCode", 0))
                if vk_code > 0:
                    ctypes.windll.user32.keybd_event(vk_code, 0, KEYEVENTF_KEYDOWN, 0)

            elif event_type == "keyup":
                vk_code = int(event_data.get("keyCode", 0))
                if vk_code > 0:
                    ctypes.windll.user32.keybd_event(vk_code, 0, KEYEVENTF_KEYUP, 0)

        except Exception as e:
            print(f"[Remote Input Error] {e}")

remote_controller = RemoteControlManager()
