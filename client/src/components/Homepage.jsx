import Header from './Header';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

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
		this.state = {
			user: {},
			authenticated: false,
		};
	}

	componentDidMount() {
		// Fetch does not send cookies. So you should add credentials: 'include'
		fetch('http://localhost:4000/auth/login/success', {
			method: 'GET',
			credentials: 'include',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'Access-Control-Allow-Credentials': true
			}
		})
		.then(response => {
			if (response.status === 200) return response.json();
			throw new Error('failed to authenticate user');
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
				error: 'Failed to authenticate user'
			});
		});
	}

	render() {
		const { authenticated } = this.state;

		return (
			<div>
				<Header authenticated={authenticated} 
						handleNotAuthenticated={this._handleNotAuthenticated} />
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

}
