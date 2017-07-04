'use strict';

require( "dotenv" ).config();

var https = require( "https" );
var pkg = require( "./struct" );
var config = require( "./config" );
var metadata = require( "./metadata/metadata" );

var yummly = {
  config : config( pkg.config.app, pkg.api.uri, pkg.config.issue ),
  recipe : {
    search : function () {

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