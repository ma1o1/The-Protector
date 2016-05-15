

var digitalAccelerometer = require('jsupm_mma7660');

var m = require('mraa'); 
var myLed = new m.Gpio(13);
myLed.dir(m.DIR_OUT);
var ledState = 1;

var upmBuzzer = require("jsupm_buzzer");
var myBuzzer = new upmBuzzer.Buzzer(5);
var chords = [];
chords.push(upmBuzzer.DO);
chords.push(upmBuzzer.RE);
chords.push(upmBuzzer.MI);
chords.push(upmBuzzer.FA);
chords.push(upmBuzzer.SOL);
chords.push(upmBuzzer.LA);
chords.push(upmBuzzer.SI);
chords.push(upmBuzzer.DO);
chords.push(upmBuzzer.SI);
var chordIndex = 0;

myBuzzer.setVolume(0.03);

var groveSensor = require('jsupm_grove');
var button = new groveSensor.GroveButton(3);

    var myDigitalAccelerometer = new digitalAccelerometer.MMA7660(

                        digitalAccelerometer.MMA7660_I2C_BUS,

                        digitalAccelerometer.MMA7660_DEFAULT_I2C_ADDR);

    myDigitalAccelerometer.setModeStandby();

    myDigitalAccelerometer.setSampleRate(digitalAccelerometer.MMA7660.AUTOSLEEP_64);

    myDigitalAccelerometer.setModeActive();
 

    var x, y, z;

    x = digitalAccelerometer.new_intp();
    y = digitalAccelerometer.new_intp();
    z = digitalAccelerometer.new_intp();

    var ax, ay, az;
    var gRel, gAverage, gSTD, N, gRelVar, FALL, FALLc;
    var count
    
    N = 1;
    gAverage = 1.014;
    gSTD = 0.2;
    FALLc = 0;
    count = 1;
    
    ax = digitalAccelerometer.new_floatp();
    ay = digitalAccelerometer.new_floatp();
    az = digitalAccelerometer.new_floatp();

    
    var outputStr;

     

    var myInterval = setInterval(function()

    {
        N = N + 1;

        myDigitalAccelerometer.getAcceleration(ax, ay, az);
    
        gRel = (Math.sqrt(digitalAccelerometer.floatp_value(ax)*digitalAccelerometer.floatp_value(ax) + digitalAccelerometer.floatp_value(ay)*digitalAccelerometer.floatp_value(ay) + digitalAccelerometer.floatp_value(az)*digitalAccelerometer.floatp_value(az)));
        gAverage = (N-1)/N * gAverage + gRel/N;
        gSTD = Math.sqrt(  (N-1)/N * gSTD*gSTD + 1/N * (gRel-gAverage)* (gRel-gAverage)  );
        gRelVar = (gRel - gAverage)
        
        if (Math.abs(gRelVar) > 1.4)
        {
            FALL = true;
            myBuzzer.playSound(chords[0], 0);
            outputStr = "Grandma's fallen." + " gRelVar : " + gRelVar;
            
            console.log(outputStr);
            FALLc = FALLc + 1;
            ledState = 1;
            
            report_fall('true')
        }
        else
        {
            FALL = false;
    
        }
        myLed.write(ledState);
        

        count=count+1;
        
        if (count == 101)
        {
            
            
            outputStr = "Statistics gRel: " + roundNum(gRel,6)
        
            + "gAverage : " + roundNum(gAverage, 6)
            + "| gSTD : " + roundNum(gSTD,6)
            //+ "| Signal in terms of mean + N*gSTD: "  + roundNum(gRelVar,6)
            + "| Fallen : " + FALLc + " times ";
            
            console.log(outputStr);
        }
        if (count>101)
        {
            count = 1;
        }
        
            if(button.value() == 1){
                myBuzzer.stopSound();
                ledState = 0;
                report_fall('false')
            }
        
    }, 10);

    

    function roundNum(num, decimalPlaces)

    {
        var extraNum = (1 / (Math.pow(10, decimalPlaces) * 1000));

        return (Math.round((num + extraNum)
            * (Math.pow(10, decimalPlaces))) / Math.pow(10, decimalPlaces));

    }
    
    function report_fall(message){
        
        var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
        var req = new XMLHttpRequest();
        var mystring = 'http://fallalert-pes1.rhcloud.com/send/' + message;
        req.open('POST', mystring);
        req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        var obj = {hello:'world'};
        req.send(JSON.stringify(obj));

        
    }

    process.on('SIGINT', function()

    {

        clearInterval(myInterval);
        digitalAccelerometer.delete_intp(x);
        digitalAccelerometer.delete_intp(y);
        digitalAccelerometer.delete_intp(z);

        digitalAccelerometer.delete_floatp(ax);
        digitalAccelerometer.delete_floatp(ay);
        digitalAccelerometer.delete_floatp(az);

        myDigitalAccelerometer.setModeStandby();

        console.log("Exiting...");
        myBuzzer.stopSound();
        process.exit(0);
        

    });
    
    