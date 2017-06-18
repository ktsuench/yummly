# Yummly API Get Started
This is a quick place to get started with the Yummly API and see recipes that it returns based on nutritional value.

## Getting Started
In the `apitest.js` file, input your `appid` and `appkey`.

### API Paramters
Allowed parameters for ingredients

``` javascript
  {
    q : "", // query
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
    maxTotalTimeInSeconds : 3600, // time it takes to make recipe (seconds)
    flavor : { // float between 0 and 1
      sweet   : { min : 0, max : 0 },
      meaty   : { min : 0, max : 0 }, // savory
      sour    : { min : 0, max : 0 },
      bitter  : { min : 0, max : 0 },
      piquant : { min : 0, max : 0 }  // spicy
    },
    nutrition : {
      K           : { min : 0, max : this.potassium.value   / 1000 }, // Potassium, K (g)
      NA          : { min : 0, max : this.sodium.value      / 1000 }, // Sodium, Na (g)
      CHOLE       : { min : 0, max : this.cholesterol.value / 1000 }, // Cholesterol (g)
      FATRN       : { min : 0, max : this.transFat.value },           // Fatty acids, total trans (g)
      FASAT       : { min : 0, max : 0},                            // Fatty acids, total saturated (g)
      CHOCDF      : { min : 0, max : 0},                            // Carbohydrate, by difference (g)
      FIBTG       : { min : 0, max : this.fiber.value },              // Fiber, total dietary (g)
      PROCNT      : { min : 0, max : this.protein.value },            // Protein (g)
      SUGAR       : { min : 0, max : this.sugar.value },              // Sugars, total (g)
      ENERC_KCAL  : { min : 0, max : this.calories.value    / 1000 }, // Energy (kcal)
      FAT         : { min : 0, max : this.fat.value }               // Total lipid (fat) (g)
      VITC        : { min : 0, max : 0},                            // Vitamin C, total ascorbic acid (g)
      CA          : { min : 0, max : 0},                            // Calcium, Ca (g)
      FE          : { min : 0, max : 0},                            // Iron, Fe (g)
      VITA_IU     : { min : 0, max : 0},                            // Vitamin A, (IU)
    },
    maxResult : 10, // number of results to return
    start : 0, // result number to start at (default is 0)
    facetCount : [ "diet", "ingredient" ] // lists the matching diets or ingredients and how many results match each diet or ingredient
  }
```

## Notes
There are other nutritional values available as well, look through the script and uncomment the values that you would like to test out.

Also, there are other parameters available. Look through the script to see what else you can search for recipes by.