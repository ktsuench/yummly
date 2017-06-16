var appID = "";
var appKey = "";

var frmFk = document.getElementById("frmFk");

frmFk.onsubmit = function (event) {
  event.preventDefault();

  var xhttp = new XMLHttpRequest();

  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      console.log( JSON.parse( xhttp.responseText ) );

      var resultDisplay = document.getElementById( "result" );
      var yummlyResponse = JSON.parse( xhttp.responseText );

      if ( yummlyResponse.matches.length > 0 ) {
        yummlyResponse.matches.forEach( function (recipe) {
          var xhttp2 = new XMLHttpRequest();

          xhttp2.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
              var yummlyRecipe = JSON.parse( xhttp2.responseText );

              resultDisplay.innerHTML += "<a href='" + yummlyRecipe.source.sourceRecipeUrl + "'>" + yummlyRecipe.name + "</a><br />";
            }
          }

          xhttp2.open( "GET", "https://api.yummly.com/v1/api/recipe/" + recipe.id, true );
          xhttp2.setRequestHeader( "X-Yummly-App-ID", appID );
          xhttp2.setRequestHeader( "X-Yummly-App-Key", appKey );
          xhttp2.send();
        } );
      }

    } else {
      console.log( xhttp );
    }
  }

  var allowed_params = {
    q : "",
    allowedDiet : [ "388^Lacto vegetarian", "389^Ovo vegetarian" ],                     // https://api.yummly.com/v1/api/metadata/diet
    allowedAllergy : [ "393^Gluten-Free", "394^Peanut-Free" ],                          // https://api.yummly.com/v1/api/metadata/allergy
    allowedIngredient : [ "garlic", "salt" ],                                           // https://api.yummly.com/v1/api/metadata/ingredient
    allowedCuisine : [ "cuisine^cuisine-american", "cuisine^cuisine-asian" ],           // https://api.yummly.com/v1/api/metadata/cuisine
    allowedCourse : [ "course^course-Main Dishes", "course^course-Desserts" ],          // https://api.yummly.com/v1/api/metadata/course
    allowedHoliday : [ "holiday^holiday-halloween", "holiday^holiday-valentines-day" ], // https://api.yummly.com/v1/api/metadata/holiday
    excludedIngredient: [ "butter", "water" ],                                          // https://api.yummly.com/v1/api/metadata/ingredient
    excludedCuisine : [ "cuisine^cuisine-barbecue-bbq", "cuisine^cuisine-indian" ],     // https://api.yummly.com/v1/api/metadata/cuisine
    excludedCourse : [ "course^course-Salads", "course^course-Snacks" ],                // https://api.yummly.com/v1/api/metadata/course
    excludedHoliday : [ "holiday^holiday-christmas", "holiday^holiday-winter" ],        // https://api.yummly.com/v1/api/metadata/holiday
    maxTotalTimeInSeconds : 3600, // time it takes to make recipe (sec)
    flavor : { // float between 0 and 1
      sweet   : { min : 0, max : 0 },
      meaty   : { min : 0, max : 0 }, // savory
      sour    : { min : 0, max : 0 },
      bitter  : { min : 0, max : 0 },
      piquant : { min : 0, max : 0 }, // spicy
    },
    nutrition : {
      K           : { min : 0, max : this.potassium.value   / 1000 }, // Potassium, K (g)
      NA          : { min : 0, max : this.sodium.value      / 1000 }, // Sodium, Na (g)
      CHOLE       : { min : 0, max : this.cholesterol.value / 1000 }, // Cholesterol (g)
      FATRN       : { min : 0, max : this.transFat.value },           // Fatty acids, total trans (g)
      //FASAT       : { min : 0, max : 0},                            // Fatty acids, total saturated (g)
      //CHOCDF      : { min : 0, max : 0},                            // Carbohydrate, by difference (g)
      FIBTG       : { min : 0, max : this.fiber.value },              // Fiber, total dietary (g)
      PROCNT      : { min : 0, max : this.protein.value },            // Protein (g)
      SUGAR       : { min : 0, max : this.sugar.value },              // Sugars, total (g)
      ENERC_KCAL  : { min : 0, max : this.calories.value    / 1000 }, // Energy (kcal)
      //FAT         : { min : 0, max : this.fat.value }               // Total lipid (fat) (g)
      //VITC        : { min : 0, max : 0},                            // Vitamin C, total ascorbic acid (g)
      //CA          : { min : 0, max : 0},                            // Calcium, Ca (g)
      //FE          : { min : 0, max : 0},                            // Iron, Fe (g)
      //VITA_IU     : { min : 0, max : 0},                            // Vitamin A, (IU)
    },
    maxResult : 10, // number of results to return
    start : 0, // result number to start at (default is 0)
    facetCount : [ "diet", "ingredient" ] // lists the matching diets or ingredients and how many results match each diet or ingredient
  }

  var params = {
    nutrition : {
      K           : { min : 0, max : this.potassium.value / 1000 },
      //NA          : { min : 0, max : this.sodium.value / 1000 },
      //CHOLE       : { min : 0, max : this.cholesterol.value / 1000 },
      //FATRN       : { min : 0, max : this.transFat.value },
      FIBTG       : { min : 0, max : this.fiber.value },
      PROCNT      : { min : 0, max : this.protein.value },
      //SUGAR       : { min : 0, max : this.sugar.value },
      ENERC_KCAL  : { min : 0, max : this.calories.value / 1000 },
    }
  }

  var query = buildString( params, "", "&", true );

  console.log(query);

  xhttp.open( "GET", "https://api.yummly.com/v1/api/recipes?" + query, true );
  xhttp.setRequestHeader( "X-Yummly-App-ID", appID );
  xhttp.setRequestHeader( "X-Yummly-App-Key", appKey );
  xhttp.send();
}

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