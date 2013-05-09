function OnGUI()
{
	GUI.Box(Rect(10, 10, 200, 120), "You died.");
	
	if (GUI.Button(Rect(20, 40, 180, 20), "Retry"))
		Application.LoadLevel("level_01");
	if (GUI.Button(Rect(20, 70, 180, 20), "Return to main menu"))
		Application.LoadLevel("level_00");
	if (GUI.Button(Rect(20, 100, 180, 20), "Quit"))
		Application.Quit();
}