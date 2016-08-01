//load modules
var express = require("express")
var bodyParser = require('body-parser')

var app = express()

app.use(bodyParser.json())
app.use(require("./routes/static"))
app.use(require("./routes/api/api"))


var server = app.listen(process.env.PORT, function() {
	console.log("connected on port " + process.env.PORT)
})