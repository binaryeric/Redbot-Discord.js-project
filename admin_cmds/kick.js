const names = require("../bot_res/ToName.js");

exports.run = (client, msg, args) => {
	if(msg.channel.type !== "dm") {
		let fgt = msg.mentions.members.first();
		if(!fgt) {
			msg.reply("Please make sure to actually *mention* the user you are trying to kick. (Type @[locate the user]).");
		}else if(fgt === msg.author) {
			msg.reply("You want to kick your self..?");
		}else if(fgt.kickable){
			let m = require("../bot_res/BasicEmbed.js");
			//
			fgt.kick();
			//
			m.run(bot,msg,[`${names.run(fgt.user.tag)} has been Kicked`,10101050,"Follow the rules!",`${names.run(msg.author.tag)} kicked ${names.run(fgt.user.tag)} from the server. Please follow all the rules.\n\n**Name & Tag:**\t\t${fgt.user.tag}`]);
		} else {
			msg.reply(`**You** do not have the correct permissions to kick ${names.run(fgt.user.tag)} from the server :(`);
		}
	} 
}
