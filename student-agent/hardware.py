"""
Module: Student Agent Native Hardware Inspector & Telemetry
Collects hardware specifications, generates unique machine ID, and reads live system metrics.
"""
import os
import sys
import socket
import platform
import hashlib
import ctypes
import subprocess
import shutil

class MEMORYSTATUSEX(ctypes.Structure):
    _fields_ = [
        ("dwLength", ctypes.c_ulong),
        ("dwMemoryLoad", ctypes.c_ulong),
        ("ullTotalPhys", ctypes.c_ulonglong),
        ("ullAvailPhys", ctypes.c_ulonglong),
        ("ullTotalPageFile", ctypes.c_ulonglong),
        ("ullAvailPageFile", ctypes.c_ulonglong),
        ("ullTotalVirtual", ctypes.c_ulonglong),
        ("ullAvailVirtual", ctypes.c_ulonglong),
        ("sullAvailExtendedVirtual", ctypes.c_ulonglong),
    ]

def get_ram_info():
    try:
        stat = MEMORYSTATUSEX()
        stat.dwLength = ctypes.sizeof(MEMORYSTATUSEX)
        ctypes.windll.kernel32.GlobalMemoryStatusEx(ctypes.byref(stat))
        total_gb = round(stat.ullTotalPhys / (1024 ** 3), 1)
        used_percent = stat.dwMemoryLoad
        return f"{total_gb} GB", used_percent
    except Exception:
        return "8.0 GB", 50

def get_screen_resolution():
    try:
        w = ctypes.windll.user32.GetSystemMetrics(0)
        h = ctypes.windll.user32.GetSystemMetrics(1)
        return f"{w}x{h}"
    except Exception:
        return "1920x1080"

def get_local_ip():
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.settimeout(0.5)
        # Doesn't need to actually connect to the outside, just triggers routing resolution
        s.connect(('8.8.8.8', 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except Exception:
        return "127.0.0.1"

def get_wmi_property(query, prop):
    try:
        cmd = f'powershell -NoProfile -Command "(Get-CimInstance {query} | Select-Object -First 1).{prop}"'
        output = subprocess.check_output(cmd, shell=True, text=True, timeout=3).strip()
        return output if output else None
    except Exception:
        return None

def get_machine_id(hostname):
    try:
        mb_serial = get_wmi_property("Win32_BaseBoard", "SerialNumber") or "MB-DEFAULT"
        cpu_id = get_wmi_property("Win32_Processor", "ProcessorId") or "CPU-DEFAULT"
        raw_seed = f"{hostname.upper()}-{mb_serial}-{cpu_id}"
        hash_val = hashlib.md5(raw_seed.encode('utf-8')).hexdigest().upper()
        return f"MID-{hash_val}"
    except Exception:
        hash_val = hashlib.md5(hostname.upper().encode('utf-8')).hexdigest().upper()
        return f"MID-{hash_val}"

def get_system_uptime():
    try:
        millis = ctypes.windll.kernel32.GetTickCount64()
        return int(millis / 1000)
    except Exception:
        return 0

def get_active_window_title():
    try:
        hwnd = ctypes.windll.user32.GetForegroundWindow()
        length = ctypes.windll.user32.GetWindowTextLengthW(hwnd)
        buff = ctypes.create_unicode_buffer(length + 1)
        ctypes.windll.user32.GetWindowTextW(hwnd, buff, length + 1)
        return buff.value or "Desktop"
    except Exception:
        return "Desktop"

def collect_full_hardware_specs():
    hostname = socket.gethostname()
    ram_str, _ = get_ram_info()
    resolution = get_screen_resolution()
    local_ip = get_local_ip()
    machine_id = get_machine_id(hostname)
    uptime = get_system_uptime()

    cpu_name = get_wmi_property("Win32_Processor", "Name") or platform.processor() or "Standard Processor"
    gpu_name = get_wmi_property("Win32_VideoController", "Name") or "Integrated Graphics"
    os_name = get_wmi_property("Win32_OperatingSystem", "Caption") or f"Windows {platform.release()}"
    mac_addr = get_wmi_property("Win32_NetworkAdapterConfiguration | Where-Object { $_.IPEnabled -eq $true }", "MACAddress") or ""

    # Total storage of system drive
    try:
        total_disk, _, _ = shutil.disk_usage("C:\\")
        storage_str = f"{round(total_disk / (1024**3))} GB"
    except Exception:
        storage_str = "256 GB"

    return {
        "hostname": hostname,
        "machineId": machine_id,
        "ip": local_ip,
        "mac": mac_addr,
        "cpu": cpu_name,
        "ram": ram_str,
        "gpu": gpu_name,
        "storage": storage_str,
        "os": f"{os_name} ({platform.machine()})",
        "resolution": resolution,
        "uptime": uptime
    }

def collect_live_telemetry():
    _, ram_percent = get_ram_info()
    active_window = get_active_window_title()

    # Fast CPU load approximation without psutil
    try:
        cpu_load = int(get_wmi_property("Win32_Processor", "LoadPercentage") or 5)
    except Exception:
        cpu_load = 5

    return {
        "cpuUsage": cpu_load,
        "ramUsage": ram_percent,
        "activeWindow": active_window[:40]
    }
