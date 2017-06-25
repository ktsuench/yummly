'use strict';

require( "dotenv" ).config();

var chai = require( "chai" );
var chaiAsPromised = require("chai-as-promised");
var expect = chai.expect;
var should = chai.should();
var yummly = require( "../index.js" );

chai.use( chaiAsPromised );

describe ( "Configuration", function () {
  it ( "Empty - configuration not provided", function () {
    expect ( function () {
      yummly.config( null );
    } ).to.throw( Error, yummly.configFail.empty );

    expect( function () {
      yummly.config( undefined );
    } ).to.throw( Error, yummly.configFail.empty );
  } );

  it( "Invalid Type - configuration is not an object", function () {
    expect( function () {
      yummly.config( 2 );
    } ).to.throw( Error, yummly.configFail.invalid.type );
  } );

  it( "Invalid AppId or AppKey - configuration provided with invalid AppId or AppKey", function () {
    yummly.config( { id : "", key : "" } ).should.eventually.throw( Error, yummly.configFail.invalid.idOrKey );
  } );

  it( "Invalid AppId or AppKey - AppId or AppKey is not a string", function () {
    expect( function () {
      yummly.config( { id : 0, key : 0 } );
    } ).to.throw( Error, yummly.configFail.invalid.idOrKeytype );
  } );

  it( "Missing AppId", function () {
    expect( function () {
      yummly.config( { key : 0 } );
    } ).to.throw( Error, yummly.configFail.missing.id );
  } );

  it( "Missing AppKey", function () {
    expect( function () {
      yummly.config( { id : 0 } );
    } ).to.throw( Error, yummly.configFail.missing.key );
  } );

  it( "Valid API Access - Requires API Access", function () {
    if ( process.env.APIACCESS === "on" ) {
      var options = {
        id : process.env.APPID,
        key : process.env.APPKEY
      }

      // test that the original options are returned
      yummly.config( options ).should.eventually.equal( options );

      var config = {
        id : yummly.configApp.id.value,
        key : yummly.configApp.key.value
      }

      // test that the configuration has been correct set
      yummly.config( options ).should.eventually.equal( config );
    } else {
      should.fail( null, null, "Test will be run when api access is allowed." );
    }
  } );
} );