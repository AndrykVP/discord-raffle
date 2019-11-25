require('dotenv').config()

const fs = require('fs');
const { prefix } = require('./config.json');
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

const Discord = require('discord.js');
const token = process.env.BOT_TOKEN;

// Initialize Discord Bot with Custom Commands
const client = new Discord.Client();
client.commands = new Discord.Collection();
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);

	// Set a new item in the Collection
	// with the key as the command name and the value as the exported module
	client.commands.set(command.name, command);
}

client.once('ready', () => {
   console.log('Bot is running');
});

client.on('message', message => {
   if (!message.content.startsWith(prefix) || message.author.bot) return;

   var args = message.content.slice(prefix.length).split(/ +/);
   var command = args.shift().toLowerCase();

   if (!client.commands.has(command)) {
      message.channel.send('Sorry, I do not recognize that command.')
      return
   };

   try {
      client.commands.get(command).execute(message, args);
   }
   catch (error) {
      console.error(error);
      message.channel.send('Oops! There was an error trying to execute that command!');
   }
});

// Login to Discord with bot's token
client.login(token);