const userDB = require( '../model/userslogin' );

const userService = {}

//login a user
userService.login = ( contactNo, userPassword ) => {
    return userDB.checkUser( contactNo ).then( ( user ) => {
        if( user == null ) {
            let err = new Error( "Enter registered contact number! If not registered, please register" )
            err.status = 404
            throw err
        }
        else{
            return userDB.getPassword( contactNo ).then( ( password ) => {
                if( password != userPassword ) {
                    let err = new Error( "Incorrect password" )
                    err.status = 406
                    throw err
                }
                else{
                    return user;
                }
            } )
        }
    } )
}

userService.registeruser = ( userObj ) => {
    return userDB.validateUser( userObj.contactNo ).then( ( user ) => {
        if( user ) {
            let err = new Error( "User already exits with given contact number" )
            err.status = 406
            throw err;
        } else{
            return userDB.registerUser( userObj ).then( ( data ) => {
                if( data.length > 0 ) {
                    return data
                } else{
                    let err = new Error( "Registration failed! Please try again" )
                    err.status = 500
                    throw err
                }
            } )
        }
    } )
}

userService.getHotDeals = () => {
    return userDB.getHotDeals().then( ( deals ) => {
        if( deals.length > 0 ) {
            return deals
        } else{
            let err = new Error( "No HotDeals present at the moment!" )
            err.status = 404
            throw err;
        }
    } )
}

userService.getDestinationByContinent = ( continent ) => {
    return userDB.getDestinationByContinent( continent ).then( ( dests ) => {
        if( dests.length > 0 ) {
            return dests
        } else{
            let err = new Error( "Sorry we are not serving at this location!" )
            err.status = 404
            throw err;
        }
    } )
}

userService.getDestinationById = ( destId ) => {
    return userDB.getDestinationById( destId ).then( ( destination ) => {
        if( destination.length > 0 ) {
            return destination
        } else{
            let err = new Error( "Sorry we are not serving at this location!" )
            err.status = 404
            throw err;
        }
    } )
}

userService.bookPackage = ( bookPack ) => {
    return userDB.bookPackage( bookPack ).then( ( bData ) => {
        if( bData.length > 0 ) {
            return bData
        } else{
            let err = new Error( "Booking failed please try again!!!" )
            err.status = 500
            throw err
        }
    } )
}
userService.getBookingsOfUser = ( userId ) => {
    return userDB.getBookingsOfUser( userId ).then( ( bookings ) => {
        if( bookings.length > 0 ) {
            return bookings
        } else{
            let err = new Error( "Sorry no bookings available" )
            err.status = 404
            throw err
        }
    } )
}

userService.cancelBooking = ( bookingId ) => {
    return userDB.cancelBooking( bookingId ).then( ( data ) => {
        if( data.deletedCount > 0 ) {
            return data
        } else{
            let err = new Error( "Sorry unable to delete Booking!!!" )
            err.status = 500
            throw err
        }
    } )
}

module.exports = userService
