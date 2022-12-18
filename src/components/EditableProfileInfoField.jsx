import React from "react";
import { TextField, Button } from "@mui/material";
import { IconButton } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import "./EditableProfileInfoField.scss"

class EditableProfileInfoField extends React.Component {
    constructor(props) {
        super(props);
        console.log(props);
        this.state = {
            isEditing: false,
            fieldValue: this.props.fieldText,
            tempFieldValue: this.props.fieldText,
            fieldName: this.props.fieldName,
            verifier: this.props.verifier,
            inputDirection: this.props.inputDirection
        }
    }


    handleEditClicked = () => {
        this.setState({
            isEditing: true
        })
        console.log("Clicked")
    }


    handleInfoSave = () => {
        this.setState({
            isEditing: false,
            fieldValue: this.state.tempFieldValue
        })
    }


    handleEditInput = (ev) => {
        this.setState({
            tempFieldValue: ev.target.value.trim()
        })
    }

    handleCancel = () => {
        this.setState({
            isEditing: false,
            tempFieldValue: this.state.fieldValue
        })
    }


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
                                <Button variant="outlined" onClick={this.handleInfoSave} disabled={!this.state.verifier(this.state.tempFieldValue)} className="userInfoUpdateButton">Update</Button>
                                <Button variant="outlined" onClick={this.handleCancel} color="secondary" className="userInfoCancelButton" sx={{ ml: 1 }}>Cancel</Button>
                            </div>

                        </div> :
                        <div className="userInfoSet">
                            {
                                this.state.fieldName === "Phone Number" ?
                                    `(${this.state.fieldValue.substring(0, 3)}) ${this.state.fieldValue.substring(3, 6)}-${this.state.fieldValue.substring(6)}` :
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