const names = require("../bot_res/ToName.js");
const config = require("../config.json");

exports.run = (client, msg, args) => {
	if(msg.channel.type !== "dm"){
		if(msg.guild.members.get(client.user.id).hasPermission("MANAGE_MESSAGES")){
			if(args[0]){
				let n = parseInt(args[0])
				if(n && n <= 100) {
				let person = msg.mentions.members.first();
					if(!person) {
						msg.reply("Please make sure to actually *mention* the user you are trying to delete messages for as the second parameter. (Type @[locate the user]).");
					} else {
						msg.channel.fetchMessages({
							limit: n
						}).then(ms => {
					        let msg_array = ms.array();
					        // filter the message to only your own
					        msg_array = msg_array.filter(m_idx => m_idx.author.id === person.user.id);
					        // limit to the requested number + 1 for the command message
					        msg_array.length = n + 1;
					        // Has to delete messages individually. Cannot use `deleteMessages()` on selfbots.
					        msg_array.map(m_idx => m_idx.delete().catch(console.error));
					        //
					        if(config.client_mode === false){
								let confm = require("../bot_res/BasicEmbed.js");
								//
								confm.run(client,msg,[`${args[0]} of ${names.run(person.user.tag)}'s messages deleted!`,0500103,"spam = shrekt!",`redbot ate your spam for breakfeast ;)\nPlease follow all server rules *${names.run(person.user.tag)}.*\n\n**Name & Tag:**\t*${person.user.tag}*`]);		
							}
			      		});
		      		}
				} else {
					if(config.client_mode === false){
						msg.reply("This command requires a number between 1 and 100.");
					}
				}
			}else {
				if(config.client_mode === false){
					msg.reply("This command requires a second parameter.");
				}
			}
		}else{
			if(config.client_mode === false){
				let m = require("../bot_res/BasicEmbed.js");
				//
				m.run(client,msg,[`Permission Error!`,9100103,"Check your server permissions!","I do not have the power to edit/delete/manage messages."]);		
			}
		}
	} else {
		if(config.client_mode === false){
			let m = require("../bot_res/BasicEmbed.js");
			m.run(client,msg,[`Permission Error!`,9100103,"mdel","This command is not available in DM's.\nUse \"clearme\" instead!"]);		
		}
	}
}
