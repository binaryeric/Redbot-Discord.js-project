const config = require(`../config.json`);

exports.run = (discord_user) => {
	for(k in config.friends){
		if(config.friends[k] === discord_user.id) {
			return true;
		}
	}
	return false;
}

