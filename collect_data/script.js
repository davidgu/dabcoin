$(document).ready(function () {
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
    var lastAcc = [];
    var lastVel = [];

    //if (window.DeviceOrientationEvent) {

    var sendData = function () {
        if (lastAcc.length > 0){

            lastAcc = lastAcc.slice(0, numCases);
            lastVel = lastVel.slice(0, numCases);
            var finalArr = [lastAcc, lastVel, isDab];
            $.ajax({
                type: "POST",
                url: "http://167.99.177.36:5000/send_dabs",
                data: {
                    'data': JSON.stringify(finalArr),
                }
            });
        }
    }


    window.addEventListener('devicemotion', function (event) {
        if (isMeasuring) {
            sendData();
            count1++;
            if (count1 % timeInterval == 0) {
                maxAX = event.acceleration.x.toFixed(2);
                maxAY = event.acceleration.y.toFixed(2);
                maxAZ = event.acceleration.z.toFixed(2);
                $("#words").html(maxAX + " " + maxAY + " " + maxAZ + " " + count1);
                acc.push([maxAX, maxAY, maxAZ]);
                if (acc.length >= numCases && acc.length >= numCases) {
                    $("#words3").html("STOPPED");
                    isMeasuring = false;
                    lastAcc = acc;
                    lastVel = vel;
                    acc = [];
                    cel = [];
                }
            }
        }
    });
    //  }
    //  if (window.DeviceOrientationEvent) {
    window.addEventListener("deviceorientation", function (event) {
        if (isMeasuring) {
            sendData();
            count2++;
            if (count2 % timeInterval == 0) {
                // alpha: rotation around z-axis
                var rotateDegrees = event.alpha.toFixed(2); + " " + count1
                // gamma: left to right
                var leftToRight = event.gamma.toFixed(2);
                // beta: front back motion
                var frontToBack = event.beta.toFixed(2);
                $("#words2").html(rotateDegrees + " " + leftToRight + " " + frontToBack);
                vel.push([rotateDegrees, leftToRight, frontToBack]);
                if (acc.length >= numCases && acc.length >= numCases) {
                    $("#words3").html("STOPPED");
                    isMeasuring = false;
                    lastAcc = acc;
                    lastVel = vel;
                    acc = [];
                    cel = [];
                }
            }
        }
    });

    $("#btn1").on("click", function () {
        isMeasuring = true;
        isDab = true;
        $("#words3").html("RUNNING");
    });
    $("#btn2").on("click", function () {
        isMeasuring = true;
        isDab = false;
        $("#words3").html("RUNNING");
    });
    $("#btn3").on("click",function(){
        lastAcc = [];
        lastVel = [];
        $("#btn3").html("undoed");
        setTimeout(function () {
            $("#btn3").html("undo");
        }, 1000);
    });
});
