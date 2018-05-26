"use strict";

var util = require( "./metadataUtility" );

function setAllowedExcluded ( metadata, obj, params, issue ) {
  if ( util.can.set.object ( obj, issue ) ) {
    if ( obj.hasOwnProperty( "allowed" ) || obj.hasOwnProperty( "excluded" ) ) {
      if ( obj.hasOwnProperty( "allowed" ) && util.can.set.array ( obj.allowed, issue ) ) {
        params[ "allowed" + metadata ] = obj.allowed;
      }

      if ( obj.hasOwnProperty( "excluded" ) && util.can.set.array ( obj.excluded, issue ) ) {
        params[ "excluded" + metadata ] = obj.excluded;
      }
    } else {
      throw new Error( issue.invalid.value.default );
    }
  }
}

function createAllowedFunctionFamily ( metadata, params, issue ) {
  // capitalize the first character
  metadata = metadata.substr( 0, 1 ).toUpperCase() + metadata.substr(1);

  setMetadata.prototype[ "allowed" + metadata ] = function ( arr ) {
    if ( util.can.set.array( arr, issue ) ) {
      params[ "allowed" + metadata ] = arr;
      return this;
    }
  }

  // alias of allowed
  setMetadata.prototype[ metadata.toLowerCase() ] = setMetadata.prototype[ "allowed" + metadata ];
}

function createAllowedExcludedFunctionFamily ( metadata, params, issue ) {
  // capitalize the first character
  metadata = metadata.substr( 0, 1 ).toUpperCase() + metadata.substr(1);

  setMetadata.prototype[ "allowed" + metadata ] = function ( arr ) {
    if ( util.can.set.array( arr, issue ) ) {
      params[ "allowed" + metadata ] = arr;
      return this;
    }
  }

  setMetadata.prototype[ "excluded" + metadata ] = function ( arr ) {
    if ( util.can.set.array( arr, issue ) ) {
      params[ "excluded" + metadata ] = arr;
      return this;
    }
  }

  // combination of allowed and excluded
  setMetadata.prototype[ metadata.toLowerCase() ] = function ( obj ) {
    setAllowedExcluded( metadata, obj, params, issue );
    return this;
  }
}

function createIntegerFunctionFamily ( name, alias, startZero, params, issue ) {
  setMetadata.prototype[ name ] = function ( int ) {
    if ( util.can.set.integer( int, issue, startZero ) ) {
      params[ name ] = int;
      return this;
    }
  }

  if ( alias !== null && alias !== undefined ) {
    // alias
    setMetadata.prototype[ alias ] = setMetadata.prototype[ name ];
  }
}

function createFlavorNutritionFunctionFamily ( metadata, _this ) {
  setMetadata.prototype[ metadata ] = function ( values ) {
    if ( util.can.set.object( values, _this.issue ) ) {
      Object.keys( values ).forEach( function ( value ) {
        if ( util.can.set.object( values[ value ], _this.issue ) ) {
          // check that the given flavor/nutrition value exists/supported
          if ( Object.keys( _this.params[ metadata ] ).indexOf( value ) > -1 ) {
            // check that there is a min/max property
            if ( values[ value ].hasOwnProperty( "min" ) || values[ value ].hasOwnProperty( "max" ) ) {
              if ( values[ value ].hasOwnProperty( "min" ) && util.can.set.float( values[ value ][ "min" ], _this.issue, true ) ) {
                _this.params[ metadata ][ value ][ "min" ] = values[ value ][ "min" ];
              }

              if ( values[ value ].hasOwnProperty( "max" ) && util.can.set.float( values[ value ][ "max" ], _this.issue, true ) ) {
                _this.params[ metadata ][ value ][ "max" ] = values[ value ][ "max" ];
              }
            } else {
              throw new Error( _this.issue.invalid.value.flavorNutrition.noMinMax( value, metadata ) );
            }
          } else {
            throw new Error( _this.issue.invalid.value.flavorNutrition.unrecognized( value, metadata ) );
          }
        }
      } );

      return this;
    }
  }
}


var setMetadata = function ( params, metadata, issue ) {
  this.params = params;
  this.metadata = metadata;
  this.issue = issue;

  // diet
  createAllowedFunctionFamily ( this.metadata.diet, this.params, this.issue );

  // allergy
  createAllowedFunctionFamily ( this.metadata.allergy, this.params, this.issue );

  // ingredient
  createAllowedExcludedFunctionFamily ( this.metadata.ingredient, this.params, this.issue );

  // cuisine
  createAllowedExcludedFunctionFamily ( this.metadata.cuisine, this.params, this.issue );

  // course
  createAllowedExcludedFunctionFamily ( this.metadata.course, this.params, this.issue );

  // maxTotalTimeInSeconds
  createIntegerFunctionFamily ( "maxTotalTimeInSeconds", "duration", false, this.params, this.issue );

  // maxResult
  createIntegerFunctionFamily ( "maxResult", "maxRecipes", false, this.params, this.issue );

  // start
  createIntegerFunctionFamily ( "start", null, true, this.params, this.issue );

  // flavor
  createFlavorNutritionFunctionFamily ( "flavor", this );

  // nutrition
  createFlavorNutritionFunctionFamily ( "nutrition", this );
};

setMetadata.prototype.facetField = function ( arr ) {
  var acceptedValues = [ "ingredient", "diet" ];

  if ( util.can.set.array( arr, this.issue ) ) {
    if ( arr.indexOf( acceptedValues[0] ) > - 1 || arr.indexOf( acceptedValues[1] ) > -1 ) {
      // create new array to prevent invalid values to be mixed in stored value
      var chunkedArr = [];

      if ( arr.indexOf( acceptedValues[0] ) > -1 ) {
        chunkedArr.push( acceptedValues[0] );
      }

      if ( arr.indexOf( acceptedValues[1] ) > -1 ) {
        chunkedArr.push( acceptedValues[1] );
      }

      this.params.facetField = chunkedArr;

      return this;
    } else {
      throw new Error( this.issue.invalid.value.facetField );
    }
  }
}

module.exports = setMetadata;