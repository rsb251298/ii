import React, { Component } from 'react'
import { backendUrlUser } from '../BackendURL';
import axios from "axios";
import { Redirect, Link } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';

class Register extends Component {
    constructor(props) {
        super(props)

        this.state = {
            regform: {
                name: "",
                emailId: "",
                contactNo: "",
                password: ""
            },
            regformErrorMessage: {
                name: "",
                emailId: "",
                contactNo: "",
                password: ""
            },
            regformValid: {
                name: false,
                emailId: false,
                contactNo: false,
                password: false,
                buttonActive: false
            },
            successMessage: "",
            errorMessage: "",
            loadLogin: false
        }
    }

    validateField = (fieldName, value) => {
        // ^[a-zA-Z][a-zA-Z ]+[a-zA-Z]$
        let fieldValidationErrors = this.state.regformErrorMessage;
        let formValid = this.state.regformValid;
        switch (fieldName) {
            case "name":
                let nameregex = /^[a-zA-Z][a-zA-Z ]+[a-zA-Z]$/
                if (!value || value === "") {
                    fieldValidationErrors.name = "Please enter your Name"
                    formValid.name = false
                } else if (!value.match(nameregex)) {
                    fieldValidationErrors.name = "Please enter a valid Name"
                    formValid.name = false
                } else {
                    fieldValidationErrors.name = ""
                    formValid.name = true
                }
                break;
            case "emailId":
                let eIdregex = /^[a-z]+[@][a-z]+\.[com]+$/
                if (!value || value === "") {
                    fieldValidationErrors.emailId = "Please enter your EmailId"
                    formValid.emailId = false
                } else if (!value.match(eIdregex)) {
                    fieldValidationErrors.emailId = "Please enter a valid Emailid"
                    formValid.emailId = false
                } else {
                    fieldValidationErrors.emailId = ""
                    formValid.emailId = true
                }
                break;
            case "contactNo":
                let cnoRegex = /^[1-9]\d{9}$/
                if (!value || value === "") {
                    fieldValidationErrors.contactNo = "Please enter your contact Number";
                    formValid.contactNo = false;
                } else if (!value.match(cnoRegex)) {
                    fieldValidationErrors.contactNo = "Contact number should be a valid 10 digit number";
                    formValid.contactNo = false;
                } else {
                    fieldValidationErrors.contactNo = "";
                    formValid.contactNo = true;
                }
                break;
            case "password":
                let passregex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.*\s).{7,20}$/
                if (!value || value === "") {
                    fieldValidationErrors.password = "Password is manadatory";
                    formValid.password = false;
                } else if (!value.match(passregex)) {
                    fieldValidationErrors.password = "Please Enter a valid password"
                    formValid.password = false;
                } else {
                    fieldValidationErrors.password = "";
                    formValid.password = true;
                }
                break;
            default:
                break;
        }
        formValid.buttonActive = formValid.contactNo && formValid.password;
        this.setState({
            regformErrorMessage: fieldValidationErrors,
            regformValid: formValid,
            successMessage: ""
        });
    }
    handleChange = (event) => {
        let name = event.target.name;
        let value = event.target.value;
        let { regform } = this.state
        this.setState({
            regform: { ...regform, [name]: value }
        });
        this.validateField(name, value);
    }


    handleSubmit = (event) => {
        event.preventDefault();
        this.register()
    }

    register = () => {
        let { regform } = this.state
        axios.post(backendUrlUser + '/register', regform).then((res) => {
            this.setState({
                successMessage: "Successfully Registered!"
            })
        }).catch((err) => {
            if (err.response) {
                this.setState({
                    errorMessage: err.response.data.message
                })
            } else {
                this.setState({
                    errorMessage: err.message
                })
            }
        })

    }


    handleClick = () => {

    }
    render() {
        if (this.state.loadLogin === true) return <Redirect to={'/login'} />
        if (this.state.successMessage) {
            return (
                <section id="registerPage" className="registerSection">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-md-4 offset-4">
                                <div className="card bg-warning">
                                    <div className="card-body">
                                        <h4>{this.state.successMessage}</h4>
                                        <h3><Link to="/login">Click here to Login</Link></h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )
        }
        return (
            <div>
                <section id="registerPage" className="registerSection">    {/* *ngIf="!registerPage"  */}
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-md-4 offset-4 ">
                                <div className="card bg-card ">
                                    <div className="card-body text-left">
                                        <h1 className="text-danger" >Join Us</h1>
                                        <form className="form" onSubmit={this.handleSubmit} >
                                            <div className="form-group">
                                                <label htmlFor="name">Name<span className="text-danger">*</span></label>
                                                <InputText value={this.state.regform.name} onChange={this.handleChange} className="form-control" name="name" id="name" type="text" />
                                            </div>
                                            {this.state.regformErrorMessage.name ? (<span className="text-danger">
                                                {this.state.regformErrorMessage.name}
                                            </span>)
                                                : null}
                                            <div className="form-group">
                                                <label htmlFor="emailId">Email Id<span className="text-danger">*</span></label>
                                                <InputText value={this.state.regform.emailId} onChange={this.handleChange} className="form-control" name="emailId" id="emailId" type="email" />
                                            </div>
                                            {this.state.regformErrorMessage.emailId ? (<span className="text-danger">
                                                {this.state.regformErrorMessage.emailId}
                                            </span>)
                                                : null}
                                            <div className="form-group">
                                                <label htmlFor="contactNo">Contact Number<span className="text-danger">*</span></label>
                                                <InputText value={this.state.regform.contactNo} onChange={this.handleChange} className="form-control" name="contactNo" id="contactNo" type="number" />
                                            </div>
                                            {this.state.regformErrorMessage.contactNo ? (<span className="text-danger">
                                                {this.state.regformErrorMessage.contactNo}
                                            </span>)
                                                : null}
                                            <div className="form-group">
                                                <label htmlFor="password">Password<span className="text-danger">*</span></label>
                                                <InputText value={this.state.regform.password} onChange={this.handleChange} className="form-control" name="password" id="password" type="password" />
                                            </div>
                                            {this.state.regformErrorMessage.password ? (<span className="text-danger">
                                                {this.state.regformErrorMessage.password}
                                            </span>)
                                                : null}<br />
                                            <span><span className="text-danger">*</span> marked feilds are mandatory</span><br />
                                            <Button label="Register" className="p-button-raised p-button-rounded btn-block" type="submit" disabled={!this.state.regformValid.buttonActive} />
                                            {this.state.errorMessage ? (<span className="text-danger">
                                                {this.state.errorMessage}
                                            </span>)
                                                : null}
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        )
    }
}

export default Register;
