const Discord = require("discord.js")
const {config, client, sql} = require("./index")
const prefix = config.prefix

async function sendEmbed(message, text) {
    message.channel.send({
        embed: {
            description: `${text}`,
            color: 49151,
            thumbnail: {
                url: `${client.user.displayAvatarURL()}`
            }
        }
    })
}

client.on('message', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(' ');
    const command = args.shift().toLowerCase();

    if(command === "help" || command === "pomoc") { 
        sendEmbed(message, `
        \`${config.prefix}help\` - Pokazuje to co teraz
        \`${config.prefix}kanal\` - Ustawia kanał reklam
        \`${config.prefix}reklama\` - Ustawia reklame
        \`${config.prefix}status\` - Sprawdza status serwera
        `) 
    }
    else if (command === "reklama" || command === "r") {
        if(!message.member.hasPermission("ADMINISTRATOR")) return sendEmbed(message, "Nie posiadasz permisji! (\`ADMINISTRATOR\`)")
        if(!args) return sendEmbed(message, "Podaj swoją reklamę!")
        sql.all(`SELECT * FROM ads WHERE id = ?`, [message.guild.id]).then(async row => {
            if(!row[0].channelid || !row[0]) return sendEmbed(message, "Ustaw najpierw kanał!")
            if(args.includes("http" || "discord.gg" || "discord.com")) return sendEmbed(message, "Wykryto link! Usuń wszystkie linki i zaproszenia!")
            if(args.includes("everyone" || "here")) return sendEmbed(message, "Usuń wszystkie wzmianki!")
            let invite = await message.channel.createInvite({
                maxAge: 0
            });
            let opis = `https://discord.gg/` + invite + "\n\n" + args.slice(0).join(' ')
            sql.run("UPDATE ads SET ad = ? WHERE id = ?", [opis, message.guild.id])
            sendEmbed(message, "Reklama ustawiona!")
        })
    } else if (command === "kanal" || command === "k") {
        if(!message.member.hasPermission("ADMINISTRATOR")) return sendEmbed(message, "Nie posiadasz permisji! (\`ADMINISTRATOR\`)")
        if(!args[0]) return sendEmbed(message, "Proszę podać wzmianke kanału!")
        
        let channel = client.guilds.cache.get(`${message.guild.id}`).channels.cache.get(args[0].replace(/\D/g,''));
        if(!channel) return sendEmbed(message, "Podany kanał jest nie prawidłowy!")
        sql.run("UPDATE ads SET channelid = ? WHERE id = ?", [args[0].replace(/\D/g,''), message.guild.id])
        sendEmbed(message, "Kanał został ustawiony pomyślnie!")
    } else if (command === "status" || command === "s") {
        if(!message.member.hasPermission("ADMINISTRATOR")) return sendEmbed(message, "Nie posiadasz permisji! (\`ADMINISTRATOR\`)")
        sql.all(`SELECT * FROM ads WHERE id = ?`, [message.guild.id]).then(async row => {
            if(row[0].ad) return sendEmbed(message, ":white_check_mark: Serwer jest reklamowany!")
            else {
                sendEmbed(message, ":x: Serwer **nie** jest reklamowany!")
            }
        })
    }
});