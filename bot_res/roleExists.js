exports.run = (client, msg, key, args) => {
	let role_tbl = msg.guild.roles.array();
	//
	for(role in role_tbl) {
		let r = role_tbl[role]
		if(key.toLowerCase() === r.name.toLowerCase()) {
			return true;
		}
	}
	return false;
}