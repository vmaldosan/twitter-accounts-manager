import Header from './Header';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ListTable from './ListTable';
import axios from 'axios';

export default class ListsManager extends Component {
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
		this.handleListsClick = this.handleListsClick.bind(this);
		this.state = {
			user: {},
			authenticated: false,
			origLists: [],
			destLists: [],
			selOrig: [],
			selDest: [],
			newLists: [],
			shown: false,
			merged: false
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

	handleListsClick = (listIds, type, all) => {
		if (type === "orig") {
			if (listIds.length > 0) {
				this.setState({selOrig: listIds});
			} else if (all) {
				const allLists = this.state.origLists.map(list => String(list.key));
				this.setState({selOrig: allLists});
			} else {
				this.setState({selOrig: []});
			}
		} else {
			if (listIds.length > 0) {
				this.setState({selDest: listIds});
			} else if (all) {
				const allLists = this.state.destLists.map(list => String(list.key));
				this.setState({selDest: allLists});
			} else {
				this.setState({selDest: []});
			}
		}
	}

	render() {
		const { authenticated } = this.state;
		const toggle = this.state.shown ? 'Hide' : 'Show';
		const tables = this.state.shown ? (
			<div className="row">
				<div className="column">
					<ListTable
						type="orig"
						lists={this.state.origLists}
						selected={this.state.selOrig}
						parentCb={this.handleListsClick}
					/>
				</div>
				<div className="column">
					<ListTable
						type="dest"
						lists={this.state.destLists}
						pending={this.state.newLists}
						selected={this.state.selDest}
						parentCb={this.handleListsClick}
					/>
				</div>
			</div>
		) : ("");
		const copyBtnClass = "" +
				(this.state.selOrig.length === 0 ? " disabled" : "");
		// const mergeBtnClass = "" + (this.state.selOrig.length > 0
		//	 && this.state.selDest.length > 0 ? "" : " disabled");
		const actionBtns = (
			<div>
				<button type="button" className={copyBtnClass} 
					onClick={this._handleCopyLists}>
					Copy
				</button>
				<button type="button" className="disabled"//{mergeBtnClass} 
					onClick={this._handleMergeLists}>
					Merge
				</button>
			</div>
		);
		const confirmBtnClass = (this.state.newLists.length > 0
				|| this.state.merged) ? "" : " disabled";
		const confirmationBtns = (
			<div>
				<button type="button" className={"" + confirmBtnClass} 
					onClick={this._handleSave}>
					Save
				</button>
				<button type="button" className={"" + confirmBtnClass}
					onClick={this._handleCancel}>
					Cancel
				</button>
			</div>
		);

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
								<h2>Click on "Show lists" to display them</h2>
							</div>
							<div>
								<button onClick={this._handleToggleLists}>
									{toggle} lists
								</button>
								{tables}
								<div className='footer'>
									{actionBtns}
								</div>
								<div className='footer'>
									{confirmationBtns}
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
				fetch('http://localhost:4000/lists/list/orig', {
					method: 'GET',
					headers: {
						Accept: 'application/json',
						'Content-Type': 'application/json'
					}
				}).then(response => {
					if (response.status === 200) return response.json();
					throw new Error('Failed to retrieve origin lists');
				})
				.then(responseJson => {
					this.setState({
						origLists: responseJson,
						selOrig: []
					});
				})
				.catch(error => {
					this.setState({
						origLists: [],
						selOrig: []
					});
				});
			}
			if (this.state.destLists.length === 0) {
				fetch('http://localhost:4000/lists/list/dest', {
					method: 'GET',
					headers: {
						Accept: 'application/json',
						'Content-Type': 'application/json'
					}
				}).then(response => {
					if (response.status === 200) return response.json();
					throw new Error('Failed to retrieve destination lists');
				})
				.then(responseJson => {
					this.setState({
						destLists: responseJson,
						selDest: [],
						newLists: []
					});
				})
				.catch(error => {
					this.setState({
						origLists: [],
						selOrig: [],
						newLists: []
					});
				});
			}
			this.setState({
				shown: true
			});
		} else {
			this._handleCancel();
			this.setState({shown: false});
		}
	}

	_handleCopyLists = () => {
		let selOrigLists = this.state.origLists.filter(
			list => this.state.selOrig.indexOf(String(list.key)) >= 0
		);
		selOrigLists = JSON.parse(JSON.stringify(selOrigLists)).map(
			list => {
				list.name = list.name + "_copy";
				return list;
			});
		selOrigLists = this.state.newLists.concat(selOrigLists);
		this.setState({ newLists: selOrigLists });
	};

	/* _handleMergeLists = () => {
		let totalNewMembers = 0;
		this.state.origLists.forEach(
			list => {
				if (this.state.selOrig.indexOf(String(list.key)) >= 0) {
					totalNewMembers += list.membersCount;
				}
		});
		let isMerged = false;
		const updatedDestLists = this.state.destLists.map(
			list => {
				if (this.state.selDest.indexOf(String(list.key)) >= 0) {
					list.newMembers = totalNewMembers;
					isMerged = true;
				}
				return list;
			}
		);
		this.setState({
			destLists: updatedDestLists,
			merged: isMerged
		});
	}; */

	_handleSave = async event => {
		await axios.post('http://localhost:4000/lists/list', {
			lists: this.state.newLists
		})
		.then((response) => {
			console.log(response);
			this.setState((state) => ({
				destLists: this.state.destLists.concat(state.newLists)
			}));
	
			// Reset selected lists.
			this._handleCancel();
		}, (error) => {
			console.log(error);
		});
	};

	_handleCancel = () => {
		document.getElementById("listBoxorig").checked = false;
		document.getElementById("listBoxdest").checked = false;
		this.state.destLists.forEach(
			list => list.newMembers = undefined
		);
		this.setState({
			selOrig: [],
			selDest: [],
			newLists: []
		});
	};
}
