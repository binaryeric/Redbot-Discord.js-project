// Check User is bot Owner

// Load in dependancies:

exports.run = (discord_user,server) => {
	return discord_user.id === server.ownerID;
}

