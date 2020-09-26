const Discord = require("discord.js")
const {config, client, sql} = require("./index")

client.on('ready', () => {
    function sendAds() {
        sql.all(`SELECT * FROM ads ORDER BY RAND()`).then(row => {
            row.forEach(result => {
                const reklama = result.ad
                const id = result.id
                if(reklama) {
                    sql.all(`SELECT channelid FROM ads ORDER BY RAND()`).then(row => {
                        row.forEach(result => {
                            if(client.channels.cache.has(result.channelid)) {
                                client.channels.cache.get(result.channelid).send(`Reklama \`${id}\`\n` + reklama)
                            }
                        })
                    })
                }
            })
        })
    }
    setInterval(sendAds, config.timeout)
});

client.on("guildCreate", guild => {
    sql.run('INSERT OR IGNORE INTO ads (id) VALUES (?)', [guild.id]);
    client.channels.cache.get(config.log_channel).send(`Dołączyłem na serwer ${guild.name}`)
})

client.on("guildDelete", guild => {
    sql.run("DELETE FROM ads WHERE id = ?", [guild.id])
    client.channels.cache.get(config.log_channel).send(`Wyszedłem z serwera ${guild.name}`)
})