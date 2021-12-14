const request = require("request");
const packageUrl = "http://localhost:4000/package";
const userUrl = "http://localhost:4000/user";
const bookUrl = "http://localhost:4000/book";

describe("TestCase Set 1: SetUp Db", () => {
    it("TestCase 1: Returns status code 200", (done) => {
        request.get(userUrl + "/setup", (error, response, body) => {
            expect(response.statusCode).toBe(200);
            done();
        });
    });
    it("TestCase 2: Returns Inserted Successfully", (done) => {
        request.get(userUrl + "/setup", (error, response, body) => {
            expect(body).toBe("Insertion Successfull");
            done();
        });
    });
});

describe("TestCase Set 2: Get Destinations", () => {
    it("TestCase 1: Returns status code 200", (done) => {
        request.get(packageUrl + "/getDetails/D1001", (error, response, body) => {
            expect(response.statusCode).toBe(200);
            done();
        });
    });
});

describe("TestCase Set 3: Get Hotdeals", () => {
    it("TestCase 1: Valid Response", (done) => {
        request.get(packageUrl + "/hotdeals", (error, response, body) => {
            expect(response.statusCode).toBe(200);
            expect(body).toBeTruthy();
            done();
        });
    });
});

describe("TestCase Set 4: Get Search Bar Destination", () => {
    it("TestCase 1: Valid City Response", (done) => {
        request.get(packageUrl + "/destinations/Paris", (error, response, body) => {
            expect(response.statusCode).toBe(200);
            expect(body).toBeTruthy();
            done();
        });
    });
    it("TestCase 2: Valid Continent Response", (done) => {
        request.get(packageUrl + "/destinations/ASIA", (error, response, body) => {
            expect(response.statusCode).toBe(200);
            expect(body).toBeTruthy();
            done();
        });
    });
})
describe("TestCase Set 5: Get Bookings", () => {
    it("TestCase 1: Valid UserId", (done) => {
        request.get(bookUrl + "/getBookings/U1001", (error, response, body) => {
            expect(response.statusCode).toBe(200);
            expect(body).toBeTruthy();
            done();
        });
    });
})