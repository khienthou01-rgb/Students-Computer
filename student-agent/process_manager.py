"""
Module: Student Agent Application & Process Manager
Inspects running applications, validates against approved allowlists, and supports launching/closing.
"""
import os
import subprocess

APPROVED_APPLICATIONS = {
    "WINWORD": "Microsoft Word",
    "EXCEL": "Microsoft Excel",
    "POWERPNT": "Microsoft PowerPoint",
    "notepad": "Notepad",
    "chrome": "Google Chrome",
    "msedge": "Microsoft Edge",
    "calc": "Calculator",
    "cmd": "Command Prompt"
}

def get_running_approved_processes():
    active_apps = []
    try:
        cmd = 'powershell -NoProfile -Command "Get-Process | Where-Object { $_.MainWindowTitle } | Select-Object -Property ProcessName, MainWindowTitle, Id | ConvertTo-Json"'
        out = subprocess.check_output(cmd, shell=True, text=True, timeout=4).strip()
        if out:
            import json
            parsed = json.loads(out)
            items = parsed if isinstance(parsed, list) else [parsed]
            for it in items:
                pname = (it.get("ProcessName") or "").strip()
                title = (it.get("MainWindowTitle") or "").strip()
                pid = it.get("Id")
                active_apps.append({
                    "processName": pname,
                    "title": title[:60],
                    "pid": pid,
                    "isApproved": any(k.lower() in pname.lower() for k in APPROVED_APPLICATIONS)
                })
    except Exception:
        pass
    return active_apps

def launch_approved_app(app_name):
    # Strict allowlist check
    allowed_executables = {
        "word": "winword",
        "excel": "excel",
        "powerpoint": "powerpnt",
        "notepad": "notepad",
        "chrome": "chrome",
        "edge": "msedge",
        "calc": "calc"
    }

    clean_name = str(app_name).strip().lower()
    target_cmd = allowed_executables.get(clean_name)
    if not target_cmd:
        return False, f"Application '{app_name}' is not in the approved classroom allowlist"

    try:
        subprocess.Popen([target_cmd], shell=True)
        return True, f"Launched {target_cmd}"
    except Exception as e:
        return False, str(e)

def close_process(pid_or_name):
    try:
        if str(pid_or_name).isdigit():
            subprocess.run(["taskkill", "/F", "/PID", str(pid_or_name)], capture_output=True)
        else:
            clean_name = str(pid_or_name).replace(".exe", "")
            subprocess.run(["taskkill", "/F", "/IM", f"{clean_name}.exe"], capture_output=True)
        return True, "Process closed"
    except Exception as e:
        return False, str(e)
