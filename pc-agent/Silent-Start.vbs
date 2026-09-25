Set WshShell = CreateObject("WScript.Shell")
strScriptDir = CreateObject("Scripting.FileSystemObject").GetParentFolderName(WScript.ScriptFullName)
WshShell.CurrentDirectory = strScriptDir
WshShell.Run "powershell.exe -WindowStyle Hidden -NoProfile -ExecutionPolicy Bypass -File """ & strScriptDir & "\tis-lab-agent.ps1""", 0, False
Set WshShell = Nothing

