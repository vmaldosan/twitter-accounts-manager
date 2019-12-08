import React, { Component } from "react";

export default class ListTable extends Component {
	constructor(props) {
		super(props);
		this._updateChecked = this._updateChecked.bind(this);
		this.state = {
			orig: props.orig,
			lists: [],
			selectedLists: [],
      shown: false
		};
	}

	render() {
		const action = this.state.shown ? "Hide" : "Show";
		const listItems = this.state.lists.map(
			(list) =>
			<tr><td>{list.name}</td>
				<td>{list.mode}</td>
				<td><input id={list.id}
					name="listBox" 
					type="checkbox"
					defaultChecked={this.state.selectedLists.indexOf(list.id) >= 0}
					onChange={this._updateChecked}
					/></td>
			</tr>
		);
		const listsTable = this.state.shown ?
			<table className="innerTable">
				<thead>
					<tr><th colSpan="3">{this.state.orig ? "Original" : "Destination"} account</th></tr>
					<tr><th>Name</th><th>Mode</th><th></th></tr>
				</thead>
				<tbody>{listItems}</tbody>
			</table> 
			: "";
		const buttons = (this.state.selectedLists.length > 0 
			&& this.state.shown) ?
					<div className={this.state.type}>
						<button>
							Copy
						</button>
						<button>
							Merge
						</button>
					</div>
					: "";

		return (
			<div>
				<button onClick={this._handleListsClick}>
					{action} lists
				</button>
				{listsTable}
				{buttons}
			</div>
			);
	}

  _handleListsClick = () => {
    if (!this.state.shown) {
      fetch("http://localhost:4000/lists/list", {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true
        }
      }).then(response => {
        if (response.status === 200) return response.json();
        throw new Error("Failed to retrieve lists");
      })
      .then(responseJson => {
        this.setState({
          lists: responseJson,
          shown: true
        });
      })
      .catch(error => {
        this.setState({
          lists: [],
          shown: true
        });
      });
    } else {
      this.setState({
        lists: [],
        shown: false
      });
    }
  }

	_updateChecked(e) {
		const listId = e.target.id;
		const sel = this.state.selectedLists;
		const pos = sel.indexOf(listId);
		if (pos >= 0) {
			sel.splice(pos, 1);
		} else {
			sel.push(listId)
		}
		this.setState({
			selectedLists: sel
		});
	}
}