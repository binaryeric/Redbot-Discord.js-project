let m_svc = require("../bot_res/BasicEmbed.js");

exports.run = (client, msg, args) => {
	if(msg.channel.type !== "dm") {
		if(msg.guild.members.get(client.user.id).hasPermission("MANAGE_NICKNAMES")) {
			if(msg.mentions.length > 0) {
				fgts = msg.mentions;
				console.log("HOLA");
				for (fag in fgts) {
					for(var i =0; i < args.length; i++) {
						console.log(args[i]);
						if(args[i] === fag.user.tag) {
							args.splice(1,i);
						}
					}
				}
				let nick = args.join(" ");
				if(nick.length <= 32) {
					console.log("SET", nick);
					for(fag in fgts) {
						msg.guild.members.get(fag.user.id).setNickname(nick);
					}
				} else {
					msg.reply(`Please note that nicknames can be a maximum of 32 characters.\n(yes, this includes spaces)`).then(m => m.delete(4000));
				}
			} else {
				let nick = args.join(" ");
				if(nick.length <= 32 && nick.length > 0) {
					console.log("SET");
					msg.guild.members.get(msg.author.id).setNickname(nick);
				} else {
					msg.reply(`Please note that nicknames can be a maximum of 32 characters.\n(yes, this includes spaces)`).then(m => m.delete(4000));
				}
			}
		} else {
			m.run(client,msg,[`Permission Error!`,10101050,"Check your server permissions!",`You must give the bot permissions to \"Manage Nicknames\"\n\nThis can be set in your server settings.`]);		
		}
	}
}


		/*

		if(!noob){
			if(msg.guild.members.get(client.user.id).hasPermission("CHANGE_NICKNAME")){
				let str = args.join(" ");
				if(str.length <= 32) {
					msg.guild.members.get(client.user.id).setNickname(str);
				} else {
					msg.reply("Nicknames must be less than 32 characters.");
				}
			}
		} else if (msg.guild.members.get(client.user.id).hasPermission("MANAGE_NICKNAMES")) {
			let usr = args.shift();
			let str = args.join();
			if(str.length <= 32) {
				msg.guild.members.get(client.user.id).setNickname(str);
			} else {
				msg.reply("Nicknames must be less than 32 characters.");
			}
			//
		} else {
			let m = require("../bot_res/BasicEmbed.js");
			//
			m.run(client,msg,[`Permission Error!`,9100103,"Check your server permissions!",`You must give the bot permissions to \"Edit Nicknames\"\n\nThis can be set in your server settings.`]);		
		}
	} else {
		msg.author.send("(did you forget you're not in a server..?)");
	} 
	*/
//}
