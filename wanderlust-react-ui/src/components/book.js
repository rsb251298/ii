import React, { Component } from 'react'
import { Fieldset } from 'primereact/fieldset';
import { InputSwitch } from 'primereact/inputswitch';
import { Redirect } from 'react-router';
import axios from 'axios'
import { backendUrlBooking } from '../BackendURL';
import { Link } from 'react-router-dom'
import { ProgressSpinner } from 'primereact/progressspinner'

export class Book extends Component {
    constructor(props) {
        super(props)

        this.state = {
            bookingForm: {
                noOfPersons: sessionStorage.getItem('noOfPersons'),
                date: sessionStorage.getItem('checkInDate'),
                flights: sessionStorage.getItem('flight')
            },
            bookingFormErrorMessage: {
                noOfPersons: "",
                date: ""
            },
            bookingFormValid: {
                noOfPersons: false,
                date: false,
                buttonActive: false
            },
            deal: this.props.location.state.selectedDeal,
            overview: true,
            packageinclusions: true,
            iteranary: true,
            checkOutDate: sessionStorage.getItem('checkOutDate'),
            checkInDate: "",
            totalCharges: "",
            showHome: false,
            confirmBook: false,
            errorMessage: "",
            show: false
        }
    }

    handleChange = (event) => {
        const target = event.target;
        const name = target.name;
        if (target.checked) {
            var value = target.checked;
        } else {
            value = target.value;
        }
        const { bookingForm } = this.state;
        this.setState({
            bookingForm: { ...bookingForm, [name]: value }
        });

        this.validateField(name, value);


    }
    validateField = (fieldname, value) => {
        let fieldValidationErrors = this.state.bookingFormErrorMessage;
        let formValid = this.state.bookingFormValid;
        switch (fieldname) {
            case "noOfPersons":
                if (value === "") {
                    fieldValidationErrors.noOfPersons = "This field can't be empty!";
                    formValid.noOfPersons = false;
                } else if (value < 1) {
                    fieldValidationErrors.noOfPersons = "No. of persons can't be less than 1!";
                    formValid.noOfPersons = false;
                } else if (value > 5) {
                    fieldValidationErrors.noOfPersons = "No. of persons can't be more than 5.";
                    formValid.noOfPersons = false;
                } else {
                    fieldValidationErrors.noOfPersons = "";
                    formValid.noOfPersons = true;
                }
                break;
            case "date":
                if (value === "") {
                    fieldValidationErrors.date = "This field can't be empty!";
                    formValid.date = false;
                } else {
                    let checkInDate = new Date(value);
                    let today = new Date();
                    if (today.getTime() > checkInDate.getTime()) {
                        fieldValidationErrors.date = "Check-in date cannot be a past date!";
                        formValid.date = false;
                    } else {
                        fieldValidationErrors.date = "";
                        formValid.date = true;
                    }
                }
                break;
            default:
                break;
        }

        formValid.buttonActive = formValid.noOfPersons && formValid.date;
        this.setState({
            bookingformErrorMessage: fieldValidationErrors,
            bookingformValid: formValid,
            successMessage: ""
        });
        this.calculateCharges();
    }
    book = () => {
        const bookPack = {
            userId: sessionStorage.getItem("userId"),
            destId: this.state.deal.destinationId,
            destinationName: this.state.deal.name,
            checkInDate: this.state.bookingForm.date,
            checkOutDate: this.state.checkOutDate,
            noOfPersons: this.state.bookingForm.noOfPersons,
            totalCharges: this.state.totalCharges
        }
        axios.post(backendUrlBooking + '/' + sessionStorage.getItem("userId") + '/' + this.state.deal.destinationId, bookPack).then((res) => {
            sessionStorage.setItem("bookingId", res.data.bookingId);
            this.setState({ confirmBook: true, show: true })
        }).catch((error) => {
            this.setState({
                errorMessage: error.message
            })
        })
    }
    handleSubmit = (event) => {
        event.preventDefault();
        this.setState({ show: false }, () => {
            setTimeout(() => { this.book(); }, 1500)
        })
    }

