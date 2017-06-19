'use strict';

var pkgName = "kt-yummly";
var env = {
  dev : "dev",
  prod : "prod"
}

var invalidValueType = "Invalid value type. ";
var flavorNutritionOrigin = "api.issue.metadata.value.flavorNutrition";

function buildInvalidFlavorNutritionIssue ( msg, name ) {
  return function ( kind, type ) {
    var pre = flavorNutritionOrigin + name + " :";

    if ( kind !== null && kind !== undefined ) {
      if ( ( typeof kind ).toLowerCase() === "string" ) {
        if ( kind.trim() !== "" ) {
          return msg + type + " " + kind;
        } else {
          console.log( pre + "Provide a " + type + " not an empty string!" );
        }
      } else {
        console.log( pre + "Provide a " + type + " of type string!" );
      }
    } else {
      console.log( pre + "Provide a " + type + "!" );
    }
    return "Internal Error occurred. Read console for more info.";
  }
}

var api = {
  uri : {
    protocol : "https:",
    hostname : "api.yummly.com",
    path : "/v1/api/",
    headers : {},
    url : function () {
      return api.uri.protocol + "//" + api.uri.hostname + api.uri.path;
    },
    request : function () {
      return {
        protocol : api.uri.protocol,
        hostname : api.uri.hostname,
        path : api.uri.path,
        headers : api.uri.headers
      }
    }
  },
  endpoint : {
    getSearch : function ( returnObj ) {
      return api.endpoint.retreive ( "recipes/", returnObj );
    },
    getRetreive : function ( returnObj ) {
      return api.endpoint.retreive ( "recipe/", returnObj );
    },
    getParamValues : function ( returnObj ) {
      return api.endpoint.retreive ( "metadata/", returnObj );
    },
    retreive : function ( path, returnObj ) {
      if ( returnObj === true ) {
        var options = api.uri.request();

        options.path += path;

        return options;
      } else {
        return api.uri.url + path;
      }
    }
  },
  metadata : {
    diet : "diet",
    allergy : "allergy",
    ingredient : "ingredient",
    cuisine : "cuisine",
    course : "course",
    holiday : "holiday"
  },
  issue : {
    metadata : {
      missing : {
        category : "No category provided.",
        value : "No value provided."
      },
      empty : {
        category : "Empty category provided.",
        value : "Empty value provided."
      },
      invalid : {
        category : "Unrecognized metadata category",
        categoryType : "Invalid category type. Expected string.",
        value : {
          default : "Invalid value provided.",
          flavorNutrition : {
            unrecognized : buildInvalidFlavorNutritionIssue ( "Unrecognized ", ".unrecognized" ),
            noMinMax : buildInvalidFlavorNutritionIssue ( "Provide a min value or a max value. Or provide both for ", ".noMinMax" )
          }
        },
        valueType : {
          array : invalidValueType + "Expected array.",
          integer : invalidValueType + "Expected absolute integer.",
          float : invalidValueType + "Expected absolute float.",
          object : invalidValueType + "Expected object",
          range : invalidValueType + "Expected float between 0 and 1."
        }
      },
      get : {
        acceptedValues : "Unexpected error occured."
      }
    }
  },
  searchParams : {
    q : "", // search query
    allowedDiet         : [], // https://api.yummly.com/v1/api/metadata/diet
    allowedAllergy      : [], // https://api.yummly.com/v1/api/metadata/allergy
    allowedIngredient   : [], // https://api.yummly.com/v1/api/metadata/ingredient
    allowedCuisine      : [], // https://api.yummly.com/v1/api/metadata/cuisine
    allowedCourse       : [], // https://api.yummly.com/v1/api/metadata/course
    allowedHoliday      : [], // https://api.yummly.com/v1/api/metadata/holiday
    excludedIngredient  : [], // https://api.yummly.com/v1/api/metadata/ingredient
    excludedCuisine     : [], // https://api.yummly.com/v1/api/metadata/cuisine
    excludedCourse      : [], // https://api.yummly.com/v1/api/metadata/course
    excludedHoliday     : [], // https://api.yummly.com/v1/api/metadata/holiday
    maxTotalTimeInSeconds : 3600, // time it takes to make recipe (sec)
    flavor : { // float between 0 and 1
      sweet   : { min : 0, max : 0 },
      meaty   : { min : 0, max : 0 }, // savory
      sour    : { min : 0, max : 0 },
      bitter  : { min : 0, max : 0 },
      piquant : { min : 0, max : 0 }  // spicy
    },
    nutrition : { // absolute float
      K           : { min : 0, max : 0 }, // Potassium, K (g)
      NA          : { min : 0, max : 0 }, // Sodium, Na (g)
      CHOLE       : { min : 0, max : 0 }, // Cholesterol (g)
      FATRN       : { min : 0, max : 0 }, // Fatty acids, total trans (g)
      FASAT       : { min : 0, max : 0 },  // Fatty acids, total saturated (g)
      CHOCDF      : { min : 0, max : 0 },  // Carbohydrate, by difference (g)
      FIBTG       : { min : 0, max : 0 }, // Fiber, total dietary (g)
      PROCNT      : { min : 0, max : 0 }, // Protein (g)
      SUGAR       : { min : 0, max : 0 }, // Sugars, total (g)
      ENERC_KCAL  : { min : 0, max : 0 }, // Energy (kcal)
      FAT         : { min : 0, max : 0 },  // Total lipid (fat) (g)
      VITC        : { min : 0, max : 0 }, // Vitamin C, total ascorbic acid (g)
      CA          : { min : 0, max : 0 }, // Calcium, Ca (g)
      FE          : { min : 0, max : 0 }, // Iron, Fe (g)
      VITA_IU     : { min : 0, max : 0 }  // Vitamin A, (IU)
    },
    maxResult : 10, // number of results to return
    start : 0,      // result number to start at (default is 0)
    facetCount : [] // lists the matching diets or ingredients and how many results match each diet or ingredient
  }
}

var notConfigured = pkgName + " has not been configured. ";

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
    empty : notConfigured + "No configuation provided.",
    invalid: {
      type : notConfigured + "Invalid configuration type. Expected type object.",
      idOrKey : notConfigured + "Invalid appId or appKey provided.",
      idOrKeyType : notConfigured + "Invalid appId type or appKey type provided. Expected type string."
    },
    missing : {
      id : notConfigured + "Missing AppId.",
      key : notConfigured + "Missing AppKey."
    }
  }
}

module.exports = {
  name : pkgName,
  env : env,
  api : api,
  config : config
}