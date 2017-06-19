require( "dotenv" ).config();

var chai = require( "chai" );
var chaiAsPromised = require("chai-as-promised");
var expect = chai.expect;
var should = chai.should();
var yummly = require( "../index.js" );

chai.use( chaiAsPromised );

var options = {
  id : process.env.APPID,
  key : process.env.APPKEY
}

//yummly.config( options );

describe ( "Metadata", function () {
  describe ( "Accepted Values - yummly.metadata.acceptedValues()", function () {
    it ( "Missing Category", function () {
      expect ( function () {
        yummly.metadata.acceptedValues();
      } ).to.throw( Error, yummly.apiFail.metadata.missing.category );
    } );

    it ( "Empty Category", function () {
      expect ( function () {
        yummly.metadata.acceptedValues( "" );
      } ).to.throw( Error, yummly.apiFail.metadata.empty.category );
    } );

    it ( "Invalid Category", function () {
      expect ( function () {
        yummly.metadata.acceptedValues( "test" );
      } ).to.throw( Error, yummly.apiFail.metadata.invalid.category );
    } );

    it ( "Invalid Category Type", function () {
      expect ( function () {
        yummly.metadata.acceptedValues( 0 );
      } ).to.throw( Error, yummly.apiFail.metadata.invalid.categoryType );
    } );

    it ( "Valid Response", function () {
      yummly.metadata.acceptedValues( "holiday" ).should.eventually.have.nested.include({ 
        id : "holiday-christmas",
        searchValue : "holiday^holiday-christmas"
      } );
    } );
  } );

  describe ( "Set - yummly.metadata.set", function () {
    describe ( "Diet - yummly.metadata.set.diet()", function () {
      it ( "Missing Value", function () {
        expect( function () {
          yummly.metadata.set.diet();
        } ).to.throw( Error, yummly.apiFail.metadata.missing.value );
      } );

      it ( "Invalid Value Type", function () {
        var diet = {};

        expect( function () {
          yummly.metadata.set.diet( diet );
        } ).to.throw( Error, yummly.apiFail.metadata.invalid.valueType.array );
      } );

      it ( "Empty Value", function () {
        var diet = [];

        expect( function () {
          yummly.metadata.set.diet( diet );
        } ).to.throw( Error, yummly.apiFail.metadata.empty.value );
      } );

      it ( "Valid Response", function () {
        var diet = [ "388^Lacto vegetarian", "389^Ovo vegetarian" ];

        yummly.metadata.set.diet( diet );

        yummly.apiSearchParams.allowedDiet.should.include( diet[0] );
        yummly.apiSearchParams.allowedDiet.should.include( diet[1] );
      } );
    } );

    describe ( "Course - yummly.metadata.set.course()", function () {
      it ( "Missing Value", function () {
        expect( function () {
          yummly.metadata.set.course();
        } ).to.throw( Error, yummly.apiFail.metadata.missing.value );
      } );

      it ( "Invalid Value Type", function () {
        var courses = [];

        expect( function () {
          yummly.metadata.set.course( courses );
        } ).to.throw( Error, yummly.apiFail.metadata.invalid.valueType.object );
      } );

      it ( "Empty Value", function () {
        var courses = {};

        expect( function () {
          yummly.metadata.set.course( courses );
        } ).to.throw( Error, yummly.apiFail.metadata.empty.value );
      } );

      it ( "Valid Response", function () {
        var courses = {
          allowed : [ "course^course-Main Dishes", "course^course-Desserts" ],
          excluded : [ "course^course-Breads", "course^course-Condiments and Sauces"]
        };

        yummly.metadata.set.course( courses );

        yummly.apiSearchParams.allowedCourse.should.include( courses.allowed[0] );
        yummly.apiSearchParams.allowedCourse.should.include( courses.allowed[1] );
        yummly.apiSearchParams.excludedCourse.should.include( courses.excluded[0] );
        yummly.apiSearchParams.excludedCourse.should.include( courses.excluded[1] );
      } );
    } );

    describe ( "Duration - yummly.metadata.set.duration()", function () {
      it ( "Missing Value", function () {
        expect( function () {
          yummly.metadata.set.duration();
        } ).to.throw( Error, yummly.apiFail.metadata.missing.value );
      } );

      it ( "Invalid Value Type", function () {
        var time = "a";

        expect( function () {
          yummly.metadata.set.duration( time );
        } ).to.throw( Error, yummly.apiFail.metadata.invalid.valueType.integer );
      } );

      it ( "Invalid Value", function () {
        var time = 0;

        expect( function () {
          yummly.metadata.set.duration( time );
        } ).to.throw( Error, yummly.apiFail.metadata.invalid.value.default );
      } );

      it ( "Valid Response", function () {
        var time = 3600;

        yummly.metadata.set.duration( time );

        yummly.apiSearchParams.maxTotalTimeInSeconds.should.equal( time );
      } );
    } );

    describe ( "Start - yummly.metadata.set.start()", function () {
      it ( "Invalid Value", function () {
        var position = -1;

        expect( function () {
          yummly.metadata.set.start( position );
        } ).to.throw( Error, yummly.apiFail.metadata.invalid.value.default );
      } );

      it ( "Valid Response", function () {
        var position = 0;

        yummly.metadata.set.start( position );

        yummly.apiSearchParams.start.should.equal( position );
      } );
    } );
  } );
} );