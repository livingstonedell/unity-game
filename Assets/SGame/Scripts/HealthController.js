var maxHealth : int = 100;
var damageSound : AudioClip;
private var currentHealth : int = maxHealth;

function decreaseHealth(damage : int)
{
	audio.PlayOneShot(damageSound);
	currentHealth -= damage;
	if (currentHealth <= 0)
		Application.LoadLevel("level_03");
}

function increaseHealth(healing : int)
{
	currentHealth += healing;
	if (currentHealth > 100)
		currentHealth = 100;
}

function OnGUI()
{
	var hud : String = "Health: " + currentHealth.ToString();
	GUI.Label(Rect(5, 5, 100, 100), hud);
}