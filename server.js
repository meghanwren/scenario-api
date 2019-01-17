var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var tediousExpress = require('express4-tedious');
var TYPES = require('tedious').TYPES;
var app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

  var dbConfig = {
    userName:  'v-mewren',
    password: 'f08Gr8b@', 
    server: 'a5ff.database.windows.net',
    options: {encrypt: true, database: 'scenarios-api-db'}
};

app.use(function (req, res, next) {
  req.sql = tediousExpress(dbConfig);
  next();
});

app.get('/api/scenarios', function (req, res) {
  req.sql("select * from scenarios for json path, without_array_wrapper")
  .into(res);
});

app.get('/api/scenarios/:id', function (req, res) {
  req.sql("select * from scenarios where id = @id for json path, without_array_wrapper")
      .param('id', req.params.id, TYPES.Int)
      .into(res, {});
});


  app.post("/api/scenarios/", function(req , res){
    req.sql("INSERT INTO scenarios(sName,sOwner,dateCreated,sVersion,sStatus,datePublished) VALUES (@name,@owner,@dateCreated,@version,@status,@datePublished)")
    .param('name', req.body.sName, TYPES.VarChar)
    .param('owner', req.body.sOwner, TYPES.VarChar)
    .param('dateCreated', req.body.dateCreated, TYPES.VarChar)
    .param('version', req.body.sVersion, TYPES.VarChar)
    .param('status', req.body.sStatus, TYPES.VarChar)
    .param('datePublished', req.body.datePublished, TYPES.VarChar)
    .exec(res);
  });

  app.put("/api/scenarios/:id", function(req , res){
    req.sql("UPDATE scenarios SET sName=@name, sOwner=@owner, dateCreated=@dateCreated, sVersion=@version, sStatus=@status, datePublished=@datePublished WHERE id = @id")
    .param('id', req.params.id, TYPES.Int)
    .param('name', req.body.sName, TYPES.VarChar)
    .param('owner', req.body.sOwner, TYPES.VarChar)
    .param('dateCreated', req.body.dateCreated, TYPES.VarChar)
    .param('version', req.body.sVersion, TYPES.VarChar)
    .param('status', req.body.sStatus, TYPES.VarChar)
    .param('datePublished', req.body.datePublished, TYPES.VarChar)
    .exec(res);
  });

  app.delete("/api/scenarios/:id", function(req , res){
    req.sql("DELETE FROM scenarios WHERE id = @id")
    .param('id', req.params.id, TYPES.Int)
    .exec(res);
});

  var server = app.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
 });
