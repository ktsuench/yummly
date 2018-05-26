"use strict";

function buildString ( obj, pre, post, top ) {
  var result = "";

  for ( var key in obj ) {
    if ( Array.isArray( obj[ key ] ) ) {
      obj[ key ].forEach( function ( val ) {
        result += ( pre ? pre + "." : "" ) + key + "[]=" + val + post;
      } );
    } else if ( ( typeof obj[ key ] ).toLowerCase() == "object" ) {
      result += buildString( obj[ key ], ( pre ? pre + "." : "" ) + key, post, false );
    } else {
      result += ( pre ? pre + "." : "" ) + key + "=" + obj[ key ] + post;
    }
  }

  if ( top ) {
    var resRev = Array.from( result ).reverse();

    while ( resRev.indexOf( post ) == 0 ) {
      resRev.shift();
    }

    result = resRev.reverse().join( "" );
  }

  return encodeURI(result);
}

module.exports = {
  buildQueryString : buildString
}