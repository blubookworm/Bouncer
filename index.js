//variable to keep track of whether or not the RFduino is connected to the phone
var check = -1;
// Short name for RFduino BLE library.
var rfduinoble = evothings.rfduinoble;

// Application object.
var app = {};

// Connected device.
app.device = null;

// Turn on LED.
app.ledOn = function()
{
	app.device && app.device.writeDataArray(new Uint8Array([1]));
};

// Turn off LED.
app.ledOff = function()
{
	app.device && app.device.writeDataArray(new Uint8Array([0]));
};

app.showMessage = function(info)
{
	document.getElementById("info").innerHTML = info;
};

// Called when BLE and other native functions are available.
app.onDeviceReady = function()
{
	app.showMessage('Press the connect button');
};

app.connect = function()
{
	console.log("close");
	rfduinoble.close();

	// Wait 500 ms for close to complete before connecting.
	setTimeout(function()
	{
		console.log("connecting");
		app.showMessage("Connecting...");
		rfduinoble.connect(
			"RFduino",
			function(device)
			{
				console.log("connected");
				app.showMessage("Connected");
				$('#state1').css('visibility','visible');
				$('#connect').css('visibility','visible');
				$('#loading').css('visibility','hidden');
				app.device = device;
			},
			function(errorCode)
			{
				$('#state1').css('visibility','visible');
				$('#connect').css('visibility','visible');
				$('#state2').css('visibility','hidden');
				app.showMessage("Connect error: " + errorCode);
			});
		},
		500); 
	while(check == 1){
		app.readCount();
	}
};

//       00002222-0000-1000-8000-00805f9b34fb
app.readCount = function()
   {
      app.device.readCharacteristic(
         '00002221-0000-1000-8000-00805f9b34fb',
         function(data){
            //app.showMessage([new DataView(data).getFloat32(0, true)]);
            console.log("TAMPERED WITH");
         },
         function(errorCode)
         {
            app.showMessage("Connect error: " + errorCode);
         }
      );   
   };   


// When the app is fully loaded the "deviceready" event is triggered.
document.addEventListener(
	'deviceready',
	function() { evothings.scriptsLoaded(app.onDeviceReady) },
	false);


function settingsDisappear(){

}

$('#settings').click(function(){
	$('#overlay').css('background-color','#000');	
	$('#overlay').css('opacity','.4');
	$('#display').css('left','0px');
	$('#overlay').css('visibility','visible');
	$('#headerBackButton').css('visibility', 'visible');
	$('#headerBackButton').click(function(){
		$('#overlay').css('background-color','#FFF');	
		$('#overlay').css('opacity','0');
		$('#display').css('left','calc(0px - 75%)');
		$('#overlay').css('visibility','hidden');
		$('#headerBackButton').css('visibility', 'hidden');
		$('#headerBackButton').click(history.back());
	});
});
$('#overlay').click(function(){
	$('#overlay').css('background-color','#FFF');	
	$('#overlay').css('opacity','0');
	$('#display').css('left','calc(0px - 75%)');
	$('#overlay').css('visibility','hidden');
	$('#headerBackButton').css('visibility', 'hidden');
	$('#headerBackButton').click(history.back());
});

function togglePair(element){
	if(element.checked)
	{
		app.connect();
//		window.open(loading.html);
		console.log("GOT HERE" + element.checked);
		$('#state1').css('visibility','hidden');
		$('#connect').css('visibility','hidden');
		$('#loading').css('visibility','visible');
		check = 1;
	}
	else{
		$('#state1').css('visibility','visible');
		$('#connect').css('visibility','visible');
		$('#loading').css('visibility','hidden');
		check = -1;
	}
}