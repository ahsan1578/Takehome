import React from "react";
import "./EditableProfileInfoField.scss"
import "./NonEditableProfileInfo.scss"


/**
 * This component builds the UI of the profile fields that cannot be edited
 * Receives the following props:
            fieldName: name of the profile field (e.g. Full name)
            fieldText: value of the profile field (e.g. John Doe)
 * That state object contains the following properties:
            fieldValue: refer to prop fieldText
            fieldName: refer to prop fieldName,
            tooltipText: The string to show on tooltip when mouse pointer hovers on Footprint Token.
                            Can be "Copy to clipboard" or "Copied" depending on whether the token is copied.
 */
class NonEditableProfileInfoField extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fieldValue: this.props.fieldText,
            fieldName: this.props.fieldName,
            tooltipText: "Copy to clipboard"
        }
    }

    /**
     * Copies the Footprint Token to the clipboard when the user clicks on the token
     * Changes the tooltipText to "Copied"
     * @param {Object} ev triggered event 
     */
    copyUserToken = (ev) => {
        ev.preventDefault();
        navigator.clipboard.writeText(ev.target.firstChild.textContent);
        this.setState({
            tooltipText: "Copied!"
        })
    }


    /**
     * Resets the tooltipText to "Copy to clipboard"
     */
    resetCopyState = () => {
        this.setState({
            tooltipText: "Copy to clipboard"
        })
    }



    /**
     * Creates the DOM element for profile field value (doesn't include the field name)
     * Formats the fieldValue (from the state) to appropriate string format
     * If the fieldName is "Status", assigns the appropriate style to the fieldValue
     *           (green background for "Verified", red background for "Failed")
     * @returns DOM element for profile field value
     */
    getDom = () => {
        if (this.state.fieldName === "Footprint Token") {
            return (
                <div id="userToken">
                    <div id='userTokenText'
                        className="userInfoSet"
                        onClick={this.copyUserToken}
                        onMouseLeave={this.resetCopyState}>
                        {this.state.fieldValue}
                        <span id="copytooltiptext">
                            {this.state.tooltipText}
                        </span>
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


    /**
     * Renders the profile field DOM with the field name and field value
     * @returns the profile field DOM
     */
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