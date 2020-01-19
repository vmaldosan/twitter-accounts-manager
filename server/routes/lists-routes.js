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
	console.log(req.body);
	if (req.body.length === 0) {
		res.status(422).send('no lists to create');
	} else {
		let responseData = req.body.lists.map((list) => {
			twitterDest.postCustomApiCall(
				encodeURI('/lists/create.json?name=' + list.name + '&mode=' + list.mode),
				{}, error, success);

			function success(data) {
				const parsed = JSON.parse(data);
				let filteredData = {
						key: parsed.id_str,
						name: parsed.name,
						mode: parsed.mode,
						membersCount: parsed.member_count
				};
				console.log(`list %s created`, filteredData.name);
				return filteredData;
			}

			function error(err) {
				console.log('ERROR [%s]', err);
				// res.status(500).send(`error while retrieving origin lists: ${body}`);
			};
		});
		res.status(200).json(responseData);

		/* const calls = [
			twitterDest.postCustomApiCall(
				encodeURI('/lists/create.json?name=' + list.name + '&mode=' + list.mode), 
				{}, error, success);

			function success(data) {
				const parsed = JSON.parse(data);
				let filteredData = {
						key: parsed.id_str,
						name: parsed.name,
						mode: parsed.mode,
						membersCount: parsed.member_count
				};
				console.log(`list %s created`, filteredData.name);
				return filteredData;
			}

			function error(err) {
				console.log('ERROR [%s]', err);
				// res.status(500).send(`error while retrieving origin lists: ${body}`);
			}
		];
		async.series(tasks, (err, results) => {
			if (err) {
				return next(err);
			}
			return res.json(results);
		}); */
	}
});

module.exports = router;
