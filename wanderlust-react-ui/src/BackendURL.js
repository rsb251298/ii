
const port = 4000;
export const backendUrlUser = `http://localhost:${port}/user`; // /register - POST, /login - POST, 
export const backendUrlPackage = `http://localhost:${port}/package`; // /hotDeals -> GET, /destinations -> GET, /getDetails/:destinationId - GET, 
export const backendUrlBooking = `http://localhost:${port}/book`; // /:userId/:destinationId -> POST, /cancelBooking/:bookingId -> DELETE, /getBookings/:userId - GET



