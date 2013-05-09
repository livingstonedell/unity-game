using UnityEngine;
using System.Collections;
 
public class WalkingSound: MonoBehaviour 
{
	public float walkRepeatingTime = 0.5f;
	public float runRepeatingTime = 0.3f;
	 
	private bool isRuning = false;
	private bool isWalking = false;
	private bool waitForNextStep = false;
	 
	private AudioSource stepSoundPlayer;
	public AudioClip[] randomStepSounds;
	 
	void Start()
	{
		stepSoundPlayer = gameObject.GetComponent<AudioSource>();
	}
	
	void FixedUpdate()
	{
		if (!stepSoundPlayer.isPlaying)
			stepSoundPlayer.volume = 1;
	}
	 
	void Update()
	{
		if (Input.GetKeyDown(KeyCode.W) || Input.GetKeyDown(KeyCode.S))
			isWalking = true;
		if (Input.GetKeyUp(KeyCode.W) || Input.GetKeyUp(KeyCode.S))
			isWalking = false;
		if (Input.GetKeyDown(KeyCode.LeftShift))
			isRuning = true;
		if (Input.GetKeyUp(KeyCode.LeftShift))
			isRuning = false;
		 
		if (isWalking)
		{
			if (isRuning && !waitForNextStep)
			{
				StartCoroutine(WaitForPlay(runRepeatingTime));
				waitForNextStep = true;
			}
			else if (!waitForNextStep)
			{
				StartCoroutine(WaitForPlay(walkRepeatingTime));
				waitForNextStep = true;
			}
		}
	}
	 
	IEnumerator WaitForPlay(float delayTime)
	{
		yield return new WaitForSeconds(delayTime);
		stepSoundPlayer.clip = randomStepSounds[Random.Range(0, randomStepSounds.Length)];
		waitForNextStep = false;
		stepSoundPlayer.volume = 0.2f;
		stepSoundPlayer.Play();
	}
}