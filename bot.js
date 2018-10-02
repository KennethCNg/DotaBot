const Discord = require('discord.io');
const logger = require('winston');
const auth = require('./auth.json');
const fs = require('fs');
import capitalize from "lodash/capitalize";
import * as API from './api';


// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';
// Initialize Discord Bot
var bot = new Discord.Client({
    token: auth.token,
    autorun: true
});

/* Signals that the library has connected successfully to Discord, received and sorted all immediate data, and is now ready to be interacted with. */
bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});

bot.on('message', function (user, userID, channelID, message, evt) {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    if (message.substring(0, 1) == '!') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];

        args = args.splice(1);
        const name = capitalize(args[0]);
        switch (cmd) {
            // !ping
            case 'ping':
                bot.sendMessage({
                    to: channelID,
                    message: 'Pong!'
                });
                break;
            case 'dota':
                let dir = `./accounts/${name}.json`;
                /* looks for the file first. If there is no file,
                it returns an err, else it'll make the request to API.fetchPlayerLastMatchStats
                */
                fs.readFile(dir, "utf8", (err, data) => {
                    if (err) {
                        bot.sendMessage({
                            to: channelID,
                            message: `The name ${name} has not been set yet! Type '!dotaset [your_name] [your_steam32_id]' to tether your name to your steam account.`,
                        });
                    } else {
                        const steamId = JSON.parse(data)["steam_id"];
                        API.fetchPlayerLastMatchStats(steamId)
                            .then(resMsg => {
                                bot.sendMessage({
                                    to: channelID,
                                    message: `${name}! ` + resMsg,
                                });
                            });
                    }

                })
                break;
            case 'dotaset':
                const steamId = args[1];
                const data = {
                    "steam_id": steamId
                }
                fs.writeFile(`./accounts/${name}.json`, JSON.stringify(data), (err, res) => {
                    bot.sendMessage({
                        to: channelID,
                        message: `${name} has been tied to ${steamId}!`,
                    });
                });
                break;
        };
    }
});