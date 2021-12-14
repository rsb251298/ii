const{ Schema } = require( "mongoose" );
const Mongoose = require( "mongoose" )
Mongoose.Promise = global.Promise;
const url = "mongodb://localhost:27017/Wanderlust_DB";

let userSchema = Schema( {
    name: String,
    userId: String,
    emailId: String,
    contactNo: Number,
    password: String,
    bookings: [String]
}, { collection: "User" } )

let bookingSchema = Schema( {
    bookingId: String,
    userId: String,
    destId: String,
    destinationName: String,
    checkInDate: { type: Date, default: new Date() },
    checkOutDate: { type: Date, default: new Date() },
    noOfPersons: Number,
    totalCharges: { type: Number, min: [0, "Charges cannot be less than 0"] }
}, { collection: "Bookings" },{timestamps: true} )

let destinationSchema = Schema( {
    destinationId: String,
    continent: String,
    imageUrl: String,
    name: String,
    details: {
        about: String,
        itinerary: {
            dayWiseDetails: {
                firstDay: String,
                restDaysSightSeeing: { type: [String], default: [] },
                lastDay: String
            },
            packageInclusions: { type: [String], default: [] },
            tourHighlights: { type: [String], default: [] },
            tourPace: { type: [String], default: [] }
        }
    },
    noOfNights: Number,
    flightCharges: Number,
    chargesPerPerson: Number,
    discount: Number,
    availability: Number
}, { collection: "Destinations" } )

let hotDealsSchema = Schema( {
    destinationId: String,
    continent: String,
    imageUrl: String,
    name: String,
    details: {
        about: String,
        itinerary: {
            dayWiseDetails: {
                firstDay: String,
                restDaysSightSeeing: { type: [String], default: [] },
                lastDay: String
            },
            packageInclusions: { type: [String], default: [] },
            tourHighlights: { type: [String], default: [] },
            tourPace: { type: [String], default: [] }
        }
    },
    noOfNights: Number,
    flightCharges: Number,
    chargesPerPerson: Number,
    discount: Number,
    availability: Number
}, { collection: "Hotdeals" } )


let collection = {};

collection.getUserCollection = () => {
    return Mongoose.connect( url, { useNewUrlParser: true } ).then( ( database ) => {
        return database.model( 'User', userSchema )
    } ).catch( ( error ) => {
        console.log( error.message );
        let err = new Error( "Could not connect to Database" );
        err.status = 500;
        throw err;
    } )
}
collection.getBookingCollection = () => {
    return Mongoose.connect( url, { useNewUrlParser: true } ).then( ( database ) => {
        return database.model( 'Bookings', bookingSchema )
    } ).catch( ( error ) => {
        console.log( error.message );
        let err = new Error( "Could not connect to Database" );
        err.status = 500;
        throw err;
    } )
}
collection.getDestinationCollection = () => {
    return Mongoose.connect( url, { useNewUrlParser: true } ).then( ( database ) => {
        return database.model( 'Destinations', destinationSchema )
    } ).catch( ( error ) => {
        console.log( error.message );
        let err = new Error( "Could not connect to Database" );
        err.status = 500;
        throw err;
    } )
}
collection.getHotdealCollection = () => {
    return Mongoose.connect( url, { useNewUrlParser: true } ).then( ( database ) => {
        return database.model( 'Hotdeals', hotDealsSchema )
    } ).catch( ( error ) => {
        console.log( error.message );
        let err = new Error( "Could not connect to Database" );
        err.status = 500;
        throw err;
    } )
}

module.exports = collection;
