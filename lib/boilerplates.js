var http        = require("http")
var superagent  = require("superagent")
var registryUrl = "https://raw.github.com/harp-boilerplates/registry/master/index.json"

var get = function(id, callback){
  superagent.get("https://github.com/orgs/" + repo).end(function(error, rsp){
    callback(JSON.parse(rsp.text))
  })
}

var index = function(callback){
  superagent.get(registryUrl).end(function(error, rsp){
    callback(JSON.parse(rsp.text))
  })
}

var filter = function(query, payload){
  var results = []
  for(var k in payload)(function(k){
    if((k.indexOf(query) !== -1) || (payload[k].indexOf(query) !== -1)){
      var p = {}
      p[k] = payload[k]
      results.push(p)
    }
  })(k)
  return results
}

exports.search = function(query, callback){
  index(function(registry){
    if(registry[query]){
      get(query, function(results){
        callback(resutls)
      })
    }else{
      return query
        ? callback(filter(query, registry), null, 2)
        : callback(registry, null, 2)
    }
  })
}
