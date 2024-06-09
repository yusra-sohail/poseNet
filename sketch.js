let posenet ;
let noseX,noseY;
let singlePose;
let skeleton;
function setup() {
    createCanvas(800, 500);
    capture = createCapture(VIDEO)
    //we will hide this bec it will play 2 screens warna
    capture.hide()
    posenet = ml5.poseNet(capture,modelLoaded);
    posenet.on('pose',recievedPoses);

    

}
/////////////////////////////////////////////////////
function recievedPoses(poses){
    console.log(poses);
    if(poses.length > 0)//if one atleast one person is in the frame
    singlePose = poses[0].pose;
    skeleton = poses[0].skeleton;

      // Check if the person is standing straight
      let leftShoulder = singlePose.leftShoulder;
      let rightShoulder = singlePose.rightShoulder;
      let leftHip = singlePose.leftHip;
      let rightHip = singlePose.rightHip;
      
      // Calculate the angle between the shoulders and hips
      let shoulderHipAngle = atan2(rightHip.y - leftHip.y, rightHip.x - leftHip.x) - atan2(rightShoulder.y - leftShoulder.y, rightShoulder.x - leftShoulder.x);
      shoulderHipAngle = degrees(shoulderHipAngle);
      
      // If the angle is within a certain threshold, consider it as standing straight
      let straightThreshold = 40; // +-30 ka angle diff it will tolerate
      if (abs(shoulderHipAngle) < straightThreshold) {
          straightPoseWarning = false; // No warning needed
      } else {
          straightPoseWarning = true; // Warning needed
      }
  



   
}
//////////////////////////////////////////////////////////
function modelLoaded(){
    console.log('Model has loaded');
}
/////////////////////////////////////////////////////
//setup code runs 1 time, draw runs in an infinite loop
function draw() {

    image(capture, 0, 0, 0, 0);//taake it takes from center
   // console.log(noseX + " " + noseY);
    fill(255, 0, 0);
    if(singlePose){
    for(let i=0; i<singlePose.keypoints.length; i++){
        ellipse(singlePose.keypoints[i].position.x,singlePose.keypoints[i].position.y, 15, 15 );
    }
    stroke(255,255,255);
    strokeWeight(5);
    // for(let j=0; j<skeleton.length; j++){//to connect all points and form a skeleton
    //     line(skeleton[j][0].position.x, skeleton[j][0].position.y, skeleton[j][1].position.x, skeleton[j][1].position.y);
    for (let j = 0; j < skeleton.length; j++) {
        let partA = skeleton[j][0];
        let partB = skeleton[j][1];
        line(partA.position.x, partA.position.y, partB.position.x, partB.position.y);
    }
    
    if (straightPoseWarning) {
        fill(255, 0, 0);
        textSize(20);
        textAlign(CENTER);
        text("Please stand straight!", width / 2, height - 20);
    }

    }
}

//skeleton is a 2d array where every item is an array itself 
// part name position and ocnfidence will be given