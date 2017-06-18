'use strict';

var https = require( 'https' );

var pkgName = "kt-yummly";
var env = {
  dev : "dev",
  prod : "prod"
}

var api = {
  uri : {
    protocol : "https:",
    hostname : "api.yummly.com",
    path : "/v1/api/",
    url : function () {
      return api.uri.protocol + "//" + api.uri.hostname + api.uri.path;
    }
  },
  endpoint : {
    getSearch : function () { 
      return api.uri.url + "recipes/";
    },
    getRetreive : function () { 
      return api.uri.url + "recipe/";
    },
    getParamValues : function () { 
      return api.uri.url + "metadata/";
    }
  },
  metadata : {
    diet : "diet",
    allergy : "allergy",
    ingredient : "ingredient",
    cuisine : "cuisine",
    course : "course",
    holiday : "holiday"
  }
}

var config = {
  app : {
    id : {
      header : "X-Yummly-App-ID",
      value : null
    },
    key : {
      header : "X-Yummly-App-Key",
      value : null
    }
  },
  issue : {
    pre : pkgName + " has not been configured. ",
    empty : function () { return config.issue.pre + "No configuation provided."; },
    invalid: {
      type : function () { return config.issue.pre + "Invalid configuration type. Expected type object."; },
      idOrKey : function () { return config.issue.pre + "Invalid appId or appKey provided."; }
    },
    missing : {
      id : function () { return config.issue.pre + "Missing AppId."; },
      key : function () { return config.issue.pre + "Missing AppKey."; }
    }
  }
}

module.exports = {
  config : function ( options ) {
    var issue = "";

    if ( options != null && options != undefined ) {
      if ( ( typeof options ).toLowerCase() === "object" ) {
        var options = {
          protocol : api.uri.protocol,
          hostname : api.uri.hostname,
          path : api.uri.path,
          headers : {}
        }

        if ( options.hasOwnProperty( "id" ) ) {
          options.headers[ config.app.id.header ] = options.id;
        } else {
          throw new Error( config.issue.missing.id() );
        }

        if ( options.hasOwnProperty( "key" ) ) {
          options.headers[ config.app.key.header ] = options.key;
        } else {
          throw new Error( config.issue.missing.key() );
        }

        return new Promise ( function ( resolve, reject ) {
          https.request( options, function ( response ) {
            // Configuration fail if status code is a client error
            if ( response.statusCode.toString().indexOf( "4" ) === 0 ) {
              var result = {
                response : response,
                error : config.issue.invalid.idOrKey()
              }

              // return error message and response of request
              reject( result );
              throw new Error( config.issue.invalid.idOrKey() )
            } else {
              config.app.id = options.id;
              config.app.key = options.key;

              // return passed in options to verify the configuration is valid
              resolve( app );
            }
          } );
        } );
      } else {
        throw new Error( config.issue.invalid.type() );
      }
    } else {
      throw new Error( config.issue.empty() );
    }
  }
}

if ( process.env.ENVIRONMENT === env.dev ) {
  module.exports[ "packageName" ] = pkgName;
  module.exports[ "configFail" ] = config.issue;
}