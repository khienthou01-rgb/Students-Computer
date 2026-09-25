Set WshShell = CreateObject("WScript.Shell")
strDir = CreateObject("Scripting.FileSystemObject").GetParentFolderName(WScript.ScriptFullName)
WshShell.CurrentDirectory = strDir
WshShell.Run "node server.js", 0, False
WScript.Sleep 1000
WshShell.Run "http://localhost:8080/"
