require('dotenv').config()

const Discord = require('discord.js');
const token = process.env.BOT_TOKEN;

// Initialize Discord Bot
const client = new Discord.Client();

client.once('ready', () => {
     console.log('Ready');
});

client.on('message', message => {
	console.log(message.content);
});

// Login to Discord with bot's token
client.login(token);