    calculateCharges = () => {
        this.setState({ totalCharges: 0 });
        let oneDay = 24 * 60 * 60 * 1000;
        let checkInDate = new Date(this.state.bookingForm.date);
        let checkOutDateinMs = Math.round(Math.abs((checkInDate.getTime() + (this.state.deal.noOfNights) * oneDay)));
        let finalCheckOutDate = new Date(checkOutDateinMs);
        this.setState({ checkOutDate: finalCheckOutDate.toDateString(), checkInDate: checkInDate.toDateString() });
        if (this.state.bookingForm.flights) {
            let totalCost = (-(-this.state.bookingForm.noOfPersons)) * this.state.deal.chargesPerPerson + this.state.deal.flightCharges;
            this.setState({ totalCharges: totalCost });
        } else {
            let totalCost = (-(-this.state.bookingForm.noOfPersons)) * this.state.deal.chargesPerPerson;
            this.setState({ totalCharges: totalCost });
        }

    }
    displayPackageInclusions = () => {
        const packageInclusions = this.state.deal.details.itinerary.packageInclusions;
        if (this.state.deal) {
            return packageInclusions.map((pack, index) => (<li key={index}>{pack}</li>))
        }
        else {
            return null;
        }
    }
    displayPackageHighlights = () => {
        let packageHighLightsArray = [];
        let firstElement = (
            <div key={0} className="text-left" >
                <h5>Day 1</h5>
                {this.state.deal ? <div>{this.state.deal.details.itinerary.dayWiseDetails.firstDay}</div> : null}
            </div>
        );
        packageHighLightsArray.push(firstElement);
        if (this.state.deal) {
            this.state.deal.details.itinerary.dayWiseDetails.restDaysSightSeeing.map((packageHighlight, index) => {
                let element = (
                    <div key={index + 1} className="text-left">
                        <h5>Day {this.state.deal.details.itinerary.dayWiseDetails.restDaysSightSeeing.indexOf(packageHighlight) + 2}</h5>
                        <div>{packageHighlight}</div>
                    </div>
                );
                packageHighLightsArray.push(element)
                return null
            });
            let lastElement = (
                <div key={666} className="text-left">
                    <h5>Day {this.state.deal.details.itinerary.dayWiseDetails.restDaysSightSeeing.length + 2}</h5>
                    {this.state.deal.details.itinerary.dayWiseDetails.lastDay}
                    <div className="text-danger">
                        **This itinerary is just a suggestion, itinerary can be modified as per requirement. <a
                            href="#contact-us">Contact us</a> for more details.
                        </div>
                </div>
            );
            packageHighLightsArray.push(lastElement);
            return packageHighLightsArray;
        } else {
            return null;
        }
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({ show: true }, () => {
                this.calculateCharges();
            })
        }, 1500)
    }
    render() {

        if (this.state.showHome) {
            return <Redirect to="/home" />
        }
        return (

            <div>
                {
                    !this.state.show ?
                        <div id="details" className="details-section">
                            <div className="text-center">
                                <ProgressSpinner></ProgressSpinner>
                            </div>
                        </div> :

                        this.state.confirmBook ?
                            <div><br /><br />
                                <div className="col-md-10 offset-1 card bg-light text-dark book-card">
                                    <div className="card-body row">
                                        <div className="col-md-12">
                                            <h1>Booking Confirm!!!</h1>
                                            <h3 className="text-success">Congratulations! Trip to {this.state.deal.name}</h3>
                                            <h5>Trip starts on: {this.state.checkInDate}</h5>
                                            <h5>Trip ends on: {this.state.checkOutDate}</h5>
                                            <Link className="link" to='/viewBookings'>Click here to view your Bookings</Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            :
                            <div className="card bg-light text-dark book-card" >
                                <div className="card-body row">
                                    <div className="col-md-6 offset-1 text-justify">
                                        <br /><br />
                                        <h2 className="text-left" >{this.state.deal.name}</h2>
                                        <Fieldset legend="Overview" toggleable={true} collapsed={this.state.overview} onToggle={(e) => this.setState({ overview: e.value })}>
                                            {this.state.deal ? this.state.deal.details.about : null}
                                        </Fieldset>
                                        <Fieldset legend="Package Inclusions" toggleable={true} collapsed={this.state.packageinclusions} onToggle={(e) => this.setState({ packageinclusions: e.value })}>
                                            <ul>
                                                {this.displayPackageInclusions()}
                                            </ul>
                                        </Fieldset>
                                        <Fieldset legend="Itinerary" toggleable={true} collapsed={this.state.iteranary} onToggle={(e) => this.setState({ iteranary: e.value })}>
                                            {this.displayPackageHighlights()}
                                        </Fieldset>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="card bg-light">
                                            <div className="card-body">
                                                {/* <h4 className="itenaryAbout text-success text-left">**Charges per person: Rs. {this.state.deal.chargesPerPerson}</h4> */}
                                                <form onSubmit={this.handleSubmit} className="form text-left" >
                                                    <div className="form-group">
                                                        <label htmlFor="noOfPersons">Number of Travelers:</label>
                                                        <input
                                                            type="number"
                                                            id="noOfPersons"
                                                            className="form-control"
                                                            name="noOfPersons"
                                                            value={this.state.bookingForm.noOfPersons}
                                                            onChange={(e) => { this.handleChange(e) }}
                                                        />
                                                        {this.state.bookingFormErrorMessage.noOfPersons ?
                                                            <span className="text-danger">{this.state.bookingFormErrorMessage.noOfPersons}</span>
                                                            : null}
                                                    </div>
                                                    <div className="form-group">
                                                        <label htmlFor="date">Trip start Date:</label>
                                                        <input
                                                            type="date"
                                                            id="date"
                                                            className="form-control"
                                                            name="date"
                                                            value={this.state.bookingForm.date}
                                                            onChange={this.handleChange}
                                                        />
                                                        {this.state.bookingFormErrorMessage.date ?
                                                            <span className="text-danger">{this.state.bookingFormErrorMessage.date}</span>
                                                            : null}
                                                    </div>
                                                    <div className="form-group">
                                                        <label>Include Flights:</label>&nbsp;
                                                    <InputSwitch name="flights" id="flights"
                                                            checked={this.state.bookingForm.flights}
                                                            onChange={this.handleChange} />
                                                    </div>
                                                    {/* <div className="form-group">
                                            <button id="buttonCalc" className="btn btn-primary" type="submit" disabled={!this.state.bookingFormValid.buttonActive}>Calculate Charges</button>&nbsp;
                                        </div> */}
                                                    <div className="text-left">
                                                        <span>
                                                            Your trip ends on {this.state.checkOutDate}
                                                        </span>
                                                        <h4 >
                                                            You will pay ${this.state.totalCharges}
                                                        </h4>
                                                    </div>
                                                    < div className="text-center">
                                                        <button className="btn btn-success" type="submit" >Confirm Booking</button>
                                            &nbsp; &nbsp; &nbsp;
                                            <button type="button" className="btn btn-danger" onClick={() => this.setState({ showHome: true })} >Cancel</button>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                }
            </div >
        )
    }
}

export default Book
