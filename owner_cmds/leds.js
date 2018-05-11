var mqtt = require("../mqtt/mqtt_client.js");
var msg_svc = require("../bot_res/BasicEmbed.js");

var fx = ["solid","rainbow","twinkle","police all", "police one", "rainbow with glitter","sinelon","noise","ripple","glitter","lightning","rainbow beat","confetti 2"];
var RGBs = {
	red : "255,0,0",
	orange : "204,102,0",
	yellow : "255,255,51",
	green : "0,255,0",
	blue : "0,0,255",
	purple : "204,0,204",
	white : "255,255,255",
	black : "0,0,0"
}


function fromPercent(doubleValue,max) {
	let n = parseInt((doubleValue/100)*max);
	return n
}

function confirmEffect(effect) {
	for(var i = 0; i < fx.length; i++) {
 		if(fx[i] === effect.toLowerCase()) {
 			return true;
 		}
	}
	return false;
}

function postError(bot,msg) {
	let fx_str = "";
	for(var i = 0; i < fx.length; i++) {
		fx_str = fx_str + "\n\t" + fx[i];
	}
	msg_svc.run(bot,msg,["LEDs",1231150,`Error!`,`There was an issue with the command you are trying to execute :(\n\n**Commands:**\non\noff\neffect OR eff${fx_str}\nbright OR dim\nspeed OR time\ncolor`]);
}

exports.run = (bot, msg, args) => {
	if(args.length > 0) {
		let cmd = args.shift().toLowerCase();
		let current_status = mqtt.getStatus();

		if(typeof(current_status) !== 'undefined') {
		
			if(cmd === "on") {
				current_status["state"] = "ON";
				msg_svc.run(bot,msg,["LEDs",1231150,`State updated!`,`LED's have been set to on!`]);
				mqtt.putStatus(current_status);
			} else if(cmd === "off") {
				current_status["state"] = "OFF";
				msg_svc.run(bot,msg,["LEDs",1231150,`State updated!`,`LED's have been set to off!`]);
				mqtt.putStatus(current_status);
			} else if(cmd === "effect" || cmd === "eff" && args.length >= 1) {
				let eff = args.join(' ');
				if(confirmEffect(eff)===true) {
					current_status["effect"] = eff.toLowerCase();
					msg_svc.run(bot,msg,["LEDs",1231150,`Effect changed!`,`The effect has been changed to ${eff}!`]);
					mqtt.putStatus(current_status);
				} else {
					postError(bot,msg);
				}
			} else if(cmd === "bright" || cmd === "dim") {
				let n = parseInt(args[0]);
				if(n !== null) {
					let actual = fromPercent(n,255);
					console.log(actual);
					if(actual <= 255) {
						current_status["brightness"] = actual;
						msg_svc.run(bot,msg,["LEDs",1231150,`Effect changed!`,`Current effect brightness scale set to ${n}%`]);
						mqtt.putStatus(current_status);
					} else {
						msg_svc.run(bot,msg,["LEDs",1231150,`Effect err!`,`Effect brightness scale is from 0 - 100%!`]);
					}
				}
			} else if(cmd === "speed" || cmd === "time") {
				let n = parseInt(args[0]);
				if(n !== null) {
					if(n > 0 && n < 130) {
						current_status["transition"] = n;
						msg_svc.run(bot,msg,["LEDs",1231150,`Transition Speed`,`Speed has been changed to ${n}/130 ms!`]);
						mqtt.putStatus(current_status);
					} else {
						msg_svc.run(bot,msg,["LEDs",1231150,`Effect err!`,`Transition speed is a whole number value from 0 - 130 miliseconds!`]);
					}
				}
			} else if(cmd === "color") {
				let new_rgb = args[0].split(",");
				if(new_rgb.length === 3) {
					current_status["color"]["r"] = parseInt(new_rgb[0]);
					current_status["color"]["g"] = parseInt(new_rgb[1]);
					current_status["color"]["b"] = parseInt(new_rgb[2]);
					current_status["effect"] = "solid";
					msg_svc.run(bot,msg,["LEDs",1231150,`RGB changed!`,`The RGB of the "solid" effect:\nR: ${new_rgb[0]}\nG: ${new_rgb[1]}\nB: ${new_rgb[2]}\n\n(dont forget to update the effect)!`]);
					mqtt.putStatus(current_status);
				} else {
					msg_svc.run(bot,msg,["LEDs",1231150,`Parse failure!`,`Cannot change the colors :(\nPlease make sure to include a comma and ensure there are 3 arguments.\n\nYou may also just say a color name in place of the "color" command.\n\nHere's an example:\n\t"color 69,255,10"`]);
				}
			} else {
				for(k in RGBs) {
					if(cmd === k) {
						let new_rgb = RGBs[k].split(",");
						current_status["color"]["r"] = parseInt(new_rgb[0]);
						current_status["color"]["g"] = parseInt(new_rgb[1]);
						current_status["color"]["b"] = parseInt(new_rgb[2]);
						current_status["effect"] = "solid";
						msg_svc.run(bot,msg,["LEDs",1231150,`RGB changed!`,`The "solid" effect color has been set to ${k}!\n\n(dont forget to update the effect)!`]);
						mqtt.putStatus(current_status);
						return;
					}
				}
				postError();
			}
		} else {
			postError();
		}
	}
}
