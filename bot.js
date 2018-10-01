const Discord = require('discord.io');
const logger = require('winston');
const auth = require('./auth.json');
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
        switch (cmd) {
            // !ping
            case 'ping':
                bot.sendMessage({
                    to: channelID,
                    message: 'Pong!'
                });
                break;
            case 'dota':
                const accountId = args[0];
                API.fetchPlayerLastMatchStats(accountId)
                    .then(res => {
                        bot.sendMessage({
                            to: channelID,
                            message: `Hi ${user}! ` + res,
                        });
                    });
                break;
        };
    }
});