"""
Module: Student Agent Desktop GUI
Provides modern, simple, clean status interface for the student without technical controls.
"""
import tkinter as tk
from tkinter import ttk, messagebox
import threading
import webbrowser

class StudentAgentGUI:
    def __init__(self, agent_client):
        self.client = agent_client
        self.root = None
        self.status_indicator = None
        self.lbl_status = None
        self.lbl_classroom = None
        self.lbl_student = None
        self.lbl_computer = None
        self.lbl_teacher = None
        self.lbl_server = None

    def launch(self):
        self.root = tk.Tk()
        self.root.title("TIS Student Agent — Smart Lab")
        self.root.geometry("440x520")
        self.root.resizable(False, False)
        self.root.configure(bg="#070510")

        # Top Bar
        top_frame = tk.Frame(self.root, bg="#0f172a", height=65)
        top_frame.pack(fill=tk.X, side=tk.TOP)

        title_lbl = tk.Label(
            top_frame,
            text="សាលា អន្តរជាតិ ធានស៊ីន (TIS)",
            font=("Segoe UI", 12, "bold"),
            fg="#38bdf8",
            bg="#0f172a"
        )
        title_lbl.pack(pady=(12, 2))

        sub_lbl = tk.Label(
            top_frame,
            text="Student Agent v2.2.0 • Computer Lab System",
            font=("Segoe UI", 8),
            fg="#94a3b8",
            bg="#0f172a"
        )
        sub_lbl.pack(pady=(0, 10))

        # Main Content Card
        card = tk.Frame(self.root, bg="#0f172a", bd=1, relief=tk.SOLID)
        card.pack(fill=tk.BOTH, expand=True, padx=20, pady=20)

        # Status Light & State Banner
        status_box = tk.Frame(card, bg="#0f172a")
        status_box.pack(pady=(20, 16))

        self.status_indicator = tk.Canvas(status_box, width=16, height=16, bg="#0f172a", highlightthickness=0)
        self.status_indicator.pack(side=tk.LEFT, padx=6)
        self.dot = self.status_indicator.create_oval(2, 2, 14, 14, fill="#10b981", outline="")

        self.lbl_status = tk.Label(
            status_box,
            text="🟢 បានភ្ជាប់ជោគជ័យ (Connected)",
            font=("Segoe UI", 11, "bold"),
            fg="#10b981",
            bg="#0f172a"
        )
        self.lbl_status.pack(side=tk.LEFT)

        # Info Grid
        info_frame = tk.Frame(card, bg="#0f172a")
        info_frame.pack(fill=tk.X, padx=24, pady=10)

        def add_row(parent, label_text, default_val):
            row = tk.Frame(parent, bg="#0f172a")
            row.pack(fill=tk.X, pady=6)
            lbl = tk.Label(row, text=label_text, font=("Segoe UI", 9), fg="#94a3b8", bg="#0f172a", width=12, anchor="w")
            lbl.pack(side=tk.LEFT)
            val = tk.Label(row, text=default_val, font=("Segoe UI", 9, "bold"), fg="#ffffff", bg="#0f172a", anchor="w")
            val.pack(side=tk.LEFT, fill=tk.X, expand=True)
            return val

        cfg = self.client.config_data or {}
        self.lbl_classroom = add_row(info_frame, "Classroom:", cfg.get("classroomName", "Computer Lab A"))
        self.lbl_computer = add_row(info_frame, "Computer:", cfg.get("displayName", "PC-STUDENT"))
        self.lbl_student = add_row(info_frame, "Student:", "ភ្ជាប់តាមវេន (Syncing...)")
        self.lbl_teacher = add_row(info_frame, "Teacher:", "លោកគ្រូ ខៀន ធូ")
        self.lbl_server = add_row(info_frame, "Server:", "Connected (LAN)")

        # Divider
        div = tk.Frame(card, height=1, bg="#1e293b")
        div.pack(fill=tk.X, padx=20, pady=16)

        # Action Buttons
        btn_frame = tk.Frame(card, bg="#0f172a")
        btn_frame.pack(fill=tk.X, padx=24, pady=(0, 20))

        btn_reconnect = tk.Button(
            btn_frame,
            text="🔄 Reconnect Now",
            font=("Segoe UI", 9, "bold"),
            bg="#0284c7",
            fg="#ffffff",
            activebackground="#0369a1",
            activeforeground="#ffffff",
            bd=0,
            padx=12,
            pady=8,
            cursor="hand2",
            command=self.on_reconnect
        )
        btn_reconnect.pack(side=tk.LEFT, fill=tk.X, expand=True, padx=(0, 6))

        btn_details = tk.Button(
            btn_frame,
            text="ℹ️ Details",
            font=("Segoe UI", 9),
            bg="#334155",
            fg="#ffffff",
            activebackground="#475569",
            activeforeground="#ffffff",
            bd=0,
            padx=12,
            pady=8,
            cursor="hand2",
            command=self.on_details
        )
        btn_details.pack(side=tk.LEFT, fill=tk.X, expand=True, padx=(6, 0))

        # Bottom Tag
        lbl_bottom = tk.Label(
            self.root,
            text="🔒 គ្រប់គ្រងដោយលោកគ្រូ • ប្រព័ន្ធការពារសុវត្ថិភាពសាលា TIS",
            font=("Segoe UI", 7),
            fg="#64748b",
            bg="#070510"
        )
        lbl_bottom.pack(side=tk.BOTTOM, pady=10)

        # Periodic status refresh
        self.root.after(1000, self.refresh_status_ui)
        self.root.mainloop()

    def refresh_status_ui(self):
        state = self.client.state
        if state == "ONLINE":
            self.status_indicator.itemconfig(self.dot, fill="#10b981")
            self.lbl_status.config(text="🟢 បានភ្ជាប់ជោគជ័យ (Connected)", fg="#10b981")
            self.lbl_server.config(text="Connected (Online)", fg="#10b981")
        elif state in ("CONNECTING", "RECONNECTING"):
            self.status_indicator.itemconfig(self.dot, fill="#fbbf24")
            self.lbl_status.config(text="🟡 កំពុងភ្ជាប់... (Reconnecting...)", fg="#fbbf24")
            self.lbl_server.config(text="Reconnecting...", fg="#fbbf24")
        else:
            self.status_indicator.itemconfig(self.dot, fill="#ef4444")
            self.lbl_status.config(text="🔴 ដាច់ការតភ្ជាប់ (Offline)", fg="#ef4444")
            self.lbl_server.config(text="Disconnected", fg="#ef4444")

        cfg = self.client.config_data or {}
        if cfg.get("classroomName"):
            self.lbl_classroom.config(text=cfg["classroomName"])
        if cfg.get("displayName"):
            self.lbl_computer.config(text=cfg["displayName"])

        if self.root:
            self.root.after(1500, self.refresh_status_ui)

    def on_reconnect(self):
        if self.client.current_ws:
            try:
                self.client.current_ws.close()
            except Exception:
                pass
        messagebox.showinfo("TIS Agent", "កំពុងចាប់ផ្តើមតភ្ជាប់ឡើងវិញទៅកាន់ Server...")

    def on_details(self):
        cfg = self.client.config_data or {}
        specs = f"""Computer: {cfg.get('displayName', 'N/A')}
Machine ID: {cfg.get('machineId', 'N/A')}
Agent ID: {cfg.get('agentId', 'N/A')}
Classroom: {cfg.get('classroomName', 'N/A')}
Server URL: {cfg.get('serverUrl', 'N/A')}
State: {self.client.state}
"""
        messagebox.showinfo("Connection Details", specs)
