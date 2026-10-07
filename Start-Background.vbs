Set WshShell = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")
strDir = fso.GetParentFolderName(WScript.ScriptFullName)
WshShell.CurrentDirectory = strDir

' Launch node server.js completely hidden in background (0 = hide window, False = don't wait)
WshShell.Run "cmd.exe /c cd /d """ & strDir & """ && node server.js", 0, False

' Check arguments: if launched with /autostart or /silent, do not pop open browser
bOpenBrowser = True
If WScript.Arguments.Count > 0 Then
    For i = 0 To WScript.Arguments.Count - 1
        arg = LCase(WScript.Arguments(i))
        If arg = "/autostart" Or arg = "-autostart" Or arg = "--silent" Or arg = "/silent" Then
            bOpenBrowser = False
        End If
    Next
End If

If bOpenBrowser Then
    WScript.Sleep 1500
    WshShell.Run "http://localhost:8080/"
End If
