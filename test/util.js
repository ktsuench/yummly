"use strict";

var chai = require( "chai" );
var chaiAsPromised = require("chai-as-promised");
var expect = chai.expect;
var should = chai.should();
var util = require( "../base/util" );

describe( "Utility Functions", function () {
  it( "Build Search Query String", function () {
    var options = {
      q : "spaghetti",
      allowedDiet : [ "389^Ovo vegetarian", "390^Pescetarian" ],
      allowedAllergy : [ "393^Gluten-Free", "397^Egg-Free" ],
      flavor : {
        sweet   : { min : 0, max : 0.5 },
        meaty   : { min : 0, max : 0.75 }
      },
      nutrition : {
        K           : { min : 0, max : 300 },
        NA          : { min : 0, max : 3.5 }
      },
      maxResult : 10,
      start : 0
    }

    var expected = "q=spaghetti&allowedDiet%5B%5D=389%5EOvo%20vegetarian&allowedDiet%5B%5D=390%5EPescetarian&allowedAllergy%5B%5D=393%5EGluten-Free&allowedAllergy%5B%5D=397%5EEgg-Free&flavor.sweet.min=0&flavor.sweet.max=0.5&flavor.meaty.min=0&flavor.meaty.max=0.75&nutrition.K.min=0&nutrition.K.max=300&nutrition.NA.min=0&nutrition.NA.max=3.5&maxResult=10&start=0";

    util.buildQueryString( options, "", "&", true ).should.equal( expected );
  } );
} );