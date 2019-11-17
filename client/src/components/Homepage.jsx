import Header from "./Header";
import PropTypes from "prop-types";
import React, { Component } from "react";

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

	state = {
		user: {},
		lists: [],
		error: null,
		authenticated: false
	};

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
					lists: ["list1", "list2", "list3"]
				});
			})
			.catch(error => {
				this.setState({
					authenticated: false,
					error: "Failed to authenticate user"
				});
			});
	}

	render() {
		const { authenticated } = this.state;
		return (
			<div>
				<Header
					authenticated={authenticated}
					handleNotAuthenticated={this._handleNotAuthenticated}
				/>
				<div>
					{!authenticated ? (
						<h1>Welcome!</h1>
					) : (
						<div>
							<h1>You have login succcessfully!</h1>
							<h2>Welcome {this.state.user.name}!</h2>
							<h2>Select the list(s) to export:</h2>
							<ArrayToList lists={this.state.lists}/>
						</div>
					)}
				</div>
			</div>
		);
	}

	_handleNotAuthenticated = () => {
		this.setState({ authenticated: false });
	};

	_handleListsClick = () => {
		window.open("http://localhost:4000/lists", "_self");
	};
}

function ArrayToList(props) {
	const lists = props.lists;
	const listItems = lists.map((list) =>
		<li>{list}</li>
	);
	return (
		<ul>{listItems}</ul>
	);
}
