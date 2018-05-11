// Bot core:
const Discord = require("discord.js");
const bot = new Discord.Client();
const mqtt = require("./mqtt/mqtt_client.js");

// Essentials:
const fs = require("fs");
const config = require("./config.json");
//
const rbotico = "https://i.imgur.com/Xq7hFKK.png";

//
const names = require("./bot_res/ToName.js");

// fun stuff
const isBotOwner = require("./admin/botowner.js");
const isServerOwner = require("./admin/serverowner.js");
const isAdmin = require("./admin/admin.js");
const isFriend = require("./admin/friends.js");

// Do we want log files
var command_log_mode = true;
var log_all_conversation = false;
//

var colors = {
	red : 10101050,
	lime_green : 1231150,
	bright_green : 1111150,
	bright_blue : 235250,
	dark_blue : 250,
	purple : 10101150,
	violet : 11101150,
}

var msg_svc = require("./bot_res/BasicEmbed.js");

function setGame(arg) {
	var game = arg;
	if(!arg){
		game = `Say "${config.prefix}cmds" for commands!`;
	}
	bot.user.setGame(game); 
}

bot.on('ready', () => {
  console.log(`Logged in as ${bot.user.tag}!\nSay "${config.prefix}cmds" for a list of commands.`);
  bot.user.settings.showCurrentGame = true;
  console.log(`Client ID ${bot.user}`);
  setGame();
  console.log("Start MQTT");
  mqtt.startMQTT()
});

function getContextLevel(msg) {
	let level = 4;
	if(isBotOwner.run(msg.author)){
		level = 0;
	} else if(isServerOwner.run(msg.author,msg.guild)) {
		level = 1;
	} else if(isAdmin.run(msg.author,msg.guild,msg)) {
		level = 2; 
	} else if(isFriend.run(msg.author)) {
		level = 3;
	}
	return level;
}

bot.on("message", (msg) => {

	if(log_all_conversation === true) {
		console.log(`(${msg.server.name} / ${msg.channel.name}) ${msg.author.tag}: ${msg.content}`);
	}

	if(msg.content.indexOf(config.prefix) !== 0) return 0;

		// we will need to tag it as bot.
 	const args = msg.content.slice(config.prefix.length).trim().split(/ +/g);
  	const command = args.shift().toLowerCase();
  	//
  	if(command_log_mode === true) {
  		console.log(`${msg.author} id ${msg.author.id} tag ${names.run(msg.author.tag)} ran command "${command}"\n${msg}`);
  	}
  	//
  	let context = getContextLevel(msg);
  	// Catch any command errors:
  	try {
	  	if(command === "pref" && context === 0) {
			let newPref = args[0]
			let old = config.prefix;
			config.prefix = newPref;
			//
			fs.writeFile("./config.json",JSON.stringify(config),(err) => console.error);
			//
			msg_svc.run(bot,msg,["Prefix Update!",colors.red,`${names.run(msg.author.tag)} updated the prefix!`,`In order to run commands, say "${config.prefix}" before each command instead of "${old}".`]);
			setGame();
	  	} else if(command == "roles" && context <= 4) {
	  		let roles = require("./bot_res/getroles.js");
	  		let list = roles.run(bot,msg);

	  		msg_svc.run(bot,msg,["Server Roles:",colors.dark_blue,`List of roles:`,`\n ${list}`]); // */

	  	} else if(command === "modrole" && context <= 1) {
	  		let roleKey = args[0];
	  		let roleCheck = require("./bot_res/roleExists.js");
	  		
	  		if(roleCheck.run(bot,msg,roleKey,args) == true) {
		  		let cfg_edit = require("./bot_res/edit_config.js");
		  		let result = cfg_edit.run(msg.guild.id,"mode_role",roleKey);
		  		if(result == true) {
		  			msg_svc.run(bot,msg,["Role Update!",colors.purple,`${names.run(msg.author.tag)} changed server admin role!`,`The new server admin role is "${roleKey}", please review the people with this role as they will be able to use the bot's moderation powers.`]);
		  		} else {
		  			msg_svc.run(bot,msg,["Role Update Failed!",colors.red,`Sorry ${names.run(msg.author.tag)}!`,`It appears the database may be down or there is a permissions error with the server & the bots configuration. The query was not found.`]);
		  		}
	  		} else {
		  		let roles = require("./bot_res/getroles.js");
		  		let list = roles.run(bot,msg);

	  			msg_svc.run(bot,msg,["Role Update Failed!",colors.red,`Setting requires proper spelling!`,`The following is a list of roles, please make sure you spelt it correctly:\n ${list}`]);
	  		}
	  	} else if(command === "muterole" && context <= 1) {
	  		let cfg_edit = require("./bot_res/edit_config.js");
	  		cfg_edit.run(msg.server.id,"shutup_role",args[0]);
	  	} else if(fs.existsSync(`./admin_cmds/${command}.js`)) {
	  		if(context <= 2) {
					let commandFile = require(`./admin_cmds/${command}.js`);
					commandFile.run(bot, msg, args);
	  		} else {
	  			msg.reply("Sorry, your permissions do not allow you to run this command. :(");
	  		}
		} else if(fs.existsSync(`./owner_cmds/${command}.js`) && (context === 0 || context === 4)) {
	  		let commandFile = require(`./owner_cmds/${command}.js`);
			commandFile.run(bot, msg, args);
	  	} else if(fs.existsSync(`./public_cmds/${command}.js`)) {
	  		let commandFile = require(`./public_cmds/${command}.js`);
			commandFile.run(bot, msg, args);
	  	} else {
	  		msg.reply(`Sorry the command "${command}" was either not found, or your permissions do not allow this context level. :(`);
	  	}
	} catch(err) {
		console.log(`[COMMAND ERROR]\n\t[LOG]:${msg.author.tag} ran command "${command}"`);
		console.error(err);
		msg.reply(`The command "${command}" was unable to be completed.`);
	}
});

bot.login(config.token);
