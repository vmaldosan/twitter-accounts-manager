import React, { Component } from "react";

export default class ListTable extends Component {
	constructor(props) {
		super(props);
		this._updateChecked = this._updateChecked.bind(this);
		this._checkAll = this._checkAll.bind(this);
	}

	render() {
		const listItems = this.props.lists.map(list =>
			<tr>
				<td>{list.name}</td>
				<td>{list.mode}</td>
				<td>{list.membersCount}{list.newMembers !== undefined ?
						"+" + list.newMembers : ""}</td>
				<td><input id={list.key} name="listBox" type="checkbox"
							checked={this.props.selected.indexOf(String(list.key)) >= 0}
							onChange={this._updateChecked}
						/>
				</td>
			</tr>
		);

		let pending = [];
		if (this.props.pending !== undefined) {
			pending = this.props.pending.map(list => (
				<tr className="pending">
					<td>{list.name}</td>
					<td>{list.mode}</td>
					<td>{list.membersCount}</td>
					<td>
						<input id={list.key} name="listBox" type="checkbox"
							checked={this.props.selected.indexOf(String(list.key)) >= 0}
							onChange={this._updateChecked}
							/>
					</td>
				</tr>
			));
		}
		return (
			<div>
				<table className="innerTable">
					<thead>
						<tr>
							<th colSpan="4">
								{this.props.type === "orig" ? 
									"Original" : "Destination"} account
							</th>
						</tr>
						<tr>
							<th>Name</th>
							<th>Mode</th>
							<th># members</th>
							<th><input id={"listBox" + this.props.type} 
										name="listBox" type="checkbox"
										onChange={this._checkAll}/>
							</th>
						</tr>
					</thead>
					<tbody>
						{listItems}
						{pending}
					</tbody>
				</table>
			</div>
		);
	}

	_updateChecked(e) {
		const listId = e.target.id;
		let sel = this.props.selected;
		const pos = sel.indexOf(listId);
		if (pos >= 0) {
			sel.splice(pos, 1);
		} else {
			sel.push(listId);
		}
		this.props.parentCb(this.props.type, sel);
	}

	_checkAll(e) {
		this.props.parentCb(this.props.type, [], e.target.checked);
	}
}