import React from 'react';
import "./Table.scss"
import { Link } from 'react-router-dom';


/**
 * Given a list of users, this component constructs the UI of the list of users using DOM Table
 * This component takes the list of users as prop
 * Each entry in the list of users have the same format as the user entries received from the server
 * 
 * That state object contains the following properties:
 *      tooltipText: The string to show on tooltip when mouse pointer hovers on Footprint Token.
                            Can be "Copy to clipboard" or "Copied" depending on whether the token is copied.
        leftCol: The DOM element corresponding to the left column header when the mouse pointer is
                            on the divider between two column headers (used for column resizing),
                            default null.
        rightCol: The DOM element corresponding to the right column header when the mouse pointer is
                            on the divider between two column headers (used for column resizing),
                            default null.
        pageX: The pixel coordinate of the mouse pointer when the mouse pointer is on the divider 
                            between two column headers (used for column resizing),
                            default 0.
        leftColWidth: The width the leftCol (used for column resizing), default 0.
        rightColWidth: The width the rightCol (used for column resizing), default 0.
        isResizing: boolean value indicating whether the columns are currently being resized or not, default false.
        currDivider: The DOM element corresponding to divider div between leftCol and rightCol
                            that the mouse pointer is on (used for column resizing), default null.
 */
class Table extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            tooltipText: "Copy to clipboard",
            leftCol: null,
            rightCol: null,
            pageX: 0,
            leftColWidth: 0,
            rightColWidth: 0,
            isResizing: false,
            currDivider: null
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
     * Creates the DOM elements for rows of the user table
     * Formats the properties of the user object to appropriate string format
     * Assigns the appropriate style to the "Status" field (green background for "Verified", red background for "Failed")
     * @returns DOM elements for rows of the user table
     */
    getTableRows = () => {
        return this.props.users.map((user, index) => {
            let registraionDate = new Date(user.createdAt);
            let registraionDateString = registraionDate.toLocaleDateString();
            let registraionTimeString = registraionDate.toLocaleTimeString();
            let hh_mm_ss = registraionTimeString.split(":");
            let regTimeStringFormatted = `${hh_mm_ss[0]}:${hh_mm_ss[1]}${hh_mm_ss[2].split(" ")[1].toLowerCase()}`

            let status = user.status;
            status = status[0].toUpperCase() + status.substring(1);

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

            if (status[0] === "V") {
                statusStyle.color = "#0A6A4A";
                statusStyle.background = "#E9F5F1";
            }

            let ssn = user.ssn;
            ssn = ssn.split("-").join("");

            let phoneNo = user.phone.split("-");
            let phone = `(${phoneNo[1]}) ${phoneNo[2]}-${phoneNo[3]}`

            return (
                <tr className='tableDataRow' key={index}>
                    <td className='userFN' >
                        <Link
                            to={`/user/${user.name}/${user.createdAt}`}
                            style={{ textDecoration: 'none', color: "black" }}>
                            {user.name}
                        </Link>
                    </td>
                    <td className='userToken'>
                        <div
                            className='userTokenText'
                            onClick={this.copyUserToken}
                            onMouseLeave={this.resetCopyState}>
                            {user.footprintToken}
                            <span className="copytooltiptext">{this.state.tooltipText}</span>
                        </div>
                    </td>
                    <td className='userStatus'>
                        <div className='userStatusSpan' style={statusStyle}>
                            {status}
                        </div>
                    </td>
                    <td className='userEmail'>
                        {user.email}
                    </td>
                    <td className='userSSN'>
                        {ssn}
                    </td>
                    <td className='userPhoneNo'>
                        {phone}
                    </td>
                    <td className='userDate'>
                        {`${registraionDateString}, ${regTimeStringFormatted}`}
                    </td>
                </tr>
            )
        })
    }


    /**
     * Sets the values to leftCol, rightCol, leftColWidth, rightColWidth, currDivider, pageX in the state
     * Sets the "isResizing" state to true
     * Triggered when mouse is pressed on the divider div between two column headers
     * @param {Object} ev triggered event
     */
    handleColResizeMouseDown = (ev) => {
        if (this.state.isResizing) return;
        let leftCol = ev.target.parentElement;
        let rightCol = leftCol.nextElementSibling;
        let lColWidth = leftCol.offsetWidth;
        let rColWidth = rightCol ? rightCol.offsetWidth : 0
        let pageX = ev.pageX;
        ev.target.style.background = "rgba(96, 94, 94, 1)"
        this.setState({
            leftCol: leftCol,
            rightCol: rightCol,
            pageX: pageX,
            leftColWidth: lColWidth,
            rightColWidth: rColWidth,
            isResizing: true,
            currDivider: ev.target
        })
    }

    /**
     * Handles the logic for column resizing
     * Triggered when the divider between column headers is dragged (pressed and moving)
     * First it finds how much the mouse has moved from the difference between current mouseX
     *          and the initial mouseX when mouse was pressed on the divider,
     *          the initial mouseX is the pageX in the state
     * Adjusts the width of left/right coulmns by adding/subtracting the difference
     *          to/from the respective widths 
     * @param {Object} ev triggered event
     */
    handleColResizeMouseMove = (ev) => {
        if (this.state.leftCol && this.state.isResizing) {
            let movedBy = ev.pageX - this.state.pageX
            this.state.leftCol.style.width =
                `${(this.state.leftColWidth + movedBy) * 100 / document.getElementById("userTable").offsetWidth}%`

            if (this.state.rightCol) {
                this.state.rightCol.style.width =
                    `${(this.state.rightColWidth - movedBy) * 100 / document.getElementById("userTable").offsetWidth}%`
            }
        }
    }


    /**
     * Sets the background color of the divider to "rgba(96, 94, 94, 0.5)"
     *          when the mouse is released
     * Resets the values to leftCol, rightCol, leftColWidth, rightColWidth, pageX to their default values
     * Sets the "isResizing" state to false
     */
    handleColResizeMouseUp = () => {
        if (this.state.currDivider)
            this.state.currDivider.style.background = "rgba(96, 94, 94, 0.5)"
        this.setState({
            leftCol: null,
            rightCol: null,
            pageX: 0,
            leftColWidth: 0,
            rightColWidth: 0,
            isResizing: false
        })
    }

    /**
     * Sets the background color of the divider to "rgba(96, 94, 94, 1)"
     *          when the mouse is on the divider and being dragged (pressed and moving)
     *          to "rgba(96, 94, 94, 0.5)" when the mouse is on the divider,
     *          but is not being dragged (pressed and moving)
     * @param {Object} ev triggered event 
     */
    handleDividerMouseOver = (ev) => {
        if (!this.state.isResizing) ev.target.style.background = "rgba(96, 94, 94, 0.5)"
        else ev.target.style.background = "rgba(96, 94, 94, 1)"
    }


    /**
     * Sets the background color of the divider to "rgba(96, 94, 94, 1)"
     *          when the mouse leaves the divider, is still being dragged (pressed and moving)
     *          to "rgba(96, 94, 94, 0)" when the mouse is leaves divider,
     *          but is not being dragged (pressed and moving)
     * @param {Object} ev triggered event 
     */
    handleDividerMouseLeave = (ev) => {
        if (!this.state.isResizing) ev.target.style.background = "rgba(96, 94, 94, 0)"
        else ev.target.style.background = "rgba(96, 94, 94, 1)"
    }

    /**
     * Sets the background color of the divider to "rgba(96, 94, 94, 0)"
     *          when the mouse leaves the table header element
     * Resets the values to leftCol, rightCol, leftColWidth, rightColWidth, currDivider, pageX to their default values
     * Sets the "isResizing" state to false
     */
    handleMouseOutsideHeader = () => {
        if (this.state.currDivider)
            this.state.currDivider.style.background = "rgba(96, 94, 94, 0)"
        this.setState({
            leftCol: null,
            rightCol: null,
            pageX: 0,
            leftColWidth: 0,
            rightColWidth: 0,
            isResizing: false,
            currDivider: null
        })
    }


    /**
     * Renders the Table DOM
     * @returns the table DOM
     */
    render = () => {
        return (
            <table id="userTable">
                <thead>
                    <tr id='headerRow' onMouseLeave={this.handleMouseOutsideHeader}>
                        <th onMouseUp={this.handleColResizeMouseUp} onMouseMove={this.handleColResizeMouseMove}>
                            FULL NAME
                            <div
                                className='tableColDivider'
                                onMouseDown={this.handleColResizeMouseDown}
                                onMouseMove={this.handleColResizeMouseMove}
                                onMouseUp={this.handleColResizeMouseUp}
                                onMouseOver={this.handleDividerMouseOver}
                                onMouseLeave={this.handleDividerMouseLeave}>
                            </div>
                        </th>
                        <th onMouseUp={this.handleColResizeMouseUp} onMouseMove={this.handleColResizeMouseMove}>
                            FOOTPRINT TOKEN
                            <div className='tableColDivider'
                                onMouseDown={this.handleColResizeMouseDown}
                                onMouseMove={this.handleColResizeMouseMove}
                                onMouseUp={this.handleColResizeMouseUp}
                                onMouseOver={this.handleDividerMouseOver}
                                onMouseLeave={this.handleDividerMouseLeave}>
                            </div>
                        </th>
                        <th onMouseUp={this.handleColResizeMouseUp} onMouseMove={this.handleColResizeMouseMove}>
                            STATUS
                            <div className='tableColDivider'
                                onMouseDown={this.handleColResizeMouseDown}
                                onMouseMove={this.handleColResizeMouseMove}
                                onMouseUp={this.handleColResizeMouseUp}
                                onMouseOver={this.handleDividerMouseOver}
                                onMouseLeave={this.handleDividerMouseLeave}>
                            </div>
                        </th>
                        <th onMouseUp={this.handleColResizeMouseUp} onMouseMove={this.handleColResizeMouseMove}>
                            EMAIL
                            <div className='tableColDivider'
                                onMouseDown={this.handleColResizeMouseDown}
                                onMouseMove={this.handleColResizeMouseMove}
                                onMouseUp={this.handleColResizeMouseUp}
                                onMouseOver={this.handleDividerMouseOver}
                                onMouseLeave={this.handleDividerMouseLeave}>
                            </div>
                        </th>
                        <th onMouseUp={this.handleColResizeMouseUp} onMouseMove={this.handleColResizeMouseMove}>
                            SSN
                            <div className='tableColDivider'
                                onMouseDown={this.handleColResizeMouseDown}
                                onMouseMove={this.handleColResizeMouseMove}
                                onMouseUp={this.handleColResizeMouseUp}
                                onMouseOver={this.handleDividerMouseOver}
                                onMouseLeave={this.handleDividerMouseLeave}>
                            </div>
                        </th>
                        <th onMouseUp={this.handleColResizeMouseUp} onMouseMove={this.handleColResizeMouseMove}>
                            PHONE NUMBER
                            <div className='tableColDivider'
                                onMouseDown={this.handleColResizeMouseDown}
                                onMouseMove={this.handleColResizeMouseMove}
                                onMouseUp={this.handleColResizeMouseUp}
                                onMouseOver={this.handleDividerMouseOver}
                                onMouseLeave={this.handleDividerMouseLeave}>
                            </div>
                        </th>
                        <th onMouseUp={this.handleColResizeMouseUp}>
                            DATE
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {this.getTableRows()}
                </tbody>
            </table>
        )
    }
}

export default Table;