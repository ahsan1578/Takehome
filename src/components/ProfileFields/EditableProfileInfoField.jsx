import React from "react";
import { TextField, Button } from "@mui/material";
import { IconButton } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import "./EditableProfileInfoField.scss"

/**
 * This component builds the UI of the profile fields that can be edited
 * Receives the following props:
            fieldName: name of the profile field (e.g. Full name)
            fieldText: value of the profile field (e.g. John Doe)
            verifier: a function to validate the format of the input
            inputDirection: any direction for users on how the input should be formatted
 * That state object contains the following properties:
            isEditing: boolean indicating whether the user is editing the field, default false
            fieldValue: refer to prop fieldText
            tempFieldValue: a temp holder for the input value when the user is editing, default the current fieldValue
            fieldName: refer to prop fieldName,
            verifier: refer to prop verifier,
            inputDirection: refer to prop inputDirection
 */
class EditableProfileInfoField extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isEditing: false,
            fieldValue: this.props.fieldText,
            tempFieldValue: this.props.fieldText,
            fieldName: this.props.fieldName,
            verifier: this.props.verifier,
            inputDirection: this.props.inputDirection
        }
    }

    /**
     * Set the editing mode by setting the isEditing in the state to true
     */
    handleEditClicked = () => {
        this.setState({
            isEditing: true
        })
    }


    /**
     * Saves the tempValue in the state's fieldValue
     * Stops the editing mode by setting the isEditing in the state to false
     */
    handleInfoSave = () => {
        this.setState({
            isEditing: false,
            fieldValue: this.state.tempFieldValue
        })
    }


    /**
     * Sets the tempFieldValue to the input value
     * @param {Object} ev triggered event 
     */
    handleEditInput = (ev) => {
        this.setState({
            tempFieldValue: ev.target.value.trim()
        })
    }


    /**
     * Resets the tempFieldValue to the current fieldValue (temp value is thus not saved)
     * Stops the editing mode by setting the isEditing in the state to false
     */
    handleCancel = () => {
        this.setState({
            isEditing: false,
            tempFieldValue: this.state.fieldValue
        })
    }


    /**
     * the DOM element for the profile field
     * @returns the DOM element
     */
    render() {
        return (
            <div className="userInfoField">
                <div className="userInfoFieldName">
                    {this.state.fieldName}
                </div>
                {
                    this.state.isEditing ?
                        <div className="userInfoEdit">
                            <TextField
                                error={!this.state.verifier(this.state.tempFieldValue)}
                                label={this.state.fieldName}
                                defaultValue={this.state.tempFieldValue}
                                variant="outlined"
                                onChange={this.handleEditInput}
                                helperText={this.state.inputDirection}
                                className="inputBox"
                                size="small"
                            />
                            <div className="saveCancelButtons">
                                <Button variant="outlined"
                                    onClick={this.handleInfoSave}
                                    disabled={!this.state.verifier(this.state.tempFieldValue)}
                                    className="userInfoUpdateButton">
                                    Update
                                </Button>
                                <Button
                                    variant="outlined"
                                    onClick={this.handleCancel}
                                    color="secondary"
                                    className="userInfoCancelButton"
                                    sx={{ ml: 1 }}>
                                    Cancel
                                </Button>
                            </div>

                        </div> :
                        <div className="userInfoSet">
                            {
                                this.state.fieldName === "Phone Number" ?
                                    `(${this.state.fieldValue.substring(0, 3)})` +
                                    ` ${this.state.fieldValue.substring(3, 6)}` +
                                    `-${this.state.fieldValue.substring(6)}` :
                                    this.state.fieldValue
                            }
                            <IconButton onClick={this.handleEditClicked}>
                                <EditIcon />
                            </IconButton>
                        </div>
                }
            </div>
        )
    }
}

export default EditableProfileInfoField