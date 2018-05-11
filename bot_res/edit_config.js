const fs = require("fs");

exports.run = (server_id,prop,value) => {
	var cfg;
	if(!fs.existsSync(`../server_configs/${server_id}.json`)) {
		let create = require("./create_config.js");
		cfg = create.run(server_id);
	} else {
		cfg = require(`../server_configs/${server_id}.json`);
	}
	// write to file:
	if(cfg !== null) { 
		cfg[prop] = value;
		fs.writeFile(`../server_configs/${server_id}.json`,JSON.stringify(cfg),(err) => console.error);
		return true;
	}
	return false;
	//
	//
}
