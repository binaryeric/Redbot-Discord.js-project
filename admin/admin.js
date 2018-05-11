const main_cfg = require(`../config.json`);
const fs = require("fs");

exports.run = (discord_user,server,msg) => {
	let server_id = server.id;
	var config_file;
	if(!fs.existsSync(`../server_configs/${server_id}.json`)) {
		let create = require("../bot_res/create_config.js");
		config_file = create.run(server_id);
	} else {
		config_file = require(`../server_configs/${server_id}.json`);
	}

	let role = config_file.mode_role;

	if(msg.member.roles.find("name", role)) {
		return true;
	}

	return false;
}

