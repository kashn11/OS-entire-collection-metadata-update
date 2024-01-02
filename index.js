const express = require("express");
const app = express();
require('dotenv').config()
const metadataupdate = require('./metadataupdate');
const port = process.env.PORT || 5000;
app.get('/', (req, res) => {
	res.send('Welcome');
});

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
	// call refresh metadata function
	metadataupdate.RefreshMetaData();
});