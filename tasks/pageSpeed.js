"use strict";

const request = require('request');


function getPageSpeed(bot, channel, url) {
  let baseUrl = "https://www.googleapis.com/pagespeedonline/v2/runPagespeed?url="  
  request(baseUrl+url, (error, response, body) => {
    if (!error && response.statusCode == 200) {
      let data = JSON.parse(body);
      bot.sendMessage(`The title of ${url} is ${data.title}`, channel);  
    }
  })
}

module.exports = getPageSpeed;
