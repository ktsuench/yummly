"use strict";

var https = require( "https" );
var setMetadata = require( "./setMetadata" );
var getMetadata = require( "./getMetadata" );

function apiMetadata ( params, metadata, issue, endpoint ) {
  /**
   * Gets the accepted values for a specific metadata category
   * Accepted categories : diet, allergy, ingredient, cuisine, course, holiday
   * 
   * @param  {String} category
   * @return {Promise}
   */
  return function ( category ) {
    if ( category != null && category != undefined ) {
      if ( ( typeof category ).toLowerCase() === "string" ) {
        if ( category.trim() !== "" ) {
          var acceptedCategories = Object.keys( metadata );

          if ( acceptedCategories.indexOf( category ) < 0 ) {
            throw new Error( issue.invalid.category );
          }

          var options = endpoint.getParamValues( true );

          options.path += category;

          if ( process.env.ENVIRONMENT === "prod" && process.env.APIACCESS === "on" ) {
            return new Promise ( function ( resolve, reject ) {
              https.request( options, function ( response ) {
                if ( response.statusCode === 200 ) {
                  resolve( response );
                } else {
                  var result = {
                    response : response,
                    error : issue.get.acceptedValues
                  }

                  // return error message and response of request
                  reject( result );
                  throw new Error( issue.get.acceptedValues );
                }
              } );
            } );
          }
        } else {
          throw new Error( issue.empty.category );
        }
      } else {
        throw new Error( issue.invalid.categoryType );
      }
    } else {
      throw new Error( issue.missing.category );
    }
  }
}

module.exports = ( function ( params, metadata, issue, endpoint ) {
  return {
    set : new setMetadata( params, metadata, issue ),
    get : new getMetadata( params, metadata, issue ),
    acceptedValues : apiMetadata( params, metadata, issue, endpoint )
  }
} );