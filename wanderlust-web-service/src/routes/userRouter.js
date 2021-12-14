const express = require( 'express' );
const router = express.Router();
const setupUser = require( "../model/dbsetup" )
const userservice = require( '../service/userslogin' )
// const User = require('../model/beanClasses/users')

router.get( "/setup", ( req, res, next ) => {
    setupUser.setupDb().then( ( data ) => {
        res.send( data )
    } ).catch( err => next( err ) );
} )

//router to login
router.post( '/login', function ( req, res, next ) {
    let contactNo = req.body.contactNo;
    let password = req.body.password;
    userservice.login( parseInt( contactNo ), password ).then( function ( userDetails ) {
        res.json( userDetails );
    } ).catch( err => next( err ) );
} )
router.post( '/register', ( req, res, next ) => {
    let userObj = req.body
    userservice.registeruser( userObj ).then( ( data ) => {
        res.json( data )
    } ).catch( ( err ) => {
        next( err );
    } )
} )

router.get( '/hotDeals', ( req, res, next ) => {
    userservice.getHotDeals().then( ( deals ) => {
        res.json( deals )
    } ).catch( ( err ) => {
        next( err );
    } )
} )

router.get( '/destinations/:continent', ( req, res, next ) => {
    function titleCase ( str ) {
        return str.toLowerCase().split( ' ' ).map( function ( word ) {
            return( word.charAt( 0 ).toUpperCase() + word.slice( 1 ) );
        } ).join( ' ' );
    }
    let continent = titleCase( req.params.continent );
    userservice.getDestinationByContinent( continent ).then( ( dests ) => {
        res.json( dests )
    } ).catch( ( err ) => {
        next( err );
    } )
} )

router.get( '/getDetails/:destinationId', ( req, res, next ) => {
    let destId = req.params.destinationId
    userservice.getDestinationById( destId ).then( ( dests ) => {
        res.json( dests )
    } ).catch( ( err ) => {
        next( err )
    } )
} )

router.post( '/:userId/:destinationId', ( req, res, next ) => {
    let bookPack = req.body
    userservice.bookPackage( bookPack ).then( ( bData ) => {
        res.json( bData )
    } ).catch( ( err ) => {
        next( err )
    } )
} )


router.get( '/getBookings/:userId', ( req, res, next ) => {
    let userId = req.params.userId
    userservice.getBookingsOfUser( userId ).then( ( bookings ) => {
        res.json( bookings )
    } ).catch( ( err ) => {
        next( err )
    } )
} )
router.delete( '/cancelBooking/:bookingId', ( req, res, next ) => {
    let bookingId = req.params.bookingId
    return userservice.cancelBooking( bookingId ).then( ( data ) => {
        console.log( data );
        res.json( { message: "Successfully deleted the booking with id " + bookingId } )
    } ).catch( ( err ) => {
        next( err )
    } )
} )

module.exports = router;

