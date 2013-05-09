function OnGUI()
{
	GUI.Box(Rect(10, 10, 200, 90), "The Well");
	
	if (GUI.Button(Rect(20, 40, 180, 20), "Start"))
		Application.LoadLevel("level_01");
	if (GUI.Button(Rect(20, 70, 180, 20), "Quit"))
		Application.Quit();
}