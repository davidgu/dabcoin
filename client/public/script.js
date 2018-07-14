$(document).ready(function() {
  var maxAX = 0;
  var maxAY = 0;
  var maxAZ = 0;
  var count1 = 0;
  var count2 = 0;

  var isMeasuring = false;
  var isDab = false;

  var acc = [];
  var vel = [];
  const numCases = 21; // the cases = 20
  const timeInterval = 3;
  //if (window.DeviceOrientationEvent) {

  var sendData = function(){
    isMeasuring = false;
    acc = acc.slice(0,numCases);
    vel = vel.slice(0,numCases);
    var finalArr = [acc,vel,isDab];
    $("#words3").html("STOPPED");
    $.ajax({
      type: "POST",
      url: "http://one.dabcoin.1lab.me:5000/mine",
      dataType: "json",
      data: {
        'dab_data':JSON.stringify(finalArr),
        'address': window.localStorage.getItem('address')
      }
    });
    acc = [];
    cel = [];
  }


  window.addEventListener('devicemotion', function(event) {
    if(isMeasuring){
      count1++;
      if(count1%timeInterval == 0){
        maxAX = event.acceleration.x.toFixed(2);
        maxAY = event.acceleration.y.toFixed(2);
        maxAZ = event.acceleration.z.toFixed(2);
        $("#words").html(maxAX + " " + maxAY + " " + maxAZ + " " + count1);
        acc.push([maxAX,maxAY,maxAZ]);
        if(acc.length >= numCases && acc.length >= numCases){
          sendData();
        }
      }
    }
  });
  //  }
  //  if (window.DeviceOrientationEvent) {
  window.addEventListener("deviceorientation", function(event) {
    if(isMeasuring){
      count2++;
      if(count2%timeInterval == 0){
        // alpha: rotation around z-axis
        var rotateDegrees = event.alpha.toFixed(2); + " " + count1
        // gamma: left to right
        var leftToRight = event.gamma.toFixed(2);
        // beta: front back motion
        var frontToBack = event.beta.toFixed(2);
        $("#words2").html(rotateDegrees + " " + leftToRight + " " + frontToBack);
        vel.push([rotateDegrees,leftToRight,frontToBack]);
        if(acc.length >= numCases && acc.length >= numCases){
          sendData();
        }
      }
    }
  });

  $("#btn1").on("click",function(){
    isMeasuring = true;
    isDab = true;
    $("#words3").html("RUNNING");
  });
  $("#btn2").on("click",function(){
    isMeasuring = true;
    isDab = false;
    $("#words3").html("RUNNING");
  });
});
