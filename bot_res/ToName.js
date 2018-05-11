exports.run = (name) => {
	var idx = name.lastIndexOf("#");
	var split = name.substring(0,idx);
	return split;
}
