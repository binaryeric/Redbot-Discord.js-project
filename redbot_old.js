// Bot core:
const Discord = require("discord.js");
const bot = new Discord.Client();

// Essentials:
const fs = require("fs");
const config = require("./config.json");
//
const rbotico = "https://i.imgur.com/Xq7hFKK.png";

//
const names = require("./bot_res/ToName.js");

// Do we want log files
var command_log_mode = true;
var log_all_conversation = false;
//
function setGame(arg) {
	var game = arg;
	if(!arg){
		game = `Say "${config.prefix}cmds" for commands!`;
	}
	bot.user.setGame(game); // CURRENTLY BROKEN
	//bot.user.setPresence({game: {name: game, type: 0}});
}

function isOwnerContext(usr_object) {
	return usr_object.id === config.owner_id;
}

function isAdmin(msg) {
	return msg.member.roles.find("name","Moderators");
}

// 	 
fs.readdir("./admin_cmds",(err,files) =>{
	if(err) return console.error(err);
	// Read each file from "cmds" directory and attach it to an event
	files.forEach(file => {
		let evtFn = require(`./admin_cmds/${file}`);
		let evtName = file.split(".")[0];

		// Call events under cmds file.
		bot.on(evtName, (...args) => evtFn.run(bot, ...args));
	});
});

fs.readdir("./public_cmds",(err,files) =>{
	if(err) return console.error(err);
	// Read each file from "cmds" directory and attach it to an event
	files.forEach(file => {
		let evtFn = require(`./public_cmds/${file}`);
		let evtName = file.split(".")[0];

		// Call events under cmds file.
		bot.on(evtName, (...args) => evtFn.run(bot, ...args));
	});
});


bot.on('ready', () => {
  console.log(`Logged in as ${bot.user.tag}!\nSay "${config.prefix}cmds" for a list of commands.`);
  bot.user.settings.showCurrentGame = true;
  console.log(`Client ID ${bot.user}`);
  setGame();
});

bot.on("message", (msg) => {
	//

	if(log_all_conversation === true) {
		console.log(`(${msg.server.name} / ${msg.channel.name}) ${msg.author.tag}: ${msg.content}`);
	}


	if(msg.content.indexOf(config.prefix) !== 0) return 0;


		// we will need to tag it as bot.
	 	const args = msg.content.slice(config.prefix.length).trim().split(/ +/g);
	  	const command = args.shift().toLowerCase();
	  	//
	  	if(command_log_mode === true) {
	  		console.log(`${names.run(msg.author.tag)} ran command "${command}"`);
	  	}
	  	//
	  	if(command === "cmds") {
			msg.channel.send({embed: {
				color: 5100030,
				title: "redbot Commands",
				fields: [{
				name: "Public Command Set:",
				value: `**${config.prefix}cmds**\nReturns command list for the bot.\n\n`
				},
				{
				name: "Owner:",
				value: `**${config.prefix}pref [new prefix]**\nChanges the bot prefix.\n\n
**${config.prefix}game [game]**\nSet's the current game the bot's playing.\n\n`
				},
				{
				name: "Moderator:",
				value: `**${config.prefix}kick [@mention user]**\nKicks user from the server (if permission granted).\n\n
**${config.prefix}mdel [amount] [text-channel] [@mention user]**\nDeletes messages from [@mention user] for any number [amount] less than 100. If you don't specify the text channel [text-channel], it defaults to the one you run the command in. (Ofcourse, only if I have the power to do so).\n\n
**${config.prefix}clear [number of messages]**\nDeletes n, number of messages above the command for all users.\n*(Manage Messages perm is required.)*\n\n
**${config.prefix}kick [@mention user]**\nKicks user from the server (if permission granted).\n\n
**${config.prefix}nick [@mention user] [nick name]**\nChanges the nickname for the user.\nNote that you can ignore the [@mention] parameter to set bot nickname.\n\n`
				}],
				footer :{
					icon_url: rbotico,
					text: "redbot_alpha | command set"
				}
			}});

	  	} else if(command === "pref" && isOwnerContext(msg.author)) { //msg.author === bot.user
			let newPref = args[0]
			let old = config.prefix;
			config.prefix = newPref;
			//
			fs.writeFile("./config.json",JSON.stringify(config),(err) => console.error);
			let cmd = require("./bot_res/BasicEmbed.js");
			//
			cmd.run(bot,msg,["Prefix Update!",1227103,`${names.run(msg.author.tag)} updated the prefix!`,`In order to run commands, say "${config.prefix}" before each command instead of "${old}".`]);
			setGame();
			//
		} else if(command == "game" && isOwnerContext(msg.author)){
			setGame(args.join(" "));
		} else {
		 	// The list of if/else is replaced with those simple 2 lines:
			try { 	
				if(fs.existsSync(`./public_cmds/${command}.js`)) {
					let commandFile = require(`./public_cmds/${command}.js`);
					commandFile.run(bot, msg, args);
				} else if(fs.existsSync(`./admin_cmds/${command}.js`)) {
					if(isAdmin(msg.author)) {
						let commandFile = require(`./admin_cmds/${command}.js`);
						commandFile.run(bot, msg, args);
					} else {
						let cmd = require("./bot_res/BasicEmbed.js");
						cmd.run(bot,msg,["Nope!",0000000,"Permission Error!",`Sorry **${names.run(msg.author.tag)}**, I'm not gonna let you do that ya scrub >:(\n**${command}** is restricted to **admin** context.\n**Sorry!**`]);
					}
				} else if(msg.channel.type === "dm") {
					let cmd = require("./bot_res/BasicEmbed.js");
					cmd.run(bot,msg,["Uh oh!",3447003,`Say "${config.prefix}cmds" for a command list.`,`Sorry ${names.run(msg.author.tag)}, the command "${command}" does not exist :(`]);
				}
			} catch (err) {
				if(command_log_mode === true) {
					console.log(`[COMMAND ERROR]\n\t[LOG]:${msg.author.tag} ran command "${command}"`);
				}
				console.error(err);
			}
		}
/*	} else {
		if(msg.channel.type === "dm") {
			msg.author.send("Sorry. Self bots can only reply to their owners commands.");
		}
	} */
/*	if(msg.channel.type === "dm") {
		if(bot.status === 'idle'){

		}
	} */

});

bot.login(config.token);
