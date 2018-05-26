"use strict";

var https = require( "https" );

/**
 * Configures the API
 * @param  {String} configOptions
 * @return {Promise}
 */
function apiConfig ( uri, app, issue ) {
  return function ( configOptions ) {
    if ( configOptions != null && configOptions != undefined ) {
      if ( ( typeof configOptions ).toLowerCase() === "object" ) {
        var options = {
          protocol : uri.protocol,
          hostname :uri.hostname,
          path : uri.path,
          headers : {}
        }

        if ( !configOptions.hasOwnProperty( "id" ) ) {
          throw new Error( issue.missing.id );
        }

        if ( !configOptions.hasOwnProperty( "key" ) ) {
          throw new Error( issue.missing.key );
        }

        if ( ( typeof configOptions.id ).toLowerCase() === "string" && ( typeof configOptions.key ).toLowerCase() === "string" ) {
          options.headers[ app.id.header ] = configOptions.id;
          options.headers[ app.key.header ] = configOptions.key;
        } else {
          throw new Error( issue.invalid.idOrKeyType );
        }

        return new Promise ( function ( resolve, reject ) {
          // test that the AppId and AppKey are valid by connecting with the api
          https.request( options, function ( response ) {
            // Configuration fail if status code is a client error
            if ( response.statusCode.toString().indexOf( "4" ) === 0 ) {
              var result = {
                response : response,
                error : issue.invalid.idOrKey
              }

              // return error message and response of request
              reject( result );
              throw new Error( issue.invalid.idOrKey )
            } else {
              app.id.value = configOptions.id;
              app.key.value = configOptions.key;

              uri.headers[ app.id.header ] = app.id.value
              uri.headers[ app.key.header ] = app.key.value

              // return passed in options to verify the configuration is valid
              resolve( configOptions );
            }
          } );
        } );
      } else {
        throw new Error( issue.invalid.type );
      }
    } else {
      throw new Error( issue.empty );
    }
  }
}

module.exports = ( function ( app, uri, issue ) {
  return apiConfig( uri, app, issue );
} );