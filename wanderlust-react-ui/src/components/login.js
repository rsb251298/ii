import React, { Component } from "react";
import axios from "axios";
import { Redirect } from 'react-router-dom';
import { backendUrlUser } from '../BackendURL';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loginform: {
                contactNo: "",
                password: ""
            },
            loginformErrorMessage: {
                contactNo: "",
                password: ""
            },
            loginformValid: {
                contactNo: false,
                password: false,
                buttonActive: false
            },
            successMessage: "",
            errorMessage: "",
            loadHome: false,
            loadRegister: false,
            userId: ""
        }
    }

    handleClick = () => {
        this.setState({ loadRegister: true })
    }

    handleChange = (event) => {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        const { loginform } = this.state;
        this.setState({
            loginform: { ...loginform, [name]: value }
        });
        this.validateField(name, value);
        // console.log(this.state.loginform[name], name);
    }

    login = () => {
        const { loginform } = this.state;
        axios.post(backendUrlUser + '/login', loginform)
            .then(response => {
                console.log(response);
                let userId = response.data.userId;
                sessionStorage.setItem("contactNo", response.data.contactNo);
                sessionStorage.setItem("userId", userId);
                sessionStorage.setItem("userName", response.data.name);;
                this.setState({ loadHome: true, userId: userId }, () => {
                    window.location.reload();
                })

            }).catch(error => {
                console.log(error);
                if (error.response) {
                    this.setState({
                        errorMessage: error.response.data.message
                    })
                } else {
                    this.setState({
                        errorMessage: error.message
                    })
                }
                sessionStorage.clear();
            })
        // console.log(this.state.loginform.contactNo, this.state.loginform.password);
    }

    handleSubmit = (event) => {
        event.preventDefault();
        this.login();
    }

    validateField = (fieldName, value) => {
        let fieldValidationErrors = this.state.loginformErrorMessage;
        let formValid = this.state.loginformValid;
        switch (fieldName) {
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
            loginformErrorMessage: fieldValidationErrors,
            loginformValid: formValid,
            successMessage: ""
        });
    }

    render() {
        if (this.state.loadHome === true) return <Redirect to={'/home/' + this.state.userId} />
        if (this.state.loadRegister === true) return <Redirect to={'/register'} />
        return (
            <div>
                <section id="loginPage" className="loginSection">    {/* *ngIf="!registerPage"  */}
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-md-4 offset-4 ">
                                <div className="card bg-card ">
                                    <div className="card-body text-left">
                                        <h1 className="text-success" >Login</h1>
                                        <form className="form" onSubmit={this.handleSubmit}> {/* [formGroup]="loginForm" (ngSubmit)="login()" */}
                                            <div className="form-group">
                                                <label htmlFor="uContactNo">Contact Number<span className="text-danger">*</span></label>
                                                <InputText
                                                    type="number"
                                                    value={this.state.loginform.contactNo}
                                                    onChange={this.handleChange}
                                                    id="uContactNo"
                                                    name="contactNo"
                                                    className="form-control"
                                                />
                                            </div>
                                            {this.state.loginformErrorMessage.contactNo ? (<span className="text-danger">
                                                {this.state.loginformErrorMessage.contactNo}
                                            </span>)
                                                : null}

                                            <div className="form-group">
                                                <label htmlFor="uPass">Password<span className="text-danger">*</span></label>
                                                <InputText
                                                    type="password"
                                                    value={this.state.loginform.password}
                                                    onChange={this.handleChange}
                                                    id="uPass"
                                                    name="password"
                                                    className="form-control"
                                                />
                                            </div>
                                            {this.state.loginformErrorMessage.password ? (<span className="text-danger">
                                                {this.state.loginformErrorMessage.password}
                                            </span>)
                                                : null}<br />
                                            <span><span className="text-danger">*</span> marked feilds are mandatory</span>
                                            <br />
                                            <div className="form-group">
                                                <div className="text-danger">
                                                    <h6>{this.state.errorMessage}</h6>
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <Button type="submit" label="Login" disabled={!this.state.loginformValid.buttonActive} className="p-button-raised p-button-rounded" />
                                                &nbsp;
                                                {/* <!--can be a button or a link based on need --> */}
                                                <Button type="button" label="Click here to Register" className="p-button-raised p-button-rounded" onClick={this.handleClick} />
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                {/* <div * ngIf= "!registerPage" >
            <router-outlet></router-outlet>
            </div > */}
                {/* *ngIf="!registerPage" */}
                {/* </div > */}
            </div>

        )
    }
}

export default Login;