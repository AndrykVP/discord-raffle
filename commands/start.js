var store = require('store')
const { admins, color } = require('../config.json');
const { RichEmbed } = require('discord.js')

module.exports = {
	name: 'lt-start',
	description: 'Start a Lottery',
	execute(message, args) {
        // CHECK IF A LOTTERY IS ALREADY IN PROCESS
        if(store.get('running') === true) {
            message.reply('A lottery is already in process');
            return
        }

        // CHECK IF MEMBER HAS PERMISSIONS TO START A LOTTERY
        if(!message.member.roles.some(r => admins.includes(r.name) || !admins.includes(message.author.username))) {
            message.reply('Sorry, but only an admin can start a raffle');
            return
        }

        // ASSIGN VALUES TO SEND A MESSAGE BASED ON ARGUMENTS, OR TO DEFAULT
        // IF NO ARGUMENTS ARE GIVEN
        var hours, tickets, msg
        if(args.length < 1) {
            hours = 24
            tickets = 1000
            msg = 'Express 24-hour Art Lottery'
        }
        else {
            hours = args[0]
            tickets = args[1]
            msg = args.slice(2).join(' ')            
        }

        // CALCULATES THE DRAW DATE BASED ON THE ARGUMENTS GIVEN
        // OR DEFAULTS TO 24 HOURS FROM CURRENT DATE
        var date = new Date()
        date.setTime(date.getTime() +  (hours * 60 * 60 * 1000))

        // START LOTTERY SETTINGS AND PREVENT NEW LOTTERIES FROM BEING STARTED
        store.set('drawdate', date.getTime())
        store.set('maxTicket', tickets)
        store.set('running', true)

        // CONSTRUCTS AND SENDS A RICHEMBED MESSAGE
        const embed = new RichEmbed()
            .setColor(color)
            .setTitle('Starting a new Lottery!')
            .setDescription(msg)
            .addField('Draw Date', 'Winner will be drawn on ' + date, true)
            .addField('Get A Number!', 'Use the command !lottery-number and type a number between 1 and ' + tickets.toLocaleString('en-US'), true)

        message.channel.send(embed)
	},
};