import Header from "./Header";
import PropTypes from "prop-types";
import React, { Component } from "react";
import ListTable from "./ListTable";

export default class HomePage extends Component {
	static propTypes = {
		user: PropTypes.shape({
			name: PropTypes.string,
			profileImageUrl: PropTypes.string,
			twitterId: PropTypes.string,
			screenName: PropTypes.string,
			_id: PropTypes.string
		})
	};

	constructor(props) {
		super(props);
		this.handleListsClick = 
			this.handleListsClick.bind(this);
		this.state = {
			origLists: [],
			destLists: [],
			selOrig: [],
			selDest: [],
			shown: false,
			user: {},
			authenticated: false
		};
	}

	componentDidMount() {
		// Fetch does not send cookies. So you should add credentials: 'include'
		fetch("http://localhost:4000/auth/login/success", {
			method: "GET",
			credentials: "include",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				"Access-Control-Allow-Credentials": true
			}
		})
			.then(response => {
				if (response.status === 200) return response.json();
				throw new Error("failed to authenticate user");
			})
			.then(responseJson => {
				this.setState({
					authenticated: true,
					user: responseJson.user,
					lists: []
				});
			})
			.catch(error => {
				this.setState({
					authenticated: false,
					error: "Failed to authenticate user"
				});
			});
	}

	handleListsClick = (listIds, type) => {
		if (type === "orig") {
			this.setState({
				selOrig: listIds
			});
		} else {
			this.setState({
				selDest: listIds
			});
		}
	}

	render() {
		const { authenticated } = this.state;
		const action = this.state.shown ? 
					"Hide" : "Show";
		const tables = this.state.shown ?
				<div className="row">
					<div className="column">
						<ListTable type="orig"
							lists={this.state.origLists}
							selectedLists={this.state.selOrig}
							parentCb={this.handleListsClick}/>
					</div>
					<div className="column">
						<ListTable type="dest"
							lists={this.state.destLists}
							selectedLists={this.state.selDest}
							parentCb={this.handleListsClick}/>
					</div>
				</div>
				: "";
		const copyBtnClass = this.state.selOrig.length === 0 ? "disabled" : "";
		const mergeBtnClass = this.state.selOrig.length > 0 
				&& this.state.selDest.length > 0 ? "" : "disabled";
		const buttons = 
				<div>
					<button className={copyBtnClass}
						onClick={this._handleCopyLists}>
						Copy
					</button>
					<button className={mergeBtnClass}
						onClick={this._handleMergeLists}>
						Merge
					</button>
				</div>;

		return(
			<div>
				<Header authenticated={authenticated} handleNotAuthenticated={this._handleNotAuthenticated} />
				<div>
					{!authenticated ? (
						<h1>Login to start</h1>
					) : (
						<div>
							<div>
								<h1>You have login succcessfully to your first account!</h1>
								<h2>Welcome {this.state.user.name}!</h2>
							</div>
							<div>
								<button onClick={this._handleToggleLists}>
									{action} lists
								</button>
								{tables}
								<div className="footer">
									{buttons}
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
		);
	}

	_handleNotAuthenticated = () => {
		this.setState({ authenticated: false });
	};

	_handleToggleLists = () => {
		if (!this.state.shown) {
			if (this.state.origLists.length === 0) {
				fetch("http://localhost:4000/lists/list/orig", {
					method: "GET",
					credentials: "include",
					headers: {
						Accept: "application/json",
						"Content-Type": "application/json",
						"Access-Control-Allow-Credentials": true
					}
				}).then(response => {
					if (response.status === 200) return response.json();
					throw new Error("Failed to retrieve origin lists");
				})
				.then(responseJson => {
					this.setState({
						origLists: responseJson,
						selOrig: [],
						shown: true
					});
				})
				.catch(error => {
					this.setState({
						origLists: [],
						selOrig: [],
						shown: true
					});
				});
			}
			if (this.state.destLists.length === 0) {
				fetch("http://localhost:4000/lists/list/dest", {
					method: "GET",
					credentials: "include",
					headers: {
						Accept: "application/json",
						"Content-Type": "application/json",
						"Access-Control-Allow-Credentials": true
					}
				}).then(response => {
					if (response.status === 200) return response.json();
					throw new Error("Failed to retrieve destination lists");
				})
				.then(responseJson => {
					this.setState({
						destLists: responseJson,
						selDest: [],
						shown: true
					});
				})
				.catch(error => {
					this.setState({
						origLists: [],
						selOrig: [],
						shown: true
					});
				});
			}
			this.setState({
				shown: true
			});
		} else {
			this.setState({
				selOrig: [],
				selDest: [],
				shown: false
			});
		}
	}

	_handleCopyLists = () => {
		/* let selOrigList = 
					this.state.origLists.filter(
						(list) =>	
						this.state.selOrig.indexOf(String(list.key)) >= 0
					);
		selOrigList = this.state.destLists.concat(selOrigList);
		this.setState((state) => ({
			destLists: selOrigList
		})); */
	}

	_handleMergeLists = () => {
		
	}
}
