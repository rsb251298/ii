import React from'react';
import ReactDOM from'react-dom';
import App from'./App';
import Home from "./components/home";
import Packages from "./components/packages";
import ViewBookings from "./components/viewBookings";
import { shallow,mount,render } from "enzyme";

it( 'renders without crashing', () => {
  const div = document.createElement( 'div' );
  ReactDOM.render( <App />, div );
  ReactDOM.unmountComponentAtNode( div );
} );
const testDataPackage = {

  destinationId: "D1001",
  continent: "Europe",
  imageUrl: "/assets/geece.jpg",
  name: "A Week in Greece: Athens, Mykonos & Santorini",
  details: {
    about: "Watch the setting sun from the hilltops of Greece’s most famous islands.Experience ancient history and open-air museums in the capital of Athens. Then, the quintessential, beautiful Greek islands you’ve been dreaming of come to life on the isles of Mykonos and Santorini.",
    itinerary: {
      dayWiseDetails: {
        firstDay: "Travel day: Board your overnight flight to Athens.",
        restDaysSightSeeing: [
          "Santorini",
          "Acropolis",
          "Parthenon",
          "Temple of Apollo",
          "Ruins of Olympia",
          "Ancient Theater of Epidaurus"
        ],
        lastDay: "Departure:Transfer to the airport for your flight home."
      },
      packageInclusions: [
        "7 nights in handpicked hotels",
        "7 breakfasts",
        "3 dinners with beer or wine",
        "3 guided sightseeing tours",
        "Expert tour director & local guides",
        "Private deluxe motor coach"
      ],
      tourHighlights: [
        "Greece",
        "Athens",
        "Mykonos",
        "Santorini",
        "Acropolis",
        "Parthenon",
        "Temple of Apollo",
        "Ruins of Olympia",
        "Ancient Theater of Epidaurus",
        "Corinth Canal photo stop"
      ],
      tourPace: [
        "On this guided tour, you will walk for about 2 hours daily across uneven terrain, including paved roads and unpaved trails, with some hills and stairs."
      ]
    }
  },
  noOfNights: 7,
  flightCharges: 500,
  chargesPerPerson: 2499,
  discount: 0,
  availability: 30
}

const testBookingData = {
 
  bookingId: "B1001",
  userId: "U1001",
  destId: "D1001",
  destinationName: "A Week in Greece: Athens, Mykonos & Santorini",
  checkInDate: "2018-12-09",
  checkOutDate: "2018-12-16",
  noOfPersons: 2,
  totalCharges: 5998,
  timeStamp: "1588850477237"
}
// App component
describe("App Component", () => {
  // test cases will be written here.

  test("checks for 1 nav tag", () => {
    const wrapper = shallow(<App />);
    expect(wrapper.find('nav').length).toEqual(1);
  });

  test("checks for 1 tag with class .navbar-header", () => {
    const wrapper = shallow(<App />);
    expect(wrapper.find(".navbar-header").length).toEqual(1);
  });

  test("checks for initial state of logged_out state", () => {
    const wrapper = shallow(<App />);
    expect(wrapper.state().logged_out).toEqual(false);
  });

  test("checks if Dialog component renders after change in state of dialog_visible to true", () => {
    const wrapper = shallow(<App />);
    wrapper.setState({ dialog_visible: true });
    expect(wrapper.find("Dialog").length).toEqual(1);
  });

  test("checks if logout Button exists if state of logged_userId is true", () => {
    const wrapper = shallow(<App />);
    wrapper.setState({ logged_userId: true });
    expect(wrapper.find("#logoutButton").length).toEqual(1);
  });


});

// Home component

describe("Home Component", () => {
  // test cases will be written here.

  test("check for 1 header tag", () => {
    const wrapper = shallow(<Home />);
    expect(wrapper.find("header").length).toEqual(1);
  });

  test("checks for section component with id about", () => {
    const wrapper = shallow(<Home />);
    expect(wrapper.find("#about").length).toEqual(1);
  });

  test("checks for section component with id signup ", () => {
    const wrapper = shallow(<Home />);
    expect(wrapper.find("#signup").length).toEqual(1);
  });

  test("checks if packagePage state is true then Redirects to packages", () => {
    const wrapper = shallow(<Home />);
    wrapper.setState({ packagePage: true });
    expect(wrapper.find("Redirect").length).toEqual(1);
  });

  test("checks if logout Button exists if state of logged_userId is true", () => {
    const wrapper = shallow(<Home />);
    wrapper.find("#getPackage").simulate("click")
    expect(wrapper.state().packagePage).toEqual(true);
  });
});



// Packages component
describe("Packages Component", () => {
  // test cases will be written here.

  test("check if 1 Sidebar tag present", () => {
    const wrapper = shallow(<Packages data={testDataPackage}/>);
    expect(wrapper.find("Sidebar").length).toEqual(1);
  });

  test("check if 3 TabPanel tabs component present", () => {
    const wrapper = shallow(<PackageOverview data={testDataPackage}/>);
    expect(wrapper.find("TabPanel").length).toEqual(3);
  });

  test("check if 5 Button tags present", () => {
    const wrapper = shallow(<PackageOverview data={testDataPackage} />);
    expect(wrapper.find("Button").length).toEqual(5);
  });
});


// ViewBookings component
describe("ViewBookings Component",()=>{
  
  test("check initial state of dialogVisible", () => {
    const wrapper = shallow(<ViewBookings />)
    expect(wrapper.state().dialogVisible).toEqual(false)
  })
  test("check state of dialogVisible when function cancel_booking is called", () => {
    const wrapper = shallow(<ViewBookings />)
    wrapper.instance().cancel_booking('B1004')
    expect(wrapper.state().dialogVisible).toEqual(false)
  })

  test("check state of can_booking when function confirm_cancel is called", () => {
    const wrapper = shallow(<ViewBookings />)
    wrapper.instance().confirm_cancel(testBookingData)

    expect(wrapper.state().can_booking).toEqual(testBookingData)
  })



})