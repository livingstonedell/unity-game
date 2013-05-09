var fx : AudioClip;

function Update()
{
	if (Input.GetButtonDown("Use"))
	{
		var hit : RaycastHit;
		if (Physics.Raycast(transform.position, transform.forward, hit, 2))
			if (hit.collider.gameObject.tag == "Door")
			{
				animator = hit.collider.gameObject.transform.parent.gameObject.GetComponent(Animator);
				animator.SetBool("doors_opened", !animator.GetBool("doors_opened"));
				audio.PlayOneShot(fx);
			}
	}
}