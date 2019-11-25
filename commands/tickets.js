var store = require('store')

module.exports = {
	name: 'number',
	description: 'Select a number to participate in lottery',
	execute(message, args) {
        // CHECK THAT A LOTTERY IS RUNNING
        if(store.get('running') == false) {
            message.reply('There is no active lottery at the moment')
            return
        }

        // CHECK THAT LOTTERY IS NOT OVER
        var now = new Date()
        var time = parseInt(store.get('drawdate')) - now.getTime()
        if(time < 1) {
            message.reply('This lottery is finished, drawing will occur soon.')
            return
        }

        // CHECK IF MEMBER ALREADY SELECTED A NUMBER
        let ticket = store.get(message.member.id)
        if(ticket) {
            message.reply('You already selected number ' + ticket)
            return
        }

        // CHECK THAT MEMBER IS CHOOSING A NUMBER
        let max = store.get('maxTicket')
        if(args.length < 1) {
            message.reply('You need to select a number between 1 and ' + store.get('maxTicket') + '!')
            return
        }

        // CHECK THAT CHOSEN NUMBER IS NOT ALREADY TAKEN
        ticket = args[0]
        let newTicket = true
        let holder = null
        store.each((val, key) => {
            let id = parseInt(key)
            if(id && val == ticket) {
                newTicket = false
                holder = message.guild.members.get(id)
            }
        })
        if(newTicket === false) {
            message.reply('Sorry, but that number has already been selected by ' + holder)
            return
        }
        // CHECK THAT CHOSEN NUMBER IS WITHIN RANGE
        if(ticket < 0 || ticket > max)
        {
            message.reply('Sorry, but that ticket number is out of range. Please choose another between 1 and ' + max + '!')
        }

        // STORE THE MEMBER'S TICKET NUMBER AND WISH THEM GOOD LUCK
        store.set(message.member.id,ticket)
        message.reply('You have been added to the lottery with the ticket number ' + ticket + '. Good luck!')
    }
}