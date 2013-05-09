var fx : AudioClip;

private var animLaunched = 0;
private var animator : Animator;
private var functions = [RightAttack, LeftAttack, EstocAttack];

function Start()
{
	animator = GetComponent(Animator);
}

function FixedUpdate()
{
	if (animLaunched > 0)
	{
		if (animLaunched > 150)
		{
			animator.SetBool("right_attack", false);
			animator.SetBool("left_attack", false);
			animator.SetBool("estoc_attack", false);
			animLaunched = 0;
		}
		else
			animLaunched++;
	}	
}

function Update()
{
	if (Input.GetButton("Fire1") && !animLaunched)
	{
		audio.PlayOneShot(fx);
		functions[Random.Range(0, functions.Length)]();
		animLaunched = 1;
	}
}

function RightAttack()
{
	animator.SetBool("right_attack", true);
}

function LeftAttack()
{
	animator.SetBool("left_attack", true);
}

function EstocAttack()
{
	animator.SetBool("estoc_attack", true);
}