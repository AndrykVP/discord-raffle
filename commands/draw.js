var store = require('store')
const { admins, color } = require('../config.json')
const { RichEmbed } = require('discord.js')

function randomize(number) {
    let result = Math.floor((Math.random() * (number - 1)))
    return result
}

module.exports = {
	name: 'lt-draw',
	description: 'Draw the winning number of the lottery',
	execute(message, args) {
        // CHECK IF THERE IS AN ACTIVE LOTTERY
        if(store.get('running') === false) {
            message.reply('There is no active lottery right now');
            return
        }

        // CHECK IF MEMBER HAS PERMISSIONS TO DRAW A WINNER
        if(!message.member.roles.some(r => admins.includes(r.name) || !admins.includes(message.author.username))) {
            message.reply('Sorry, but only an admin can draw a winner');
            return
        }

        // GENERATE LIST OF TICKET HOLDERS
        let tickets = []
        store.each((val, key) => {
            let id = parseInt(key)
            if(id) {
                let obj = {
                    member: id,
                    ticket: val
                }
                tickets.push(obj)
            }
        })

        // CHECK THAT THERE ARE TICKETS TO DRAW FROM
        if(tickets.length < 1) {
            message.reply('There were no numbers in the pool to choose from.')
            store.set('running',false)
            return
        }

        // SELECTS RANDOM WINNER FROM TICKET POOL
        let rand = randomize(tickets.length)
        let winner = tickets[rand]

        // CONSTRUCTS AND SENDS A RICHEMBED MESSAGE
        const embed = new RichEmbed()
            .setColor(color)
            .setTitle('Winning number: ' + winner.ticket)
            .setDescription('Congratulations ' + message.guild.members.get(winner.member))

        message.channel.send(embed)

        // CLOSING LOTTERY
        store.set('running',false)
    }
}