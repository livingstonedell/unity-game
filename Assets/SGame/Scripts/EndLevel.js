var target : Collider;
var nameLevel : String;

function OnTriggerEnter(collision : Collider)
{
	if (collision == target)
		Application.LoadLevel(nameLevel);
}