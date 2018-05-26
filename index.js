'use strict';

require( "dotenv" ).config();

var https = require( "https" );
var pkg = require( "./base/struct" );
var config = require( "./base/config" );
var metadata = require( "./metadata/metadata" );
var util = require( "./base/util.js" );

var yummly = {
  config : config( pkg.config.app, pkg.api.uri, pkg.config.issue ),
  recipe : {
    search : function () {
      var options = pkg.api.endpoint.getSearch( true );

      options.path += "?" + util.buildQueryString( pkg.api.searchParams, "", "&", true );

      return new Promise ( function ( resolve, reject ) {
        https.request( options, function ( response ) {
          if ( response.statusCode.toString().indexOf("2") === 0 ) {
            resolve( response.body );
          }
        } );
      } );
    },
    searchUrl : function () {
      return pkg.api.endpoint.getSearch( false ) + "?" + util.buildQueryString( pkg.api.searchParams, "", "&", true );
    },
    get : function () {

    }
  },
  metadata : metadata( pkg.api.searchParams, pkg.api.metadata, pkg.api.issue.metadata, pkg.api.endpoint )
}

if ( process.env.ENVIRONMENT === pkg.env.dev ) {
  yummly[ "packageName" ] = pkg.name;
  yummly[ "configApp" ] = pkg.config.app;
  yummly[ "apiSearchParams" ] = pkg.api.searchParams;
  yummly[ "configFail" ] = pkg.config.issue;
  yummly[ "apiFail" ] = pkg.api.issue;
}

module.exports = yummly;