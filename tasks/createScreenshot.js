"use strict";

const webshot = require('webshot');
const request = require('request');

require('buffer-concat');


function createScreenshot(web, bot, website, channel, device) {
  
  var url = website.match(/<(.*)\|/);
  
  if (url) {
   var url = url.pop();
  } else if(website.match(/<(.*)>/)) {
    var url = website.match(/<(.*)>/).pop();
  } else {
    var url = undefined;
  }
  
  let width = null; 
 
  switch (device) {
    case "mobile":
      width = 320
      break;
    case "tablet":
      width = 768
      break;
    case "desktop": 
      width = 1500
      break;
    default:
      width = 320
  }

  let options = {
    screenSize: { width: width },
    renderDelay: 3000,
    shotSize: { width: 'all', height: 'all'}, 
  };

  bot.sendMessage("sure thing, let me grab that screen", channel);        
  let renderStream = webshot(url, options);
  let buffArray = [];
  let size = 0;
  
  renderStream.on('data', (chunk) => {
    size += chunk.length;
    buffArray.push(chunk); 
  });

  renderStream.on('end', () => {
    bot.sendMessage("Done...here it comes", channel);         
    let form = request.post({ url: 'https://slack.com/api/files.upload'}, function (err, response, body) {}).form();
    form.append('token', process.env.SLACK_API_KEY);
    form.append('filename', `${url}-screenshot-${device}.png`);    
    form.append('file', Buffer.concat(buffArray), { filename: `${url}-screenshot-${device}.png`});
    form.append('filetype', 'png');
    form.append('title', `Screenshot of ${url} on ${device}`);
    form.append('channels', channel);
  });
};

module.exports = createScreenshot;

