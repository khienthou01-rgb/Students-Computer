"""
Module: Student Agent Broadcast Viewer
Receives teacher screen stream and renders full-screen presentation window.
"""
import io
import base64
import threading
import tkinter as tk
from PIL import Image, ImageTk

class BroadcastViewer:
    def __init__(self):
        self.is_active = False
        self.window = None
        self.canvas = None
        self.current_img = None

    def start_viewing(self, teacher_name="Teacher"):
        if self.is_active:
            return
        self.is_active = True

        def _run_window():
            try:
                root = tk.Tk()
                self.window = root
                root.title(f"TIS Smart Lab — Teacher Broadcast ({teacher_name})")
                root.attributes("-fullscreen", True)
                root.attributes("-topmost", True)
                root.configure(bg="#000000")

                # Top info ribbon
                top_bar = tk.Frame(root, bg="#0f172a", height=32)
                top_bar.pack(fill=tk.X, side=tk.TOP)

                lbl = tk.Label(
                    top_bar,
                    text=f"📡 អេក្រង់លោកគ្រូ (Teacher Screen Broadcast) • {teacher_name} • ចុច Esc ដើម្បី Minimize",
                    font=("Segoe UI", 9, "bold"),
                    fg="#38bdf8",
                    bg="#0f172a"
                )
                lbl.pack(pady=4)

                root.bind("<Escape>", lambda e: root.attributes("-fullscreen", False))

                self.canvas = tk.Label(root, bg="#000000")
                self.canvas.pack(fill=tk.BOTH, expand=True)

                root.mainloop()
            except Exception as e:
                print(f"[Broadcast Viewer Error] {e}")

        t = threading.Thread(target=_run_window, daemon=True)
        t.start()

    def update_frame(self, image_data):
        if not self.is_active or not self.window or not self.canvas:
            return

        try:
            if isinstance(image_data, str) and image_data.startswith("data:image"):
                base64_data = image_data.split(",")[1]
                raw_bytes = base64.b64decode(base64_data)
            elif isinstance(image_data, str):
                raw_bytes = base64.b64decode(image_data)
            else:
                raw_bytes = image_data

            img = Image.open(io.BytesIO(raw_bytes))
            # Scale to current screen
            w = self.window.winfo_width() or 1280
            h = self.window.winfo_height() or 720
            img.thumbnail((w, h - 35), Image.Resampling.BILINEAR)

            tk_img = ImageTk.PhotoImage(img)
            self.canvas.configure(image=tk_img)
            self.canvas.image = tk_img
        except Exception:
            pass

    def stop_viewing(self):
        self.is_active = False
        if self.window:
            try:
                self.window.destroy()
            except Exception:
                pass
            self.window = None
            self.canvas = None

broadcast_viewer = BroadcastViewer()
