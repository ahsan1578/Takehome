import React from "react";
import axios from "axios";
import { Paper } from "@mui/material";
import EditableProfileInfoField from "../ProfileFields/EditableProfileInfoField.jsx";
import NonEditableProfileInfoField from "../ProfileFields/NonEditableProfileInfo.jsx";
import "./Profile.scss"


/**
 * This component renders the UI of the simple profile page
 * The component doesn't receive any props except for the react router props
 * The user's full name and registration time is embedded in the URL
 * Corrsponding user is found using the name and registration date
 * 
 * The state contains only one object with the user object (initially null)
            The user object is of the same type as the user objects returned by API calls
 */
class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null
        }
    }

    /**
     * Lifecycle method called when the component is first mounted
     * Gets the user name and registration date from URL route params
     * Calls the "fetchFilteredUsers" to fetch the user
     */
    componentDidMount = () => {
        let name = this.props.match.params.name
        let date = this.props.match.params.date
        this.fetchFilteredUsers(name, date);
    }


    /**
     * Using the user's name fetches all the user with the name
     * From all of the users, finds the one registered in the date provided as argument
     * Parses the user object values and format in appropriate string format
     * Creates a new user object with the same keys from the original API-returned user objects,
     *      but with the formatted values
     * Sets assing the new user object to the "user" key of the state
     * @param {string} searchTerm the serach term for API call, essentially the user's full name
     * @param {string} date in string format  "YYYY-MM-DDTHH:mm:ss.sssZ"
     */
    fetchFilteredUsers = (searchTerm, date) => {
        let fetchPromise = axios(`https://footprint-cc.preview.onefootprint.com/api/users?search=${searchTerm}`);
        fetchPromise.then(usersData => {
            let users = usersData.data;
            let targetUser = null;

            for (let usr of users) {
                if (usr.createdAt === date) {
                    targetUser = usr;
                    break;
                }
            }

            if (targetUser === null) {
                this.setState({
                    user: "notFoundError"
                })
            } else {
                let registraionDate = new Date(targetUser.createdAt);
                let registraionDateString = registraionDate.toLocaleDateString();
                let registraionTimeString = registraionDate.toLocaleTimeString();
                let hh_mm_ss = registraionTimeString.split(":");
                let regTimeStringFormatted = `${hh_mm_ss[0]}:${hh_mm_ss[1]}${hh_mm_ss[2].split(" ")[1].toLowerCase()}`
                targetUser.createdAt = `${registraionDateString}, ${regTimeStringFormatted}`


                let phoneNo = targetUser.phone.split("-");
                targetUser.phone = `${phoneNo[1]}${phoneNo[2]}${phoneNo[3]}`

                let ssn = targetUser.ssn;
                targetUser.ssn = ssn.split("-").join("");

                let status = targetUser.status;
                targetUser.status = status[0].toUpperCase() + status.substring(1);

                this.setState({
                    user: targetUser
                })
            }
        }, error => {
            console.log(error);
            this.setState({
                user: "netError"
            })
        })
    }


    /**
     * Validates if the email has the right format
     * @param {string} input the email
     * @returns true if validated, false otherwise
     */
    validateEmailInput = (input) => {
        let email_reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        return input.match(email_reg);
    }


    /**
     * Validates if the phone no or the SSN has the right format
     * @param {string} input the phone no or SSN
     * @param {Number} size the expected length of the string (for phone no: 10, for SSN: 9)
     * @returns true if validated, false otherwise
     */
    validatePhoneSSNInput = (input, size) => {
        let reg = /^[0-9]*$/
        return (input.match(reg) && input.length === size)
    }


    /**
     * Renders the DOM for the profile page
     * Uses two types of components EditableProfileInfoField, NonEditableProfileInfoField
     * EditableProfileInfoField corresponds to the fields that can be edited: name, email, phone no, SSN
     * NonEditableProfileInfoField corresponds to the fields that cannot be edited (machine generated): 
     *              Footprint token, status, created at time
     * @returns the DOM for the profile page
     */
    getProfileDom = () => {
        if (!this.state.user) {
            return "Please wait while we fetch the user's info for you . . ."
        } else if (this.state.user === "netError") {
            return "Something went wrong! This is on us. Please try again later."
        } else if (this.state.user === "notFoundError") {
            return "Sorry, couldn't find the user you are looking for!"
        } else {
            return (
                <Paper elevation={2} id="profileContainer">
                    <div id="profileInfo">
                        <EditableProfileInfoField
                            fieldText={this.state.user.name}
                            fieldName="Name"
                            verifier={input => input.trim().split(" ").length < 2 ? false : true}
                            inputDirection="Input full name, must contain both first name and last name"
                        />
                        <EditableProfileInfoField
                            fieldText={this.state.user.email}
                            fieldName="Email"
                            verifier={this.validateEmailInput}
                            inputDirection="Input a valid email address, example 'user@email.com'"
                        />
                        <EditableProfileInfoField
                            fieldText={this.state.user.phone}
                            fieldName="Phone Number"
                            verifier={input => this.validatePhoneSSNInput(input, 10)}
                            inputDirection="Input a ten-digit phone number without the country code (digit only, no spaces or special character)" />
                        <EditableProfileInfoField
                            fieldText={this.state.user.ssn}
                            fieldName="SSN" verifier={input => this.validatePhoneSSNInput(input, 9)}
                            inputDirection="Input a nine-digit SSN (digit only, no spaces or special character)"
                        />
                        <NonEditableProfileInfoField
                            fieldText={this.state.user.footprintToken}
                            fieldName="Footprint Token"
                        />
                        <NonEditableProfileInfoField
                            fieldText={this.state.user.status}
                            fieldName="Status"
                        />
                        <NonEditableProfileInfoField
                            fieldText={this.state.user.createdAt}
                            fieldName="Registration Date"
                        />
                    </div>
                </Paper>
            )
        }
    }

    render() {
        return (
            <div>
                {this.getProfileDom()}
            </div>
        )
    }
}

export default Profile;