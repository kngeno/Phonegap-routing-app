var lastFlipVal = "off";
var accelWatch = null;
var options = { 'frequency' : 1900 };
var lastZ = null;

function updateAcceleration(a) {   
    var changeThreshhold = 12;
   
    if (lastZ !== null) {  // not first time
        var deltaZ = Math.abs(lastZ - a.z);
        if (deltaZ > changeThreshhold) {
            if (lastZ > 0) { $("#playaudio").trigger('tap'); }
            else { pauseAudio(); }         
            lastZ = null;         
            return;
            }
    }
    lastZ = a.z;
}

var setFlipper = function(state) {
    if (state === "off") {
        if (accelWatch) {
            navigator.accelerometer.clearWatch(accelWatch);
            accelWatch = null;
        }
    } else {
        accelWatch = navigator.accelerometer.watchAcceleration(
                updateAcceleration,
                function(ex) {
                    alert("accel fail (" + ex.name + ": " + ex.message + ")");
                },
                options);
    }   
};

$('#page-home').live('pageinit',function(){

    $("#playaudio").live('tap', function() {
        // Note: two ways to access media file: web and local file       
        var src = 'http://audio.ibeat.org/content/p1rj1s/p1rj1s_-_rockGuitar.mp3';
       
        // local (on device): copy file to project's /assets folder:
        // var src = '/android_asset/spittinggames.m4a';
       
        playAudio(src);
    });

    $("#pauseaudio").live('tap', function() {
        pauseAudio();
    });
   
    $("#stopaudio").live('tap', function() {
        setAudioPosition("0");
        $("#media_dur").html("0");
        stopAudio();
    });
   
});

function setAudioPosition(position) {
    $("#audio_position").html(position + " sec");
}

// Start with Manual selected and Flip Mode hidden
$('#nav-manual').focus();
$('#content-flip').hide();

$('#nav-manual').live('tap', function() {
    // if flip is ON, don't change pages
    if (lastFlipVal === "on") {
        alert("Set Flip Control OFF to switch to manual control.");
        return;
    }
    $('#content-flip').hide();
    $('#content-manual').show();
    stopAudio();
});

$('#nav-flip').live('tap', function() {
    $('#content-manual').hide();
    $('#content-flip').show();
});

$('#pauseslider').change(function() {
    if (lastFlipVal !== $(this).val()) {
        var newFlipVal = $(this).val();
        if (newFlipVal === "off") {
            stopAudio();
        }
        lastFlipVal = newFlipVal;
        setFlipper(newFlipVal);
        } // else a false alarm, no change in on/off
});