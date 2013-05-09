var moveSpeed : float = 6; // move speed
var turnSpeed : float = 90; // turning speed (degrees/second)
var lerpSpeed : float = 10; // smoothing speed
var gravity : float = 9.81; // gravity acceleration
var deltaGround : float = 0.5; // character is grounded up to this distance
var jumpSpeed : float = 10; // vertical jump initial speed
var jumpRange : float = 10; // range to detect target wall

private var surfaceNormal : Vector3; // current surface normal
private var myNormal : Vector3; // character normal
private var distGround : float; // distance from character position to ground
private var jumping = false; // flag "I'm jumping to wall"
private var vertSpeed : float = 0; // vertical jump current speed 
private var healthController : HealthController; // controller for the health

function Start()
{
	healthController = GetComponent(HealthController);
    myNormal = transform.up; // normal starts as character up direction 
    rigidbody.freezeRotation = true; // disable physics rotation
    distGround = collider.bounds.extents.y - collider.center.y;  
}

function FixedUpdate()
{
    // apply constant weight force according to character normal:
    rigidbody.AddForce(-gravity * rigidbody.mass * myNormal);
}

function Update()
{
    if (jumping) return;  // abort Update while jumping to a wall
    
    var hit : RaycastHit;
    if (Input.GetButtonDown("Jump"))
    {
        if (Physics.Raycast(Ray(transform.position, transform.forward), hit, jumpRange))
        {
            JumpToWall(hit.point, hit.normal);

			if (Physics.Raycast(Ray(transform.position, -Vector3.up), hit)) surfaceNormal = hit.normal;
			else surfaceNormal = Vector3.up; 
			myNormal = Vector3.Lerp(myNormal, surfaceNormal, lerpSpeed * Time.deltaTime);
        }
        else if (rigidbody.velocity.y >= -0.5 && rigidbody.velocity.y <= 0.5)
            rigidbody.velocity += jumpSpeed * myNormal;
    }
	
    // find forward direction with new myNormal:
    var myForward = Vector3.Cross(transform.right, myNormal);
    // align character to the new myNormal while keeping the forward direction:
    var targetRot = Quaternion.LookRotation(myForward, myNormal);
    
    transform.rotation = Quaternion.Lerp(transform.rotation, targetRot, lerpSpeed * Time.deltaTime);
    transform.Translate(Input.GetAxis("Horizontal") * moveSpeed * Time.deltaTime, 0,
						Input.GetAxis("Vertical") * moveSpeed * Time.deltaTime); 
}

function OnCollisionEnter(collision : Collision)
{
	if (collision.relativeVelocity.magnitude > 30)
		healthController.decreaseHealth(healthController.maxHealth);
	else if (collision.relativeVelocity.magnitude > 15)
		healthController.decreaseHealth(collision.relativeVelocity.magnitude * 2);
}

function JumpToWall(point: Vector3, normal: Vector3)
{
    jumping = true; // signal it's jumping to wall
    rigidbody.isKinematic = true; // disable physics while jumping
    
    var orgPos = transform.position;
    var orgRot = transform.rotation;
    var dstPos = point + normal * (distGround + 0.5); // will jump to 0.5 above wall
    var myForward = Vector3.Cross(transform.right, normal);
    var dstRot = Quaternion.LookRotation(myForward, normal);
    
    for (var t: float = 0.0; t < 1.0;)
    {
        t += Time.deltaTime;
        transform.position = Vector3.Lerp(orgPos, dstPos, t);
        transform.rotation = Quaternion.Slerp(orgRot, dstRot, t);
        yield; // return here next frame
    }
    myNormal = normal; // update myNormal
    rigidbody.isKinematic = false; // enable physics
    jumping = false; // jumping to wall finished
}