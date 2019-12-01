const router = require("express").Router();
// const request = require('request');
const keys = require("../config/keys");
const Twitter = require('twitter-node-client').Twitter;

let config = {
  "consumerKey": keys.TWITTER_CONSUMER_KEY_DEST,
  "consumerSecret": keys.TWITTER_CONSUMER_SECRET_DEST,
  "accessToken": keys.TWITTER_ACCESS_TOKEN_DEST,
  "accessTokenSecret": keys.TWITTER_TOKEN_SECRET_DEST
}

let twitter = new Twitter(config);

// 'reverse=true' to retrieve owned lists first, then subscribed lists.
router.get("/list", (req, res) => {
  twitter.getCustomApiCall('/lists/list.json', 'reverse=true', error, success);

  function success(data) {
    console.log('Data [%s]', data);
    res.send(data);
  }

  function error(err, res, body) {
    console.log('ERROR [%s]', err);
    res.status(500).send(`error while retrieving lists: ${body}`);
  };
  
});

module.exports = router;
