//-- Config

// connects to mqtt for lights 


var hostIP = "192.168.0.175";
var mqtt_port = 1883;//16019; // mine 1883

var MQTTclientID = "RedbotLEDController";

var authenticated = true;
var user = "lhqqahxu";//"LHQQAHHXU";
var pass= "6GFQQOSJ7z7l";
//
//
var sub_topic = "bramp/home";
var put_topic = "bramp/home/set";
var defaultPayload = {
    "brightness": 255,
    "color": {
      "r": 255,
      "g": 255,
      "b": 255
    },
    "flash": 2,
    "transition": 60,
    "state": "ON"
 };


// Defs
var mqtt = require("mqtt")
var client;

var current_status;

var isReconnect = false;

function reconnect() {
	if(client.connected === false && isReconnect === false){
		isReconnect = true;
		client.reconnect();
		console.log("Reconnecting to MQTT");
		let t = 0;
		while(client.reconnecting === true || t > 100) {
			t=t+1
			if(t > 100) {
				console.log("MQTT failed to reconnect");
				return;
			}
		}

		console.log("MQTT connected!");
//		client.subscribe(sub_topic);
		isReconnect = false;
		//
		publish();
	}
}

function publish() {
	if(client.connected === false) {
		reconnect();
		return;
	}

	if(typeof(current_status) !== 'undefined') {
		client.publish(put_topic,JSON.stringify(current_status));
	} else {
		console.log("There is no status to publish :(");
	}
}

module.exports = {

	startMQTT: function () {
		if(!authenticated) {
			client = mqtt.connect([{host : hostIP, port : mqtt_port}]);
		} else {
			console.log("Connecting authenticated MQTT",hostIP);
			client = mqtt.connect([{host : hostIP, port : mqtt_port, username : user, password : pass, clientId : "discordbot"}]);
		}
		//
		client.on('connect', function () {
			console.log("MQTT Client activated!");
			client.subscribe(sub_topic);
			current_status = defaultPayload;
		});

		client.on('message', function (topic, message) {
		  // message is Buffer
		  current_status = JSON.parse(message);
		 // console.log(current_status);
		  //console.log(message.toString())
//		  client.end()
		});
	},

	getStatus: function() {
		if(typeof(current_status) === 'undefined') {
			//console.log("Did you forget to start the MQTT server?");
			return defaultPayload;
		}
		return current_status;
	},

	putStatus: function(new_status) {
		current_status = new_status;
		publish();
	}

}
