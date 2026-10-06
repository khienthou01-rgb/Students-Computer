"""
Module: Student Agent File Transfer Manager
Handles downloading files distributed by the teacher and uploading student assignments.
"""
import os
import io
import json
import base64
import urllib.request
import urllib.error
import tkinter as tk
from tkinter import messagebox

DEFAULT_LESSONS_DIR = os.path.join(os.environ.get('USERPROFILE', 'C:\\'), 'Desktop', 'Classroom_Lessons')

class StudentFileManager:
    def __init__(self):
        try:
            if not os.path.exists(DEFAULT_LESSONS_DIR):
                os.makedirs(DEFAULT_LESSONS_DIR, exist_ok=True)
        except Exception:
            pass

    def receive_distributed_file(self, file_url, file_name, destination_dir=None):
        target_dir = destination_dir or DEFAULT_LESSONS_DIR
        try:
            if not os.path.exists(target_dir):
                os.makedirs(target_dir, exist_ok=True)
        except Exception:
            target_dir = os.path.join(os.environ.get('USERPROFILE', 'C:\\'), 'Desktop')

        target_path = os.path.join(target_dir, file_name)

        try:
            urllib.request.urlretrieve(file_url, target_path)
            print(f"[File Received] Saved to {target_path}")

            # Notify student
            try:
                root = tk.Tk()
                root.withdraw()
                messagebox.showinfo(
                    "ឯកសារមេរៀនថ្មី (Teacher Lesson File)",
                    f"លោកគ្រូបានផ្ញើឯកសារមេរៀនថ្មី:\n\n📄 {file_name}\n\nបានរក្សាទុកលើ Desktop ក្នុង Folder 'Classroom_Lessons'"
                )
                root.destroy()
            except Exception:
                pass

            return True, target_path
        except Exception as e:
            print(f"[File Download Error] {e}")
            return False, str(e)

    def upload_assignment_file(self, file_path, server_url, assignment_info):
        if not os.path.exists(file_path):
            return False, "File does not exist"

        file_name = os.path.basename(file_path)
        try:
            with open(file_path, "rb") as f:
                content_bytes = f.read()
            base64_content = base64.b64encode(content_bytes).decode('utf-8')

            payload = {
                "classroomId": assignment_info.get("classroomId", "lab_a"),
                "subject": assignment_info.get("subject", "Microsoft Word"),
                "assignmentTitle": assignment_info.get("assignmentTitle", "Exercise"),
                "studentId": assignment_info.get("studentId", "TX01"),
                "studentName": assignment_info.get("studentName", "Student"),
                "agentId": assignment_info.get("agentId", ""),
                "computerName": assignment_info.get("computerName", "PC-01"),
                "fileName": file_name,
                "fileContentBase64": base64_content
            }

            req = urllib.request.Request(
                f"{server_url}/api/lab/files/upload",
                data=json.dumps(payload).encode('utf-8'),
                headers={"Content-Type": "application/json; charset=utf-8"},
                method="POST"
            )

            with urllib.request.urlopen(req, timeout=15) as res:
                data = json.loads(res.read().decode('utf-8'))
                return data.get("success", False), data
        except Exception as e:
            return False, str(e)

file_manager = StudentFileManager()
