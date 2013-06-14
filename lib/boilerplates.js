var http        = require("http")
var superagent  = require("superagent")
var registryUrl = "https://raw.github.com/harp-boilerplates/registry/master/index.json"

var get = function(repo, callback){
  var url = "https://api.github.com/repos/" + repo
  //console.log("fetching:", url)
  superagent.get(url)
  .set('User-Agent', 'curl/7.24.0 (x86_64-apple-darwin12.0) libcurl/7.24.0 OpenSSL/0.9.8r zlib/1.2.5')
  .end(function(error, rsp){
    var body = JSON.parse(rsp.text)
    //console.log(body)
    callback({
      id: body.id,
      name: body.name,
      full_name: body.full_name,
      description: body.description,
      watchers: body.watchers,
      forks: body.forks
    })
  })
}

var index = function(callback){
  //console.log("fetching:", registryUrl)
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
      get(query, callback)
    }else{
      return query
        ? callback(filter(query, registry), null, 2)
        : callback(registry, null, 2)
    }
  })
}
