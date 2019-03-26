var restify = require('restify');
var Wufoo = new require("wufoo");
var wufoo = new Wufoo("fishbowl", "AOI6-LFKL-VM1Q-IEX9");
var server = restify.createServer();

server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});

server.get('/', restify.serveStatic({
   directory: "./public",
     default: "index.html"
}));

server.get(/\/app\/?.*/, restify.serveStatic({
  directory: "./public",
    default: "index.html"
}));

server.get('/api/forms/', function(req, res, next) {
   wufoo.getForms(function(err, forms) {
      var json = [];
      for (var i=0;i<forms.length;i++) {
         var form = forms[i];
         json.push({
                     id: form.hash,
                   name: form.name,
            description: form.description,
               url: "http://" + form.wufoo.account + ".wufoo.com/forms/" + form.url
         });
      }
      res.send(json);
   });
   next();

});

server.get('/api/forms/:formid/fields', function(req, res, next) {
   wufoo.getFields(req.params.formid, function(err, fields) {
      var json = [];
      for (var i=0;i<fields.length;i++) {
         var field = fields[i];

         json.push({
                 title: field.title,
                  type: field.type,
                    id: field.id,
            isRequired: field.isRequired
         })
      }
      res.send(json);
   });
   next();
});
