const userDetails = require( './beanClasses/users' );
const connection = require( "../utilities/connections" )
const Booking = require( './beanClasses/booking' )

const usersDB = {}

usersDB.generateUserId = () => {
    return connection.getUserCollection().then( ( collection ) => {
        return collection.distinct( "userId" ).then( ( userId ) => {
            let ids = []
            for( let id of userId ) {
                ids.push( id.substr( 1 ) )
            }
            let Id = Math.max( ...ids )
            return"U" + ( Id + 1 )
        } )
    } )
}
usersDB.generateBookingId = () => {
    return connection.getBookingCollection().then( ( collection ) => {
        return collection.distinct( "bookingId" ).then( ( bookingId ) => {
            let ids = []
            for( let id of bookingId ) {
                ids.push( id.substr( 1 ) )
            }
            let bId = Math.max( ...ids )
            return"B" + ( bId + 1 )
        } )
    } )
}


usersDB.checkUser = ( contactNo ) => {
    return connection.getUserCollection().then( ( collection ) => {
        return collection.findOne( { "contactNo": contactNo } ).then( ( customerContact ) => {
            if( customerContact ) {
                return new userDetails( customerContact );
            }
            else return null;
        } )
    } )
}

usersDB.getPassword = ( contactNo ) => {
    return connection.getUserCollection().then( ( collection ) => {
        return collection.find( { "contactNo": contactNo }, { _id: 0, password: 1 } ).then( ( password ) => {
            if( password.length != 0 )
                return password[0].password;
            else
                return null;
        } )
    } )
}

usersDB.validateUser = ( contactNo ) => {
    return connection.getUserCollection().then( ( collection ) => {
        return collection.find( { contactNo: contactNo }, { _id: 0, userId: 1 } ).then( ( userId ) => {
            if( userId.length != 0 ) {
                return userId[0].userId
            } else return null
        } )
    } )
}

usersDB.registerUser = ( Obj ) => {
    return connection.getUserCollection().then( ( collection ) => {
        return usersDB.generateUserId().then( ( userId ) => {
            let userObj = new userDetails( Obj )
            userObj.userId = userId
            return collection.insertMany( [userObj] ).then( ( res ) => {
                if( res.length > 0 ) {
                    return res
                } else return null
            } )
        } )
    } )
}

usersDB.getHotDeals = () => {
    return connection.getHotdealCollection().then( ( collection ) => {
        return collection.find( {}, { _id: 0, "__v": 0 } ).then( ( deals ) => {
            if( deals.length > 0 ) {
                return deals
            } else{
                return null
            }
        } )
    } )
}

usersDB.getDestinationByContinent = ( continent ) => {
    return connection.getDestinationCollection().then( ( collection ) => {
        return collection.find(
            { "$or": [{ "continent": { $regex: continent } }, { "name": { $regex: continent } }] },
            { _id: 0, "__v": 0 }
        ).then( ( dests ) => {
            if( dests.length > 0 ) {
                return dests
            } else{
                return null
            }
        } )
    } )
}

usersDB.getDestinationById = ( destId ) => {
    return connection.getDestinationCollection().then( ( collection ) => {
        return collection.find( { "destinationId": destId }, { _id: 0, "__v": 0 } ).then( ( destination ) => {
            if( destination.length > 0 ) {
                return destination
            } else{
                return connection.getHotdealCollection().then( ( collection ) => {
                    return collection.find( { "destinationId": destId }, { _id: 0, "__v": 0 } ).then( ( hotDeal ) => {
                        if( hotDeal.length > 0 ) {
                            return hotDeal
                        } else{
                            return null
                        }
                    } )
                } )
            }
        } )
    } )
}

usersDB.bookPackage = ( bookPack ) => {
    return connection.getBookingCollection().then( ( bcollection ) => {
        return usersDB.generateBookingId().then( ( bId ) => {
            let bookingObj = new Booking( bookPack )
            bookingObj.bookingId = bId
            return bcollection.insertMany( [bookingObj] ).then( ( bData ) => {
                if( bData.length > 0 ) {
                    return connection.getUserCollection().then( ( ucollection ) => {
                        return ucollection.update( { "userId": bookPack.userId }, { $push: { "bookings": bId } } ).then( ( data ) => {
                            if( data.nModified > 0 ) {
                                return bData
                            } else{
                                return null
                            }
                        } )
                    } )
                } else{
                    return null
                }
            } )
        } )
    } )
}

usersDB.getBookingsOfUser = ( userId ) => {
    return connection.getBookingCollection().then( ( collection ) => {
        return collection.find( { userId: userId }, { __v: 0, _id: 0 } ).then( ( bookings ) => {
            if( bookings.length > 0 ) {
                return bookings
            } else{
                return null
            }
        } )
    } )
}

usersDB.cancelBooking = ( bookingId ) => {
    return connection.getBookingCollection().then( ( collection ) => {
        return collection.find( { "bookingId": bookingId }, { __v: 0, _id: 0 } ).then( ( booking ) => {
            return connection.getUserCollection().then( ( ucollection ) => {
                const userId = booking[0].userId
                return ucollection.update( { "userId": userId }, { $pull: { "bookings": bookingId } } ).then( ( update ) => {
                    if( update.nModified > 0 ) {
                        return collection.deleteOne( { "bookingId": bookingId } ).then( ( data ) => {
                            if( data.deletedCount > 0 ) {
                                return data
                            } else{
                                return null
                            }
                        } )
                    } else{
                        return null
                    }
                } )
            } )
        } )
    } )
}

module.exports = usersDB;
