// private functions
{
  function canSetArray ( arr, issue ) {
    if ( arr !== null && arr !== undefined ) {
      if ( Array.isArray(arr) ) {
        if ( arr.length > 0 ) {
           return true;
        } else {
          throw new Error( issue.empty.value );
        }
      } else {
        throw new Error( issue.invalid.valueType.array );
      }
    } else {
      throw new Error( issue.missing.value );
    }
  }

  function canSetObject ( obj, issue ) {
    if ( obj !== null && obj !== undefined ) {
      if ( ( typeof obj ).toLowerCase() === "object" && !Array.isArray( obj ) ) {
        if ( Object.keys( obj ).length > 0 ) {
          return true;
        } else {
          throw new Error( issue.empty.value );
        }
      } else {
        throw new Error( issue.invalid.valueType.object );
      }
    } else {
      throw new Error( issue.missing.value );
    }
  }

  function canSetInteger ( int, issue, startZero ) {
    if ( int !== null && int !== undefined ) {
      if ( Number.isInteger( int ) ) {
        if ( int > 0 || ( startZero && int > -1 ) ) {
          return true;
        } else {
          throw new Error( issue.invalid.value.default );
        }
      } else {
        throw new Error( issue.invalid.valueType.integer );
      }
    } else {
      throw new Error( issue.missing.value );
    }
  }

  function setAllowedExcluded ( metadata, obj, params, issue ) {
    if ( canSetObject ( obj, issue ) ) {
      if ( obj.hasOwnProperty( "allowed" ) || obj.hasOwnProperty( "excluded" ) ) {
        if ( obj.hasOwnProperty( "allowed" ) && canSetArray ( obj.allowed, issue ) ) {
          params[ "allowed" + metadata ] = obj.allowed;
        }

        if ( obj.hasOwnProperty( "excluded" ) && canSetArray ( obj.excluded, issue ) ) {
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
      if ( canSetArray( arr, issue ) ) {
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
      if ( canSetArray( arr, issue ) ) {
        params[ "allowed" + metadata ] = arr;
        return this;
      }
    }

    setMetadata.prototype[ "excluded" + metadata ] = function ( arr ) {
      if ( canSetArray( arr, issue ) ) {
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
      if ( canSetInteger( int, issue, startZero ) ) {
        this.params[ name ] = int;
        return this;
      }
    }

    if ( alias !== null && alias !== undefined ) {
      // alias
      setMetadata.prototype[ alias ] = setMetadata.prototype[ name ];
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
};

setMetadata.prototype.flavor = function ( flavors ) {
  if ( canSetObject( flavors, this.issue ) ) {
    for ( var flavor in Object.keys( flavors ) ) {
      if ( canSetObject( flavors[ flavor ], this.issue ) ) {
        if ( Object.keys( this.params.flavor ).indexOf( flavor ) > -1 ) {
          if ( flavors[ flavor ].hasOwnProperty( "min" ) || flavors[ flavor ].hasOwnProperty( "max" ) ) {
            this.params.flavor[ flavor ] = flavors[ flavor ];
          } else {
            throw new Error( this.issue.invalid.value.flavorNutrition.noMinMax( flavor, "flavor" ) );
          }
        } else {
          throw new Error( this.issue.invalid.value.flavorNutrition.unrecognized( flavor, "flavor" ) );
        }
      }
    }

    return this;
  }
}

setMetadata.prototype.nutrition = function ( values ) {
  this.params.nutrition = values;
  return this;
}

setMetadata.prototype.facetCount = function ( arr ) {
  this.params.facetCount = arr;
  return this;
}

module.exports = setMetadata;