"""
==============================================================================
TIAN XIN INTERNATIONAL SCHOOL (TIS) - SMART LAB STUDENT AGENT
Main Application Entry Point (Background Service + Status Window)
==============================================================================
"""
import os
import sys

# Ensure UTF-8 console output on Windows
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8', errors='replace')

import argparse
import asyncio
import threading

import config
from agent_client import StudentAgentClient
from agent_gui import StudentAgentGUI

def main():
    parser = argparse.ArgumentParser(description="TIS Student Agent — Computer Classroom Management")
    parser.add_argument("--enroll", "--token", help="One-Time Enrollment Token code", type=str, dest="enroll")
    parser.add_argument("--server", help="Classroom Management Server URL", type=str, default="http://localhost:8080")
    parser.add_argument("--silent", "--headless", help="Run in silent background mode without UI window", action="store_true")
    parser.add_argument("--autostart", help="Install into Windows Auto-Start", action="store_true")

    args = parser.parse_args()

    client = StudentAgentClient()

    # 1. Handle Auto-Start Installation
    if args.autostart:
        client.install_autostart()

    # 2. Handle Enrollment with Token
    if args.enroll:
        print(f"[*] Enrolling with token: {args.enroll} at {args.server}...")
        success, info = client.enroll_with_token(args.enroll, args.server)
        if not success:
            print(f"❌ Enrollment failed: {info}")
            sys.exit(1)
        print("[✓] Enrollment successful! Starting agent...")

    # 3. Start Background Asyncio Event Loop
    def run_async_loop():
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        loop.run_until_complete(client.start())

    bg_thread = threading.Thread(target=run_async_loop, daemon=True)
    bg_thread.start()

    # 4. Run GUI or Headless
    if args.silent:
        print("[Agent] Running in silent background mode. Press Ctrl+C to terminate.")
        try:
            while True:
                import time
                time.sleep(1)
        except KeyboardInterrupt:
            print("\n[Agent] Terminating...")
            sys.exit(0)
    else:
        # Launch simple student status window
        gui = StudentAgentGUI(client)
        gui.launch()

if __name__ == "__main__":
    main()
