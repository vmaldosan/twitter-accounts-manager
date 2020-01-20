const router = require('express').Router();
const Twitter = require('twitter-node-client').Twitter;
const keys = require('../config/keys');

let twitterOrig = new Twitter(keys.CONFIG_ORIG);
let twitterDest = new Twitter(keys.CONFIG_DEST);

// 'reverse=true' to retrieve owned lists first, then subscribed lists.
router.get('/list/:type', (req, res) => {
	if (req.params.type === 'orig') {
		twitterOrig.getCustomApiCall('/lists/list.json', 'reverse=true', error, success);
	} else {
		twitterDest.getCustomApiCall('/lists/list.json', 'reverse=true', error, success);
	}

	function success(data) {
		let filteredData = JSON.parse(data).map((list) => {
			const fList = {
				key: list.id_str,
				name: list.name,
				mode: list.mode,
				membersCount: list.member_count
			};
			return fList;
		});
		res.status(200).json(filteredData);
	}

	function error(err) {
		console.log('ERROR [%s]', err);
		// res.status(500).send(`error while retrieving origin lists: ${body}`);
	};
});

router.post('/list', (req, res) => {
	if (req.body.length === 0) {
		res.status(422).send('no lists to create');
	} else {
		let responseData = req.body.lists.map((origList) => {
			// Create empty list
			twitterDest.postCustomApiCall(
				encodeURI('/lists/create.json?name=' + origList.name + '&mode=' + origList.mode),
				{}, error, success);

			function success(data) {
				const parsed = JSON.parse(data);
				let newList = {
						key: parsed.id_str,
						name: parsed.name,
						mode: parsed.mode,
						membersCount: parsed.member_count
				};
				console.log(`list '%s' created`, newList.name);

				// Retrieve members from original list and add them to the new one
				const membersId = replicateListMembers(origList.key, newList.key);
			}

			function error(err) {
				console.log('ERROR [%s]', err);
				res.status(500).send(`error while retrieving origin lists: ${body}`);
			};
		});

		res.status(204).json(responseData);
	}
});

function replicateListMembers(origListId, destListId) {
	twitterOrig.getCustomApiCall(
		encodeURI('/lists/members.json?list_id=' + origListId 
				+ '&cursor=-1&skip_status=true'),
		{}, error, success);

	function success(data) {
		const parsed = JSON.parse(data);
		console.log(`retrieved %d users`, parsed.users.length);
		const membersId = parsed.users.map(user => user.id_str);
		addMembers(destListId, membersId);
	}

	function error(err) {
		console.log('ERROR [%s]', err);
	};
}

function addMembers(listId, usersId) {
	console.log(usersId.join(','));
	twitterDest.postCustomApiCall(
		encodeURI('/lists/members/create_all.json?user_id=' + usersId.join(',') + '&list_id=' + listId),
		{}, error, success);

	function success() {
		console.log(`added %d users`, usersId.length);
	}

	function error(err) {
		console.log('ERROR [%s]', err);
	};
}

module.exports = router;
