// Title, Color, FieldName, FieldValue

const rbotico = "https://i.imgur.com/Nz2r4UW.png";

exports.run = (client, msg, args) => {
//	console.log(args[0]);
//	console.log(args[1]);
	msg.channel.send({embed: {
		color: args[1],
		title: args[0],
		fields: [{
			name: args[2],
			value: args[3]
		}],
		footer :{
			icon_url: rbotico,
			text: "redbot_alpha"
		}
	}});
}
