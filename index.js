'use strict';

var pkg = require( "./struct.js" );
var setMetadata = require( "./setMetadata.js" )
var https = require( "https" );

/**
 * Configures the API
 * @param  {String} configOptions
 * @return {Promise}
 */
function apiConfig ( configOptions ) {
  if ( configOptions != null && configOptions != undefined ) {
    if ( ( typeof configOptions ).toLowerCase() === "object" ) {
      var options = {
        protocol : pkg.api.uri.protocol,
        hostname :pkg.api.uri.hostname,
        path : pkg.api.uri.path,
        headers : {}
      }

      if ( !configOptions.hasOwnProperty( "id" ) ) {
        throw new Error( pkg.config.issue.missing.id );
      }

      if ( !configOptions.hasOwnProperty( "key" ) ) {
        throw new Error( pkg.config.issue.missing.key );
      }

      if ( ( typeof configOptions.id ).toLowerCase() === "string" && ( typeof configOptions.key ).toLowerCase() === "string" ) {
        options.headers[ pkg.config.app.id.header ] = configOptions.id;
        options.headers[ pkg.config.app.key.header ] = configOptions.key;
      } else {
        throw new Error( pkg.config.issue.invalid.idOrKeyType );
      }

      return new Promise ( function ( resolve, reject ) {
        // test that the AppId and AppKey are valid by connecting with the api
        https.request( options, function ( response ) {
          // Configuration fail if status code is a client error
          if ( response.statusCode.toString().indexOf( "4" ) === 0 ) {
            var result = {
              response : response,
              error : pkg.config.issue.invalid.idOrKey
            }

            // return error message and response of request
            reject( result );
            throw new Error( pkg.config.issue.invalid.idOrKey )
          } else {
            pkg.config.app.id.value = configOptions.id;
            pkg.config.app.key.value = configOptions.key;

            pkg.config.uri.headers [ pkg.config.app.id.header ] = pkg.config.app.id.value
            pkg.config.uri.headers [ pkg.config.app.key.header ] = pkg.config.app.key.value

            // return passed in options to verify the configuration is valid
            resolve( configOptions );
          }
        } );
      } );
    } else {
      throw new Error( pkg.config.issue.invalid.type);
    }
  } else {
    throw new Error( pkg.config.issue.empty );
  }
}

/**
 * Gets the accepted values for a specific metadata category
 * Accepted categories : diet, allergy, ingredient, cuisine, course, holiday
 * 
 * @param  {String} category
 * @return {Promise}
 */
function apiMetadata ( category ) {
  if ( category != null && category != undefined ) {
    if ( ( typeof category ).toLowerCase() === "string" ) {
      if ( category.trim() !== "" ) {
        var acceptedCategories = Object.keys( pkg.api.metadata );

        if ( acceptedCategories.indexOf( category ) < 0 ) {
          throw new Error( pkg.api.issue.metadata.invalid.category );
        }

        var options = pkg.api.endpoint.getParamValues( true );

        options.path += category;

        return new Promise ( function ( resolve, reject ) {
          https.request( options, function ( response ) {
            if ( response.statusCode === 200 ) {
              resolve( response );
            } else {
              var result = {
                response : response,
                error : pkg.api.issue.metadata.get.acceptedValues
              }

              // return error message and response of request
              reject( result );
              throw new Error( pkg.api.issue.metadata.get.acceptedValues );
            }
          } );
        } );
      } else {
        throw new Error( pkg.api.issue.metadata.empty.category );
      }
    } else {
      throw new Error( pkg.api.issue.metadata.invalid.categoryType );
    }
  } else {
    throw new Error( pkg.api.issue.metadata.missing.category );
  }
}

var yummly = {
  config : function ( options ) { return apiConfig( options ); },
  recipe : {
    search : function () {

    },
    get : function () {

    }
  },
  metadata : {
    set : new setMetadata( pkg.api.searchParams, pkg.api.metadata, pkg.api.issue.metadata ),
    get : {
      diet : function () { return pkg.api.searchParams.diet },
      allergy : function () {},
      ingredient : function () {},
      cuisine : function () {},
      course : function () {},
      holiday : function () {}
    },
    acceptedValues : function ( category ) { return apiMetadata( category ); }
  }
}

if ( process.env.ENVIRONMENT === pkg.env.dev ) {
  yummly[ "packageName" ] = pkg.name;
  yummly[ "configApp" ] = pkg.config.app;
  yummly[ "apiSearchParams" ] = pkg.api.searchParams;
  yummly[ "configFail" ] = pkg.config.issue;
  yummly[ "apiFail" ] = pkg.api.issue;
}

module.exports = yummly;