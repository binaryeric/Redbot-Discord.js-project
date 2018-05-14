const names = require("../bot_res/ToName.js");

exports.run = (client, msg, args) => {
	if(msg.channel.type !== "dm") {
		let dude = msg.mentions.members.first();
		if(!dude) {
			msg.reply("Please make sure to actually *mention* the user you are trying to kick. (Type @[locate the user]).");
		}else if(dude === msg.author) {
			msg.reply("You want to kick your self..?");
		}else if(dude.kickable){
			let m = require("../bot_res/BasicEmbed.js");
			//
			dude.kick();
			//
			m.run(bot,msg,[`${names.run(dude.user.tag)} has been Kicked`,10101050,"Follow the rules!",`${names.run(msg.author.tag)} kicked ${names.run(dude.user.tag)} from the server. Please follow all the rules.\n\n**Name & Tag:**\t\t${dude.user.tag}`]);
		} else {
			msg.reply(`**You** do not have the correct permissions to kick ${names.run(dude.user.tag)} from the server :(`);
		}
	} 
}
