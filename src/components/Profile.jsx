import React from "react";
import axios from "axios";
import { Paper } from "@mui/material";
import EditableProfileInfoField from "./EditableProfileInfoField.jsx";
import NonEditableProfileInfoField from "./NonEditableProfileInfo.jsx";
import "./Profile.scss"

class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null
        }
    }

    componentDidMount = () => {
        let name = this.props.match.params.name
        let date = this.props.match.params.date
        this.fetchFilteredUsers(name, date);
    }

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


    validateEmailInput = (input) => {
        let email_reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        return input.match(email_reg);
    }

    validatePhoneSSNInput = (input, size) => {
        let reg = /^[0-9]*$/
        return (input.match(reg) && input.length === size)
    }


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
                        <EditableProfileInfoField fieldText={this.state.user.name} fieldName="Name" verifier={input => input.trim().split(" ").length < 2 ? false : true} inputDirection="Input full name, must contain both first name and last name" />
                        <EditableProfileInfoField fieldText={this.state.user.email} fieldName="Email" verifier={this.validateEmailInput} inputDirection="Input a valid email address, example 'user@email.com'" />
                        <EditableProfileInfoField fieldText={this.state.user.phone} fieldName="Phone Number" verifier={input => this.validatePhoneSSNInput(input, 10)} inputDirection="Input a ten-digit phone number without the country code (digit only, no spaces or special character)" />
                        <EditableProfileInfoField fieldText={this.state.user.ssn} fieldName="SSN" verifier={input => this.validatePhoneSSNInput(input, 9)} inputDirection="Input a nine-digit SSN (digit only, no spaces or special character)" />
                        <NonEditableProfileInfoField fieldText={this.state.user.footprintToken} fieldName="Footprint Token" />
                        <NonEditableProfileInfoField fieldText={this.state.user.status} fieldName="Status" />
                        <NonEditableProfileInfoField fieldText={this.state.user.createdAt} fieldName="Registration Date" />
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