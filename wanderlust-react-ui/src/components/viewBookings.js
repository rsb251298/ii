import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { backendUrlBooking } from '../BackendURL'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { Messages } from 'primereact/messages'
import { ProgressSpinner } from 'primereact/progressspinner'
// import { Message } from 'primereact/message'

export class ViewBookings extends Component {
    constructor(props) {
        super(props)
        this.showInfo = this.showInfo.bind(this);
        this.state = {
            logged_userId: sessionStorage.getItem('userId'),
            bookings: [],
            errorMessage: "",
            dialog_visible: false,
            can_booking: "",
            unable: false,
            checkInDate: "",
            checkOutDate: "",
            successMsg: "",
            show: false
        }
    }

    confirm_cancel = (booking) => {
        let checkInDate = new Date(booking.checkInDate).toDateString();
        let checkOutDate = new Date(booking.checkOutDate).toDateString();
        this.setState({
            dialog_visible: true,
            checkInDate: checkInDate,
            checkOutDate: checkOutDate,
            can_booking: booking
        });
    }
    showBookings = () => {
        if (!this.state.errorMessage) {
            let bookingsArray = []
            let bookings = this.state.bookings
            if (bookings && bookings.length > 0) {
                for (let booking of bookings) {
                    let checkInDate = new Date(booking.checkInDate).toDateString();
                    let checkOutDate = new Date(booking.checkOutDate).toDateString();
                    let element = (
                        <div key={booking.bookingId}>
                            <br /><br />
                            <div className="col-md-8 offset-2 card bg-light text-left">
                                <div className="card-header">Booking ID: {booking.bookingId}</div>
                                <div className="row card-body">
                                    <div className="col-md-8">
                                        <h4>{booking.destinationName}</h4>
                                        <h6>Trip starts on: {checkInDate}</h6>
                                        <h6>Trip ends on: {checkOutDate}</h6>
                                        <h6>Travellers: {booking.noOfPersons}</h6>
                                    </div>
                                    <div>
                                        <br />
                                        <h6>Fare Details</h6>
                                        <h6>${booking.totalCharges}</h6>
                                        <button className="btn btn-sm btn-warning" type="button" onClick={() => this.confirm_cancel(booking)} >Claim Refund</button>
                                    </div>
                                </div>
                                <div className="card-footer"></div>
                            </div>
                        </div>
                    )
                    bookingsArray.push(element)
                }
                return bookingsArray
            }
        }
    }
    getBookings = () => {
        axios.get(backendUrlBooking + "/getBookings/" + this.state.logged_userId).then((bookings) => {
            this.setState({ bookings: bookings.data, show: false })
        }).catch((error) => {
            this.setState({ errorMessage: error.message, bookings: null })
        })
    }
    componentDidMount() {
        this.setState({ show: true }, () => {
            setTimeout(() => { this.getBookings(); }, 1500)
        })
    }
    onHide = (event) => {
        this.setState({ dialog_visible: false });
    }
    showInfo() {
        this.messages.show({ severity: 'info', summary: this.state.successMsg });
        setTimeout(() => window.location.reload(), 1200);
    }
    cancel_booking = (bookingId) => {
        axios.delete(backendUrlBooking + "/cancelBooking/" + bookingId).then((res) => {
            this.setState({ dialog_visible: false, successMsg: res.data.message }, () => {
                this.showInfo()
            });
        }).catch((error) => {
            this.setState({ unable: true })
        })
    }

    render() {
        const footer = (
            <div>
                <Button label="BACK" onClick={this.onHide} className="p-button-raised" />
                <Button label="CONFIRM CANCELATION" onClick={() => { this.cancel_booking(this.state.can_booking.bookingId) }} className="p-button-danger p-button-raised" />
            </div>
        );
        return (
            <div>
                <Messages className="p-messages" ref={(el) => this.messages = el}></Messages>
                {
                    this.state.show ?
                        <div id="details" className="details-section">
                            <div className="text-center">
                                <ProgressSpinner></ProgressSpinner>
                            </div>
                        </div> :

                        this.state.logged_userId ?
                            <div>
                                {this.showBookings()}
                                {
                                    this.state.errorMessage ?
                                        (
                                            <div><br />
                                                <div className="card bg-light text-dark package-card">
                                                    <div className="card-body text-left">
                                                        <div className="offset-2">
                                                            <h2>Sorry you have not planned any trips with us!</h2><br />
                                                            <a href="/" className="btn btn-success">CLICK HERE TO START BOOKING</a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : null
                                }
                            </div>
                            :
                            <div>
                                <br /><br />
                                <div className="col-md-10 offset-1 card bg-light text-dark book-card">
                                    <div className="card-body row">
                                        <div className="col-md-6 offset-3">
                                            <h4><Link to="/login">Please login to see your Booking!</Link></h4>
                                        </div>
                                    </div>
                                </div>
                            </div>
                }
                <div className="content-section implementation text-left">
                    <Dialog
                        header="Confirm Cancelation"
                        visible={this.state.dialog_visible}
                        style={{ width: '50vw' }}
                        footer={footer}
                        onHide={this.onHide}
                        maximizable
                    >
                        <h6>Are you sure you want to cancel your trip to {this.state.can_booking.destinationName}?</h6>
                        <h6>Trip start Date: {this.state.checkInDate}</h6>
                        <h6>Trip ends Date: {this.state.checkOutDate}</h6>
                        <h6 className="text-warning">Refund Amount: ${this.state.can_booking.totalCharges}</h6>
                    </Dialog>
                </div>
            </div>

        )
    }
}

export default ViewBookings;
