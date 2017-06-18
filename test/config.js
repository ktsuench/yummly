require('dotenv').config();

var chai = require( "chai" );
var chaiAsPromised = require("chai-as-promised");
var expect = chai.expect;
var should = chai.should();
var yummly = require( "../index.js" );

chai.use( chaiAsPromised );

function spyOnConsoleLog (options, errorMsg ) {
  expect( function () { yummly.config( options ) } ).to.throw( Error, errorMsg );
}

describe( "Configuration", function () {
  it( "Empty - configuration not provided", function () {
    expect( function () {
      yummly.config( null );
    } ).to.throw( Error, yummly.configFail.empty() );

    expect( function () {
      yummly.config( undefined );
    } ).to.throw( Error, yummly.configFail.empty() );
  } );

  it( "Invalid Type - configuration is not an object", function () {
    expect( function () {
      yummly.config( 2 );
    } ).to.throw( Error, yummly.configFail.invalid.type() );
  } );

  it( "Invalid AppId or AppKey - configuration provided with invalid AppId or AppKey", function () {
    yummly.config( { id : 0, key : 0 } ).should.eventually.throw( Error, yummly.configFail.invalid.idOrKey() );
  } );

  it( "Missing AppId", function () {
    expect( function () {
      yummly.config( { key : 0 } );
    } ).to.throw( Error, yummly.configFail.missing.id() );
  } );

  it( "Missing AppKey", function () {
    expect( function () {
      yummly.config( { id : 0 } );
    } ).to.throw( Error, yummly.configFail.missing.key() );
  } );

  it( "Valid", function () {
    var options = {
      id : process.env.APPID,
      key : process.env.APPKEY
    }

    yummly.config( options ).should.eventually.equal( options );
  } );
} );