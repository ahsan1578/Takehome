import React from 'react';
import "./Table.scss"
import { Link } from 'react-router-dom';
class Table extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
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

    getTableRows = () => {
        console.log(this.props)
        console.log("getting table")
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
                        <Link to={`/user/${user.name}/${user.createdAt}`} style={{ textDecoration: 'none', color: "black" }}>
                            {user.name}
                        </Link>
                    </td>
                    <td className='userToken'>
                        <div className='userTokenText' onClick={this.copyUserToken} onMouseLeave={this.resetCopyState}>
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


    render = () => {
        const handleClick = (e) => {
            e.preventDefault();
            console.log('The link was clicked.');
        }

        return (
            <table>
                <tbody>
                    <tr id='headerRow'>
                        <th>
                            FULL NAME
                        </th>
                        <th>
                            FOOTPRINT TOKEN
                        </th>
                        <th>
                            STATUS
                        </th>
                        <th>
                            EMAIL
                        </th>
                        <th>
                            SSN
                        </th>
                        <th>
                            PHONE NUMBER
                        </th>
                        <th>
                            DATE
                        </th>
                    </tr>
                    {this.getTableRows()}
                </tbody>
            </table>
        )
    }
}

export default Table;