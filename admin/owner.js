// Check User is bot Owner

// Load in dependancies:
const main_cfg = require(`../config.json`);

exports.run = (discord_user) => {
	return discord_user.id === config.owner_id;
}

