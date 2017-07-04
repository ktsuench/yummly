"use strict";

var util = require( "./metadataUtility" );

function getAllowedExcluded ( metadata, params ) {
  return {
    "allowed" : params[ "allowed" + metadata ],
    "excluded" : params[ "excluded" + metadata ]
  }
}

function createAllowedFunctionFamily ( metadata, params ) {
  // capitalize the first character
  metadata = metadata.substr( 0, 1 ).toUpperCase() + metadata.substr(1);

  getMetadata.prototype[ "allowed" + metadata ] = function () {
    return params[ "allowed" + metadata ];
  }

  // alias of allowed
  getMetadata.prototype[ metadata.toLowerCase() ] = getMetadata.prototype[ "allowed" + metadata ];
}

function createAllowedExcludedFunctionFamily ( metadata, params, issue ) {
  // capitalize the first character
  metadata = metadata.substr( 0, 1 ).toUpperCase() + metadata.substr(1);

  getMetadata.prototype[ "allowed" + metadata ] = function () {
    return params[ "allowed" + metadata ];
  }

  getMetadata.prototype[ "excluded" + metadata ] = function () {
    return params[ "excluded" + metadata ];
  }

  // combination of allowed and excluded
  getMetadata.prototype[ metadata.toLowerCase() ] = function ( paramPrefix ) {
    if ( paramPrefix === undefined || paramPrefix === null) {
      return getAllowedExcluded( metadata, params );
    } else {
      if ( ( typeof paramPrefix ).toLowerCase() === "string" ) {
        if ( paramPrefix === "allowed" || paramPrefix === "excluded" ) {
          return params[ paramPrefix + metadata];
        } else {
          throw new Error( issue.invalid.value.allowedExcluded );
        }
      } else {
        throw new Error( issue.invalid.valueType.string );
      }
    }
  }
}

function createIntegerFunctionFamily ( name, alias, params ) {
  getMetadata.prototype[ name ] = function () {
    return params[ name ];
  }

  if ( alias !== null && alias !== undefined ) {
    // alias
    getMetadata.prototype[ alias ] = getMetadata.prototype[ name ];
  }
}

function createFlavorNutritionFunctionFamily ( metadata, params, issue ) {
  getMetadata.prototype[ metadata ] = function ( category ) {
   if ( category === undefined || category === null) {
      return params[ metadata ];
    } else {
      if ( ( typeof category ).toLowerCase() === "string" ) {
        if ( Object.keys( params[ metadata ] ).indexOf( category ) > -1 ) {
          return params[ metadata ][ category ];
        } else {
          throw new Error( issue.invalid.value.flavorNutrition.unrecognized( category, metadata ) );
        }
      } else {
        throw new Error( issue.invalid.valueType.string );
      }
    }
  }
}

var getMetadata = function ( params, metadata, issue ) {
  this.params = params;
  this.metadata = metadata;
  this.issue = issue;

  // diet
  createAllowedFunctionFamily ( this.metadata.diet, this.params );

  // allergy
  createAllowedFunctionFamily ( this.metadata.allergy, this.params );

  // ingredient
  createAllowedExcludedFunctionFamily ( this.metadata.ingredient, this.params, this.issue );

  // cuisine
  createAllowedExcludedFunctionFamily ( this.metadata.cuisine, this.params, this.issue );

  // course
  createAllowedExcludedFunctionFamily ( this.metadata.course, this.params, this.issue );

  // maxTotalTimeInSeconds
  createIntegerFunctionFamily ( "maxTotalTimeInSeconds", "duration", this.params );

  // maxResult
  createIntegerFunctionFamily ( "maxResult", "maxRecipes", this.params );

  // start
  createIntegerFunctionFamily ( "start", null, this.params);

  // flavor
  createFlavorNutritionFunctionFamily ( "flavor", this.params, this.issue );

  // nutrition
  createFlavorNutritionFunctionFamily ( "nutrition", this.params, this.issue );
};

getMetadata.prototype.facetField = function () {
  return this.params.facetField;
}

module.exports = getMetadata;