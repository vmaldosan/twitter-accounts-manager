const router = require('express').Router();
const keys = require('../config/keys');
const Twitter = require('twitter-node-client').Twitter;

let twitterOrig = new Twitter(keys.CONFIG_ORIG);
let twitterDest = new Twitter(keys.CONFIG_DEST);

// 'reverse=true' to retrieve owned lists first, then subscribed lists.
router.get('/list/orig', (req, res) => {
		twitterOrig.getCustomApiCall('/lists/list.json', 'reverse=true', error, success);

		function success(data) {
			// console.log('>>>>> Data >>>>>\n %s', data);
			let filteredData = JSON.parse(data).map((list) => {
				const fList = {
					key: list.id_str,
					name: list.name,
					mode: list.mode,
					memCount: list.member_count
				};
				return fList;
			});
			console.log(filteredData);
			res.status(200).json(filteredData);
		}

		function error(err, res, body) {
			console.log('ERROR [%s]', err);
			// res.status(500).send(`error while retrieving origin lists: ${body}`);
		};
	});

	router.get('/list/dest', (req, res) => {
		twitterDest.getCustomApiCall('/lists/list.json', 'reverse=true', error, success);

		function success(data) {
			// console.log('Data [%s]', data);
			res.send(data);
		}

		function error(err, res, body) {
			console.log('ERROR [%s]', err);
			// res.status(500).send(`error while retrieving destination lists: ${body}`);
		};
	});

module.exports = router;
