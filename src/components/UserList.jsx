import React from "react";
import Table from "./Table.jsx";
import axios from "axios";
import { debounce } from "lodash";
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import "./UserList.scss"
import SearchIcon from '@mui/icons-material/Search';

class UserList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            users: [],
            searchTerm: "",
            sortBy: null,
            resultsPerPage: 5,
            currPage: 1
        }
    }

    componentDidMount = () => {
        let queryParams = this.getQueryParameters();
        this.setState({
            searchTerm: queryParams.searchTerm,
            sortBy: queryParams.sortBy,
            resultsPerPage: queryParams.resultsPerPage,
            currPage: queryParams.currPage
        })
        if (queryParams.searchTerm) {
            this.fetchFilteredUsers(queryParams.searchTerm)
        } else {
            this.fetchAllUsers()
        }
    }

    componentDidUpdate = (prevProps, prevState) => {
        if (prevProps !== this.props && prevState !== this.state) {
            this.props.history.replace(this.getNavigationURL())
        }
    }


    getQueryParameters = () => {
        let queryParams = {
            searchTerm: "",
            sortBy: 3,
            resultsPerPage: 5,
            currPage: 1
        }

        let queries = this.props.match.params.query.split("&");

        if (queries.length !== 4) {
            return queryParams;
        }

        queries.forEach(query => {
            let keyValue = query.split("=")
            if (keyValue.length == 2) {
                let key = keyValue[0];
                let value = keyValue[1];

                if (value) {
                    if (key === "search") {
                        queryParams.searchTerm = value
                    } else if (key === "sortBy" && +value) {
                        queryParams.sortBy = +value
                    } else if (key === "perPage" && +value) {
                        queryParams.resultsPerPage = +value
                    } else if (key === "pageNo" && +value) {
                        queryParams.currPage = +value
                    }
                }
            }
        })

        return queryParams;
    }

    getNavigationURL = () => {
        return `/userlist/search=${this.state.searchTerm}&sortBy=${this.state.sortBy}&perPage=${this.state.resultsPerPage}&pageNo=${this.state.currPage}`
    }


    debounceFetch = debounce((event) => {
        if (event.target.value) {
            this.fetchFilteredUsers(event.target.value)
        } else {
            this.fetchAllUsers()
        }
        this.setState({
            searchTerm: event.target.value,
            currPage: 1
        })
        this.props.history.replace(this.getNavigationURL())
    }, 1000)


    handleSearchInput = (ev) => {
        this.setState({
            searchTerm: ev.target.value
        })
        this.debounceFetch(ev)
    }

    handleResultPerPageChange = (ev) => {
        this.setState({
            resultsPerPage: +ev.target.value,
            currPage: 1
        })
        this.props.history.replace(this.getNavigationURL())
    }

    handlePrevClick = (ev) => {
        ev.preventDefault();
        this.setState({
            currPage: this.state.currPage - 1
        })
        this.props.history.replace(this.getNavigationURL())
    }

    handleNextClick = (ev) => {
        ev.preventDefault();
        this.setState({
            currPage: this.state.currPage + 1
        })
        this.props.history.replace(this.getNavigationURL())
    }

    handleSortOptionChange = (ev) => {
        this.setState({
            sortBy: +ev.target.value,
            currPage: 1
        })
        this.props.history.replace(this.getNavigationURL())
    }


    fetchAllUsers = () => {
        let fetchPromise = axios("https://footprint-cc.preview.onefootprint.com/api/users");
        fetchPromise.then(usersData => {
            let users = usersData.data;
            this.setState({
                users: users
            })
        }, error => {
            console.log(error);
        })
    }

    fetchFilteredUsers = searchTerm => {
        let fetchPromise = axios(`https://footprint-cc.preview.onefootprint.com/api/users?search=${searchTerm}`);
        fetchPromise.then(usersData => {
            let users = usersData.data;
            this.setState({
                users: users
            })
        }, error => {
            console.log(error);
        })
    }

    getConstrainedUserList = () => {
        //Sort first
        let allResults = this.state.users.slice(0, this.state.users.length);
        let sortCriteria = this.state.sortBy;
        if (sortCriteria === 1 || sortCriteria === 2) {
            allResults.sort((a, b) => {
                let n1 = a.name;
                let n2 = b.name;

                return n1 >= n2 ? (sortCriteria === 1 ? 1 : -1) : (sortCriteria === 1 ? -1 : 1)
            })
        } else if (sortCriteria === 4) {
            allResults.sort((a, b) => {
                let d1 = new Date(a.createdAt);
                let d2 = new Date(b.createdAt);

                return d1 >= d2 ? 1 : -1
            })
        }
        let startIndex = (this.state.currPage - 1) * this.state.resultsPerPage;
        let endIndex = this.state.currPage * this.state.resultsPerPage;
        if (endIndex > allResults.length) {
            endIndex = allResults.length;
        }
        return allResults.slice(startIndex, endIndex);
    }

    render = () => {
        return (
            <div>
                <h2 id="userPageHeader">Users</h2>
                <div id="listModifierOptions">
                    <form>
                        <div id="searchContainer">
                            <SearchIcon sx={{ width: 1 / 15 }} />
                            <input type="Search" id="searchInput" name="name" onChange={this.handleSearchInput} value={this.state.searchTerm} placeholder="Search" />
                        </div>
                    </form>
                    <div id="sortContainer">
                        <label id="sortByText">Sort by</label>
                        <select name="sortBy" id="sortBy" onChange={this.handleSortOptionChange}>
                            <option value="1" selected={this.state.sortBy === 1}>Full name - A to Z</option>
                            <option value="2" selected={this.state.sortBy === 2}>Full name - Z to A</option>
                            <option value="3" selected={this.state.sortBy === 3 || this.state.sortBy === 0}>Date - recent to old</option>
                            <option value="4" selected={this.state.sortBy === 4}>Date - old to recent</option>
                        </select>
                    </div>
                </div>
                <div id="dividerLine"></div>
                <Table users={this.getConstrainedUserList()} />
                <div id="tableModifierOptions">
                    <div id="resultCountDisplay">
                        {`Showing ${((this.state.currPage - 1) * this.state.resultsPerPage)+1} to ${Math.min(this.state.currPage * this.state.resultsPerPage, this.state.users.length)} of ${this.state.users.length} results`}
                    </div>
                    <div id="paginationOptions">
                            <div id="rowsPerPageContainer">
                            <label id="rowsPerPageLabel">Rows per page</label>
                            <select name="numResults" id="numResults" onChange={this.handleResultPerPageChange}>
                                <option value="2" selected={this.state.resultsPerPage === 2}>2</option>
                                <option value="3" selected={this.state.resultsPerPage === 3}>3</option>
                                <option value="5" selected={this.state.resultsPerPage === 5}>5</option>
                            </select>
                            </div>
                        <button disabled={this.state.currPage === 1} onClick={this.handlePrevClick} class="pageChangeButtons" id="prevButton">Previous</button>
                        <button disabled={(this.state.currPage * this.state.resultsPerPage) >= this.state.users.length} onClick={this.handleNextClick} class="pageChangeButtons">Next</button>
                    </div>
                </div>
            </div>
        )
    }
}

export default UserList;