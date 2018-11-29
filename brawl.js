const Discord = require('discord.js');
const config = require('./config.json')
const client = new Discord.Client();
const bh = require('brawlhalla-api')(config.api);
const ms = require('ms');

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', message => {
    if (message.author.bot) return;
    if (message.channel.type === "dm") return;

    let prefix = config.prefix;
    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];
    let args = messageArray.slice(1);

    if (cmd === `${prefix}legend`) {
        var lastName = ''
        if (args[1]) {
            var lastName = args[1].toLowerCase()
        }
        if (!args[0]) {
            let embed = new Discord.RichEmbed()
                .setTitle("Error")
                .setDescription("Please enter a legend name")
                .setColor("#FF0000");
            return message.channel.send(embed)
        }
        let legend = args[0].toLowerCase();
        if (legend === 'lordvraxx' || args[0] + lastName === 'lordvraxx') {
            legend = 'lord vraxx'
        } else if (legend === 'queennai' || args[0] + lastName === 'queennai') {
            legend = 'queen nai'
        } else if (legend === 'sirroland' || args[0] + lastName === 'sirroland') {
            legend = 'sir roland'
        } else if (legend === "wushang" || args[0] + lastName === 'wushang') {
            legend = 'wu shang'
        } else if (legend === "linfei" || args[0] + lastName === 'linfei') {
            legend = 'lin fei'
        }
        bh.getLegendInfo(legend).then(function (legendInfo) {
            let embed = new Discord.RichEmbed()
                .setTitle(legendInfo.bio_name)
                .setDescription(legendInfo.bio_aka)
                .setColor("#24adfd")
                .addField("Weapons", `${legendInfo.weapon_one} and ${legendInfo.weapon_two}`, true)
                .addField("Strength", legendInfo.strength, true)
                .addField("Dexterity", legendInfo.dexterity, true)
                .addField("Bot Name", legendInfo.bot_name, true)
                .addField("Defense", legendInfo.defense, true)
                .addField("Speed", legendInfo.speed, true);
            message.channel.send(embed);
        }).catch(function (error) {

        });
    }

    if (cmd === `${prefix}stats`) {
        let idOrName = args[0];
        let legend = args[1];
        let steamUrl;
        if (!idOrName) {
            let embed = new Discord.RichEmbed()
                .setTitle("Error")
                .setDescription("Please enter a __valid__ SteamID. Set it up at https://steamcommunity.com")
                .setColor("#FF0000");
            return message.channel.send(embed)
        }
        if (idOrName.startsWith("https://steamcommunity.com/")) {
            steamUrl = idOrName
        } else {
            steamUrl = "https://steamcommunity.com/id/" + idOrName;
        }
        bh.getBhidBySteamUrl(steamUrl).then(function (bhid) {
            // console.log(bhid)
            bh.getPlayerStats(bhid.brawlhalla_id).then(function (playerStats) {
                let legend = args[1];
                // console.log(playerStats)
                if (legend === 'clan') {
                    let embed = new Discord.RichEmbed()
                        .setTitle(playerStats.clan.clan_name)
                        .setDescription("The clan stats of " + playerStats.name)
                        .addField("Clan XP", playerStats.clan.clan_xp, true)
                        .addField("Personal XP", playerStats.clan.personal_xp, true)
                        .setColor("#24adfd");
                    return message.channel.send(embed)

                } else if (legend === 'lordvraxx') {
                    legend = 'lord vraxx'
                } else if (legend === 'queennai') {
                    legend = 'queen nai'
                } else if (legend === 'sirroland') {
                    legend = 'sir roland'
                } else if (legend === "wushang") {
                    legend = 'wu shang'
                } else if (legend === "linfei") {
                    legend = 'lin fei'
                }

                if (!legend) {
                    let embed = new Discord.RichEmbed()
                        .setTitle(playerStats.name)
                        .setDescription("The Brawlhalla stats of " + playerStats.name)
                        .setColor('#24adfd')
                        .addField("Level", playerStats.level, true)
                        .addField("Wins", playerStats.wins, true)
                        .addField("Games", playerStats.games, true)
                        .addField("Win%", `${Math.round((playerStats.wins / playerStats.games * 100) * 100) / 100}%`, true)
                        .addField("XP", playerStats.xp, true)
                        .addField("XP%", Math.round(playerStats.xp_percentage * 100) / 100 + "%", true);
                    message.channel.send(embed)
                } else {
                    for (let i = 0; i < playerStats.legends.length; i++) {
                        const playerLegends = playerStats.legends[i]
                        if (playerLegends.legend_name_key == legend) {
                            let embed = new Discord.RichEmbed()
                                .setTitle(playerLegends.legend_name_key.charAt(0).toUpperCase() + playerLegends.legend_name_key.slice(1))
                                .addField("Level", playerLegends.level, true)
                                .setDescription(`The ${playerLegends.legend_name_key.charAt(0).toUpperCase() + playerLegends.legend_name_key.slice(1)} stats of ${playerStats.name} `)
                                .addField("Wins", playerLegends.wins, true)
                                .addField("XP", playerLegends.xp, true)
                                .addField("Matches", playerLegends.games, true)
                                .addField("Damage Dealt", playerLegends.damagedealt, true)
                                .addField("Damage Taken", playerLegends.damagetaken, true)
                                .addField("K.O's", playerLegends.kos, true)
                                .addField("Falls", playerLegends.falls, true)
                                .addField("Accidents", playerLegends.suicides, true)
                                .setColor("#24adfd");
                            message.channel.send(embed)
                        }
                    }
                }



            }).catch(function (error) {
                console.log(error)
            });

        }).catch(function (error) {
            if (error === 'Not a valid Steam profile.') {
                let embed = new Discord.RichEmbed()
                    .setTitle("Error")
                    .setDescription("Please enter a __valid__ SteamID. Set it up at https://steamcommunity.com")
                    .setColor("#FF0000");
                return message.channel.send(embed)
            }
        });
    }


    if (cmd === `${prefix}help`) {
        embed = new Discord.RichEmbed()
            .setTitle("Help Guide | BrawlPie")
            .setDescription("To get the optimal out of BrawlPie, use these commands. Every command starts with `bh.`")
            .addField("`bh.legend <legend>`", "Get the base stats of the chosen legend")
            .addField("`bh.stats <steamID or URL>`", "Get the main stats of the chosen user")
            .addField("`bh.stats <steamID or URL> <legend>`", "Get the legend stats of chosen user")
            .addField("`bh.bot`", "Get the information of the BrawlPie bot")
            .addField("`bh.server`", "Get the information of the server")
            .addField("`bh.help`", "Get this help-embed")
            .addField("`bh.donate`", "Gives the possibilty to donate, only 16+ or parental permisson required")
            .addField("`bh.support`", "URL to BrawlPie Support Server")
            .setColor("#ffffff")
        message.channel.send(embed)
    }

    if (cmd === `${prefix}bot`) {
        let embed = new Discord.RichEmbed()
            .setTitle("BrawlPie")
            .setDescription("This is what I know about myself")
            .addField("Name", client.user.username, true)
            .addField("Created On", client.user.createdAt.toDateString(), true)
            .addField("Ping", parseInt(client.ping) + "ms", true)
            .addField("Uptime", ms(client.uptime), true)
            .setColor("#FFFfff")
            .setThumbnail(client.user.avatarURL);
        message.channel.send(embed);
    }

    if (cmd === `${prefix}server`) {
        let embed = new Discord.RichEmbed()
            .setTitle(message.guild.name)
            .setDescription("This is al I know")
            .addField("Name", message.guild.name, true)
            .addField("Members", message.guild.memberCount, true)
            .addField("Created At", message.guild.createdAt.toDateString(), true)
            .addField("Joined At", message.guild.joinedAt.toDateString(), true)
            .setColor("#ffffff")
            .setThumbnail(message.guild.iconURL);
        message.channel.send(embed);
    }

    if (cmd === `${prefix}donate`) {
        let embed = new Discord.RichEmbed()
            .setTitle("Note: Donation not required: only 16+ or with parental permission")
            .setDescription("https://www.ing.nl/particulier/betaalverzoek/index.htmlno?trxid=ykhM1mD2mviV4elfVmqxcZxHxwZxmCfP")
            .setAuthor("Donate")
            .setColor("#ffffff")
        message.channel.send(embed)
    }

    if (cmd === `${prefix}support`) {
        let embed = new Discord.RichEmbed()
            .setTitle("Support Server URL")
            .setColor("#ffffff")
            .setDescription("Join Server: https://discord.gg/KDgz7fR");
        message.channel.send(embed)
    }




});

client.login(config.token);