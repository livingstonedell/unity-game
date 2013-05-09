var target : Collider;

var takenDamage : AudioClip;
var scream : AudioClip;
var death : AudioClip;

var maxHealth : int = 3;
var swordDamage : int = 1;
var dead : boolean = false;

private var currentHealth : int = maxHealth;
private var animator : Animator;
private var stopAnim : int = 0;

function Start()
{
	animator = GetComponentInChildren(Animator);
}

function FixedUpdate()
{
	if (stopAnim > 0)
	{
		if (stopAnim > 100)
		{
			dead = true;
			audio.PlayOneShot(death);
			stopAnim = 0;
			animator.SetBool("dead", false);
			animator.SetBool("attack", false);
			animator.SetBool("move", false);
			animator.SetBool("idle", false);
		}
		else
			stopAnim++;
	}
}

function OnTriggerEnter(collision : Collider)
{
	if (dead) return ;
	if (collision == target)
	{
		audio.PlayOneShot(takenDamage);
		audio.PlayOneShot(scream);
		currentHealth -= swordDamage;
		if (currentHealth <= 0)
		{
			animator.SetBool("dead", true);
			stopAnim = 1;
		}
	}
}