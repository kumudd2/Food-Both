' FoodBooth Silent Background Launcher
Set WshShell = CreateObject("WScript.Shell")
Set objWMIService = GetObject("winmgmts:\\.\root\cimv2")

' Ensure PostgreSQL service is running
WshShell.Run "cmd /c net start postgresql-x64-18", 0, True

' Check if node serve.js is already running
Set colItems = objWMIService.ExecQuery("Select * from Win32_Process Where CommandLine Like '%serve.js%'")
If colItems.Count = 0 Then
    WshShell.CurrentDirectory = "d:\new"
    WshShell.Run "cmd /c node serve.js > server.log 2>&1", 0, False
End If
