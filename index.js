const Discord = require('discord.js')
const client = new Discord.Client()
const config = require("./config")
const sql = require('sqlite')
sql.open('./database.sqlite')

client.on('ready', () => {
    console.log(`Zalogowano na konto ${client.user.tag}!`);
    client.user.setActivity(`${config.prefix}help`, {type: 'LISTENING'})
});

module.exports = {
    config: config,
    client: client,
    sql: sql
}

require("./events")
require("./commands")

client.login(config.token)