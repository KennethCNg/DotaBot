import {
    Client
} from "discord.js";
const auth = require("./auth.json");
const fs = require("fs");
import capitalize from "lodash/capitalize";
import {
    fetchPlayerLastMatchStats,
    fetchGif
} from "./api";

const bot = new Client();
bot.login(auth.token);

bot.on("ready", () => {
    console.log(`Logged in as ${bot.user.tag}!`);
});

bot.on("message", message => {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    // console.log('message: ', message.content);
    if (message.content.substring(0, 1) == "!") {
        let args = message.content.substring(1).split(" ");
        const cmd = args[0];

        args = args.splice(1);
        const name = capitalize(args[0]);
        switch (cmd) {
            case 'ping':
                message.reply('Pong!');
                break;
            case "testGif":
                const attachment = 'https://giphy.com/gifs/QGzPdYCcBbbZm';
                // Send the attachment in the message channel
                message.channel.send(attachment);
                message.channel.send("it works!");
                break;
            case "gif":
                const queryTerm = args.join("+");
                let msg = null;
                fetchGif(queryTerm).then(res => {
                    const gifArr = res.data.data;
                    if (res.data.data.length > 0) {
                        msg = getGifUrl(gifArr);
                    } else {
                        msg = `Nice try dumbass, there's no gif for that.`;
                    }
                    message.reply(msg);
                });

                function getGifUrl(gifArr) {
                    return gifArr[Math.floor(Math.random() * gifArr.length)].url;
                };
                break
            case "dota":
                let dir = `./accounts/${name}.json`;
                fs.readFile(dir, "utf8", (err, data) => {
                    if (err) {
                        message.reply(
                            `The name ${name} has not been set yet! Type '!dotaset [your_name] [your_steam32_id]' to tether your name to your steam account.`
                        );
                    } else {
                        const steamId = JSON.parse(data)["steam_id"];
                        console.log('YOYOYOYOYOYOYOY');
                        fetchPlayerLastMatchStats(steamId).then(res => {
                            message.reply(`${name}! ` + res);
                        });
                    }
                });
                break;
            case "dotaset":
                const steamId = args[1];
                const data = {
                    steam_id: steamId
                };
                fs.writeFile(
                    `./accounts/${name}.json`,
                    JSON.stringify(data),
                    (err, res) => {
                        message.reply(`${name} has been tied to ${steamId}!`);
                    }
                );
                break;
        }
    }
});