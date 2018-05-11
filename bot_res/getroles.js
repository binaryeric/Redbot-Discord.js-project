
exports.run = (client, msg, args) => {
	let role_tbl = msg.guild.roles.array();
	// */
	//console.log(role_tbl);
	let role_str = "";
	for(role in role_tbl) {
		let r = role_tbl[role]
		if(r.name !== "@everyone") {
			role_str = `${role_str} ${r.name} \n`;
		}
	}
	//
	return role_str;
}
