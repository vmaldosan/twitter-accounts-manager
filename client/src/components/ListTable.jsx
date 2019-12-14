import React, { Component } from "react";

export default class ListTable extends Component {
	constructor(props) {
		super(props);
		this._updateChecked = this._updateChecked.bind(this);
		this.state = {
			type: props.type
		};
	}

	render() {
		const listItems = this.props.lists.map(
			(list) =>
			<tr><td>{list.name}</td>
				<td>{list.mode}</td>
				<td>{list.memCount}</td>
				<td><input id={list.key}
					name="listBox"
					type="checkbox"
					defaultChecked=
							{this.props.selectedLists.indexOf(String(list.key)) >= 0}
					onChange={this._updateChecked}
					/></td>
			</tr>
		);

		return (
			<div>
				<table className="innerTable">
					<thead>
						<tr><th colSpan="4">
							{this.state.type === "orig" ? 
								"Original" : 
							"Destination"} account</th></tr>
						<tr><th>Name</th>
							<th>Mode</th>
							<th># members</th>
							<th></th></tr>
					</thead>
					<tbody>{listItems}</tbody>
				</table>
			</div>
		);
	}

	_updateChecked(e) {
		const listId = e.target.id;
		const sel = this.props.selectedLists;
		const pos = sel.indexOf(listId);
		if (pos >= 0) {
			sel.splice(pos, 1);
		} else {
			sel.push(listId)
		}
		this.props.parentCb(sel, this.state.type);
	}
}