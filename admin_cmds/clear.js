const config = require("../config.json");
let m_svc = require("../bot_res/BasicEmbed.js");
//Snowflake = require('snowflake');

const fourteen_days = 1209600000;

function deleteForUser(msg, users, num_msgs) {
	msg.channel.fetchMessages({
		limit: num_msgs
	}).then(function(list) {
		for(user in users) {
			list = list.filter(m => m.author.id === user.id);
		}
		//list = list.filter(m => (Date.now() - Snowflake.deconstruct(m).date.getTime()) < fourteen_days);
		msg.channel.bulkDelete(list);
	}, function(err){
		console.log(err);
		msg.reply(`Command encountered error clearing channel.\n[${err}]`).then(m => m.delete(6000));
	});
	/*ms => {
		let msg_array = ms.array();
		// filter the message to only your own
        msg_array = msg_array.filter(m_idx => m_idx.author.id === user.id);
        // limit to the requested number + 1 for the command message
        msg_array.length = n + 1;
        msg_array.map(m_idx => m_idx.delete().catch(console.error));
	}) */
}


exports.run = (client, msg, args) => {
	if(msg.channel.type !== "dm"){
		if(msg.guild.members.get(client.user.id).hasPermission("MANAGE_MESSAGES")){
			let n = 0;
			if(typeof(args[0]) !== 'undefined'){
				n = parseInt(args[0]);
				if(typeof(n) === 'undefined') {
					msg.reply("This command requires a parameter which is a whole number.").then(msg => msg.delete(3000));
					return;
				}
			}
			if(args.length >= 2) {
				let ppl = msg.mentions
				if(ppl.length > 0) {
					if(n <= 100) {
						deleteForUser(msg, ppl, n);
						msg.reply(`${n} messages for ${ppl.length} users have been cleared!.`).then(m => m.delete(3000));
					} else {
						msg.reply("This command requires a number between 1 and 100.").then(m => m.delete(3000));
					}
				}
			} else if(n <= 100) {
				msg.channel.fetchMessages({
						limit: n
					}).then(function(list) {
						//list = list.filter(m => (Date.now() - Snowflake.deconstruct(m).date.getTime()) < fourteen_days);
						msg.channel.bulkDelete(list);
					}, function(err){
						console.log(err);
						msg.reply(`Cannot clear messages older than 14 days old..\n[${err}]`).then(m => m.delete(6000));
					});
			} else {
				msg.reply("This command requires a number between 1 and 100.");
			}
		} else {
			m_svc.run(client,msg,[`Permission Error!`,10101050,"Check your server permissions!","You need to give the bot \"Manage Messages\" permissions in order to use this set of commands."]);		
		}
	}
}
