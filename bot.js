"use strict";

const rtmApiClient = require('@slack/client').RtmClient;
const bot = new rtmApiClient(process.env.SLACK_API_KEY);
const RTM_EVENTS = require('@slack/client').RTM_EVENTS;
const CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;
const createScreenshot = require('./tasks/createScreenshot');
const getPageSpeed = require('./tasks/pageSpeed');
const webApiClient = require('@slack/client').WebClient;
const web = new webApiClient(process.env.SLACK_API_KEY);


var botID = "";

bot.on(CLIENT_EVENTS.RTM.AUTHENTICATED, (rtmStartData) => {
  botID = rtmStartData.self.id;
});


bot.on(RTM_EVENTS.MESSAGE, (message) => {
  if ( message.subtype == "bot_message" || message.subtype == "message_changed") { return; };
  
  let messageText = message.text.split(" ");
  let user = messageText[0].match(/@(.*)\>/);
  
  if (!user || user.pop() !== botID) { return; };
    
  let channel = message.channel;
  let keyword = messageText[1] || null;
   
  if (keyword == null) { 
    bot.sendMessage("I need some commands!  Try help or screenshot", channel);
    return;  
  } 
  
  let website = messageText[2] || null;
  let device = messageText[3] || "mobile";
  
  switch (keyword) {  
    case "help":
      bot.sendMessage("Sure thing. At the moment I can take screenshots for you. Here's how it works:\nType <command> <url> <device>\nFor example, screenshot newyorktimes.com mobile\nWe're working on more features, stay tuned...", channel);
      break;
    case "screenshot":
      if (website == null) { 
        bot.sendMessage("please provide a website", channel);
        return; 
      }
      createScreenshot(web, bot, website, channel, device);
      break;
    case "pagespeed":
      getPageSpeed(bot, channel, website.match(/<(.*)\|/).pop());
      break;
  }
});

module.exports = bot;


