const fs = require("fs");

exports.run = (server_id) => {
	let config_obj = {"mode_role":"Moderators","shutup_role":"Muted"};
	let str = JSON.stringify(config_obj);
	console.log(str);
	//
	fs.writeFile(`./server_configs/${server_id}.json`,str,(err) => console.error);
	//
	return config_obj;
}
