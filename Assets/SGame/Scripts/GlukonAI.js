var Target : Transform;
var path : Pathfinding.Path; //The calculated path
var speed : float = 100; //The AI's speed per second
var nextWaypointDistance : float = 3; //The max distance from the AI to a waypoint for it to continue
var detectionDistance : float = 15;
var attackDistance : float = 2.5;
var damageDealt : float = 12;
var attackSound : AudioClip;

private var animator : Animator;
private var playerHealth : HealthController;
private var healthController : TakeDamage;
private var targetPosition : Vector3; //The point to move to
private var seeker : Seeker;
private var controller : CharacterController;
private var currentWaypoint : int = 0; //The waypoint we are currently moving towards
private var foundPlayer : boolean = false;
private var attackingPlayer : int = 0;

function Start()
{
	playerHealth = Target.gameObject.GetComponent(HealthController);
	animator = GetComponentInChildren(Animator);
	seeker = GetComponent(Seeker);
	controller = GetComponent(CharacterController);
	healthController = GetComponent(TakeDamage);
}

function OnPathComplete(p : Pathfinding.Path)
{
	if (!p.error)
	{
		path = p;
		currentWaypoint = 0;
	}
}

function FixedUpdate()
{
	if (healthController.dead) return ;
	
	var distanceBetween = Vector3.Distance(Target.position, transform.position);
	if (distanceBetween <= detectionDistance)
	{		
		var RotationSpeed : float = 10;
		var _lookRotation : Quaternion;
		var _direction : Vector3;
		
		_direction = (Target.position - transform.position).normalized;
		_lookRotation = Quaternion.LookRotation(_direction);
		transform.rotation = Quaternion.Slerp(transform.rotation, _lookRotation, Time.deltaTime * RotationSpeed);
		
		foundPlayer = true;
	}
	
	if (attackingPlayer > 0)
	{
		if (attackingPlayer > 100)
		{
			audio.PlayOneShot(attackSound);
			attackingPlayer = 0;
			if (distanceBetween <= attackDistance)
				playerHealth.decreaseHealth(damageDealt);
		}
		else
			attackingPlayer++;
	}
	
	if (distanceBetween <= attackDistance)
	{
		animator.SetBool("move", false);
		animator.SetBool("attack", true);
		if (!attackingPlayer)
			attackingPlayer = 1;
	}
	else if (foundPlayer)
	{
		seeker.StartPath(transform.position, Target.position, OnPathComplete);
		
		if (path == null)
			return ;
		if (currentWaypoint >= path.vectorPath.Count)
			return ;
			
		animator.SetBool("attack", false);
		animator.SetBool("move", true);

		var dir : Vector3 = (path.vectorPath[currentWaypoint] - transform.position).normalized;
		dir *= speed * Time.fixedDeltaTime;
		controller.SimpleMove(dir);
		
		if (Vector3.Distance (transform.position,path.vectorPath[currentWaypoint]) < nextWaypointDistance)
		{
			currentWaypoint++;
			return ;
		}
	}
}
