import React from "react";
import Table from "../Table/Table.jsx";
import axios from "axios";
import { debounce } from "lodash";
import 'react-dropdown/style.css';
import "./UserList.scss"
import SearchIcon from '@mui/icons-material/Search';


/**
 * This component is responsible for rendering the UI of the page with the list of users
 * along with the options such as search, sort, pagination
 * The component doesn't receive any props except for the react router props
 * 
 * That state object contains the following properties:
            users: an array of users, initially empty, but populated when the component is mounted
            searcTerm: the search token to search the users, value gets updated when user types in the "search" input field
            sortBy: an integer indicating how the list should be sorted. Values it can take are:
                       1 - indicates sorting ascending alphabatical order of names
                       2 - indicates sorting descending alphabatical order of names
                       3 - indicates sorting recent to old order of date (default)
                       4 - indicates sorting old to recent order of date
            resultsPerPage: number of entries to show in the table of users (default value 5)
            currPage: current page number for pagination (default 1)
 */
class UserList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            users: [],
            searchTerm: "",
            sortBy: 3,
            resultsPerPage: 5,
            currPage: 1
        }
    }

    /**
     * Lifecycle method called when the component is first mounted
     * Sets the state using the URL query parameters (described below)
     * Fetches the user list of users using appropriate API call (different calls for with/without search term)
     */
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

    /**
     * Lifecyle method called when the component is updated.
     * replaces the URL with a new URL representing the current search, sort, pagination state (if the URL wasn't updated already)
     * @param {Object} prevProps previous props to the component
     * @param {Object} prevState previous state of the component
     */
    componentDidUpdate = (prevProps, prevState) => {
        if (prevProps !== this.props && prevState !== this.state) {
            this.props.history.replace(this.getNavigationURL())
        }
    }


    /**
     * Parses the URL
     * The URL configuration is - 
     * http://localhost:3000/#/userlist/search=<seatch term>&sortBy=<sorting direction>&perPage=<number of rows>&pageNo=<current page number>
     * As mentioned before, sort direction is indicated by integers 1,2,3, or 4
     * All of the query parameters can be empty,
     * in which case default values with the used (default values are explained in the state configuration above)
     * @returns Object containing the parsed values of the query parameters searchTerm, sortBy, resultsPerPage, currPage
     */
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

    /**
     * Given the current state, generates the part of the URL after the domain name (with query appropriate query parameters)
     * @returns a string containing the part of the URL after the domain name
     */
    getNavigationURL = () => {
        return `/userlist/search=${this.state.searchTerm}&sortBy=${this.state.sortBy}` +
            `&perPage=${this.state.resultsPerPage}&pageNo=${this.state.currPage}`
    }


    /**
     * Debounces the fetch request with search term to limit frequent API calls
     */
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
    }, 500)

    /**
     * Updates the searchTerm in state with the new input and initiates new debounced fetch
     * @param {Object} ev triggered event
     */
    handleSearchInput = (ev) => {
        this.setState({
            searchTerm: ev.target.value
        })
        this.debounceFetch(ev)
    }

    /**
     * Updates the resultsPerPage in the state
     * Resets the current page to the first page
     * updates the URL to persist current state
     * @param {Object} ev triggered event 
     */
    handleResultPerPageChange = (ev) => {
        this.setState({
            resultsPerPage: +ev.target.value,
            currPage: 1
        })
        this.props.history.replace(this.getNavigationURL())
    }

    /**
     * Increases the current page number in the state (on "next" button click)
     * updates the URL to persist current state
     * @param {Object} ev triggered event
     */
    handlePrevClick = (ev) => {
        ev.preventDefault();
        this.setState({
            currPage: this.state.currPage - 1
        })
        this.props.history.replace(this.getNavigationURL())
    }

    /**
     * Decreases the current page number in the state (on "previous" button click)
     * updates the URL to persist current state
     * @param {Object} ev triggered event 
     */
    handleNextClick = (ev) => {
        ev.preventDefault();
        this.setState({
            currPage: this.state.currPage + 1
        })
        this.props.history.replace(this.getNavigationURL())
    }

    /**
     * Updates the sort direction in the state
     * updates the URL to persist current state
     * @param {Object} ev triggered event 
     */
    handleSortOptionChange = (ev) => {
        this.setState({
            sortBy: +ev.target.value,
            currPage: 1
        })
        this.props.history.replace(this.getNavigationURL())
    }


    /**
     * Fetches list of all users using the appropriate API call
     * updates the state's "users" property with the fetched list
     */
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


    /**
     * Fetches list of all users that matches the "searchTerm" using the appropriate API call
     * updates the state's "users" property with the fetched list
     * @param {string} searchTerm the search token
     */
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


    /**
     * Buils a list of users from the current "users" list in the state following the constraints as follows:
     * First the list is sorted in the order indicated by the "sortBy" property in the state
     * Calculates which users from the big list to include using the results per page and page number
     * Creates a new list only with included users (that follow the constraints)
     * @returns the new list
     */
    getConstrainedUserList = () => {
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

    /**
     * Renders the UI of the page
     * Calls the "Table" component within
     * @returns the UI DOM
     */
    render = () => {
        return (
            <div>
                <h2 id="userPageHeader">Users</h2>
                <div id="listModifierOptions">
                    <form>
                        <div id="searchContainer">
                            <SearchIcon sx={{ width: 1 / 15 }} />
                            <input
                                type="Search"
                                id="searchInput"
                                name="name"
                                onChange={this.handleSearchInput}
                                value={this.state.searchTerm}
                                placeholder="Search"
                            />
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
                        {
                            this.state.users.length > 0 ?
                                `Showing ${((this.state.currPage - 1) * this.state.resultsPerPage) + 1}` +
                                ` to ${Math.min(this.state.currPage * this.state.resultsPerPage, this.state.users.length)}` +
                                ` of ${this.state.users.length} results` :
                                "No users found! Try changing your search word."
                        }
                        { }
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
                        <button
                            disabled={this.state.currPage === 1}
                            onClick={this.handlePrevClick}
                            className="pageChangeButtons"
                            id="prevButton">
                            Previous
                        </button>
                        <button
                            disabled={(this.state.currPage * this.state.resultsPerPage) >= this.state.users.length}
                            onClick={this.handleNextClick}
                            className="pageChangeButtons">
                            Next
                        </button>
                    </div>
                </div>
            </div>
        )
    }
}

export default UserList;