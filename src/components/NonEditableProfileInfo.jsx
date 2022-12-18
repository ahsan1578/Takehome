import React from "react";
import { TextField, Button } from "@mui/material";
import { IconButton } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import "./EditableProfileInfoField.scss"
import "./NonEditableProfileInfo.scss"

class NonEditableProfileInfoField extends React.Component {
    constructor(props) {
        super(props);
        console.log(props);
        this.state = {
            fieldValue: this.props.fieldText,
            fieldName: this.props.fieldName,
            tooltipText: "Copy to clipboard"
        }
    }

    copyUserToken = (ev) => {
        ev.preventDefault();
        navigator.clipboard.writeText(ev.target.firstChild.textContent);
        this.setState({
            tooltipText: "Copied!"
        })
    }

    resetCopyState = () => {
        this.setState({
            tooltipText: "Copy to clipboard"
        })
    }

    getDom = () => {
        if (this.state.fieldName === "Footprint Token") {
            return (
                <div id="userToken">
                    <div id='userTokenText' className="userInfoSet" onClick={this.copyUserToken} onMouseLeave={this.resetCopyState}>
                        {this.state.fieldValue}
                        <span id="copytooltiptext">{this.state.tooltipText}</span>
                    </div>
                </div>
            )
        }

        if (this.state.fieldName === "Status") {
            let statusStyle = {
                color: "#991008",
                background: "#FFF2F0",
                borderRadius: "100px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                maxWidth: "100%",
                width: "fit-content",
                padding: "4px 8px 4px 8px"
            }

            if (this.state.fieldValue[0] === "V") {
                statusStyle.color = "#0A6A4A";
                statusStyle.background = "#E9F5F1";
            }

            return (
                <div className='userStatusSpan' style={statusStyle}>
                    {this.state.fieldValue}
                </div>
            )
        }

        return (
            <div className="userInfoSet">
                {this.state.fieldValue}
            </div>
        )
    }

    render() {
        return (
            <div className="userInfoField">
                <div className="userInfoFieldName">
                    {this.state.fieldName}
                </div>
                {this.getDom()}
            </div>
        )
    }
}

export default NonEditableProfileInfoField