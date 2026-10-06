"""
Module: Student Agent Adaptive Screen Capture Engine
Captures desktop display, resizes, compresses to JPEG, and provides resilient standby fallback.
"""
import io
import time
from PIL import Image, ImageDraw

def capture_jpeg_frame(max_width=480, max_height=270, quality=60, label="PC-01"):
    # 1. Attempt Desktop Capture
    try:
        from PIL import ImageGrab
        img = ImageGrab.grab()
        if img:
            img.thumbnail((max_width, max_height), Image.Resampling.LANCZOS)
            buf = io.BytesIO()
            img.save(buf, format="JPEG", quality=quality, optimize=True)
            return buf.getvalue()
    except Exception:
        pass

    # 2. Resilient Standby Fallback (Used when desktop is locked or headless)
    try:
        img = Image.new("RGB", (max_width, max_height), color=(15, 23, 42))
        draw = ImageDraw.Draw(img)

        # Draw decorative grid lines
        for y in range(0, max_height, 40):
            draw.line([(0, y), (max_width, y)], fill=(30, 41, 59), width=1)
        for x in range(0, max_width, 60):
            draw.line([(x, 0), (x, max_height)], fill=(30, 41, 59), width=1)

        # Draw system status banner
        draw.rectangle([10, 10, max_width - 10, max_height - 10], outline=(56, 189, 248), width=2)
        draw.text((25, 25), f"TIS SMART LAB • {label}", fill=(56, 189, 248))
        draw.text((25, 55), "🟢 System Active • Screen Standby", fill=(16, 185, 129))
        draw.text((25, 85), f"Time: {time.strftime('%H:%M:%S')}", fill=(148, 163, 184))
        draw.text((25, 115), "Desktop in background / Power-save", fill=(203, 213, 225))

        buf = io.BytesIO()
        img.save(buf, format="JPEG", quality=quality)
        return buf.getvalue()
    except Exception:
        return b""
