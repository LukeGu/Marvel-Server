var express = require("express");
const axios = require("axios");
var cache = require("memory-cache");

var router = express.Router();
var urlCondition = "";
var url = `http://gateway.marvel.com/v1/public/comics?${urlCondition}ts=10000&apikey=d8722164d0d7c36ff8fa62029be9030b&hash=c05286ba52e60b1d7a481add8126d9f7`;
var conditionList = [];
var haveCache = false;

/* GET comics page. */
router.get("/", function(req, res, next) {
  res.send("Comics");
});

router.get("/getComics/:condition", function(req, res, next) {
  urlCondition = req.params.condition;
  haveCache = false;
  url = `http://gateway.marvel.com/v1/public/comics?${urlCondition}ts=10000&apikey=d8722164d0d7c36ff8fa62029be9030b&hash=c05286ba52e60b1d7a481add8126d9f7`;
  console.log(conditionList);
  if (conditionList.length) {
    conditionList.forEach(item => {
      if (item === urlCondition) {
        console.log("cache hit");
        var tmp = cache.get(item);
        haveCache = true;
        res.send(JSON.stringify(tmp));
      }
    });
  }
  if (!haveCache) {
    axios
      .get(url)
      .then(response => {
        var response = { status: 1, data: response.data.data };
        conditionList.push(urlCondition);
        cache.put(urlCondition, response);
        res.send(JSON.stringify(response));
      })
      .catch(error => {
        console.log(error);
      });
  }
});

module.exports = router;
