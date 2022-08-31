const { readdirSync} = require("fs");
const { MessageEmbed, WebhookClient } = require("discord.js");
const Enmap = require("enmap");
const serialize = require('serialize-javascript');
const ee = require(`${process.cwd()}/botconfig/embed.json`);


module.exports = (client) => {
  const stringlength = 69;

  const d =  new Date();
  const date = d.getHours() + ":" + d.getMinutes() + ", "+ d.toDateString();

  console.log(`     ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓`.bold.brightGreen);
  console.log(`     ┃ `.bold.brightGreen + `Discord Bot is online!`.bold.brightGreen + " ┃".bold.brightGreen);
  console.log(`     ┃ `.bold.brightGreen + `Username: Yakuza | Date: ${date} ` + "┃".bold.brightGreen);
  console.log(`     ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛`.bold.brightGreen);

  const wrb = new WebhookClient({
      id: "995016470788571167",
      token: "w2w6ikpEVQ3RwvpHRpmHXA9Hkn7LlRYzre1jYhO__oQ2LncJcbp2jNlVC0asUEKJPQ5h"
  });
  const joinguild = new MessageEmbed()
      .setTitle('READY')
      .setDescription(`[READY]: Yakuza Bot | [TIME]: ${date}`)
      .setColor('RANDOM')
      .setTimestamp()
      .setImage('https://media.discordapp.net/attachments/984111465936064522/984474226385911838/giphy_1.gif')
      .setFooter({
          text: `copyright by yakuza-bot`
      })
  wrb.send({ embeds: [joinguild] });


  console.log(`\n\n${String("[READY]:: ".green)}Ready New `.brightGreen)
  console.log(`${String("[READY]:: ".green)}Coded by PericolRPG(leaks.ro) `.brightGreen)
  console.log(`${String("[READY]:: ".green)}Updated coding by PericolRPG(Discord Developers) `.brightGreen)


  let dateNow = Date.now();
  console.log(`${String("[x] :: ".magenta)}Now loading the Commands ...`.brightGreen)
  try {
    readdirSync("./commands/").forEach((dir) => {
      const commands = readdirSync(`./commands/${dir}/`).filter((file) => file.endsWith(".js"));
      for (let file of commands) {
        try{
          let pull = require(`../commands/${dir}/${file}`);
          if (pull.name) {
            client.commands.set(pull.name, pull);
            //console.log(`    | ${file} :: Ready`.brightGreen)
          } else {
            //console.log(`    | ${file} :: error -> missing a help.name,or help.name is not a string.`.brightRed)
            continue;
          }
          if (pull.aliases && Array.isArray(pull.aliases)) pull.aliases.forEach((alias) => client.aliases.set(alias, pull.name));
        }catch(e){
          //console.log(String(e.stack).grey.bgRed)
        }
      }
    });
  } catch (e) {
    console.log(String(e.stack).grey.bgRed)
  }

  client.backupDB = new Enmap({ name: 'backups', dataDir: "./databases" });
 
  const { GiveawaysManager } = require('discord-giveaways');
  client.giveawayDB = new Enmap({ name: 'giveaways', dataDir: "./databases" });
  const GiveawayManagerWithOwnDatabase = class extends GiveawaysManager {
    async getAllGiveaways() {
        return client.giveawayDB.fetchEverything().array();
    }
    async saveGiveaway(messageId, giveawayData) {
        client.giveawayDB.set(messageId, giveawayData);
        return true;
    }
    async editGiveaway(messageId, giveawayData) {
        client.giveawayDB.set(messageId, giveawayData);
        return true;
    }
    async deleteGiveaway(messageId) {
        client.giveawayDB.delete(messageId);
        return true;
    }
  };
  
  const manager = new GiveawayManagerWithOwnDatabase(client, {
      default: {
          botsCanWin: false,
          embedColor: ee.color,
          embedColorEnd: ee.wrongcolor,
          reaction: '🎉'
      }
  });
  // We now have a giveawaysManager property to access the manager everywhere!
  client.giveawaysManager = manager;
  client.giveawaysManager.on("giveawayReactionAdded", async (giveaway, member, reaction) => {
    try {
      const isNotAllowed = await giveaway.exemptMembers(member);
      if (isNotAllowed) {
        member.send({
          embeds: [
            new MessageEmbed()
              .setColor(ee.wrongcolor)
              .setThumbnail(member.guild.iconURL({dynamic: true}))
              .setAuthor(`Missing the Requirements`, `https://cdn.discordapp.com/emojis/906917501986820136.png?size=128`)
              .setDescription(`> **Your are not fullfilling the Requirements for [this Giveaway](https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId}), please make sure to fullfill them!.**\n\n> Go back to the Channel: <#${giveaway.channelId}>`)
              .setFooter(member.guild.name, member.guild.iconURL({dynamic: true}))
          ]
        }).catch(() => {});
        reaction.users.remove(member.user).catch(() => {});
        return;
      }
      let BonusEntries = await giveaway.checkBonusEntries(member.user).catch(() => {}) || 0;
      if(!BonusEntries) BonusEntries = 0;
      member.send({
        embeds: [
          new MessageEmbed()
            .setColor(ee.color)
            .setThumbnail(member.guild.iconURL({dynamic: true}))
            .setAuthor(`Giveaway Entry Confirmed`, `https://cdn.discordapp.com/emojis/833101995723194437.gif?size=128`)
            .setDescription(`> **Your entry for [this Giveaway](https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId}) has been confirmed.**\n\n**Prize:**\n> ${giveaway.prize}\n\n**Winnersamount:**\n> \`${giveaway.winnerCount}\`\n\n**Your Bonus Entries**\n> \`${BonusEntries}\`\n\n> Go back to the Channel: <#${giveaway.channelId}>`)
            .setFooter(member.guild.name, member.guild.iconURL({dynamic: true}))
        ]
      }).catch(() => {});
      console.log(`${member.user.tag} entered giveaway #${giveaway.messageId} (${reaction.emoji?.name})`);
    } catch (e) {
      console.log(e);
    }
  });
  client.giveawaysManager.on("giveawayReactionRemoved", (giveaway, member, reaction) => {
    try {
      member.send({
        embeds: [
          new MessageEmbed()
            .setColor(ee.wrongcolor)
            .setThumbnail(member.guild.iconURL({dynamic: true}))
            .setAuthor(`Giveaway Left!`, `https://cdn.discordapp.com/emojis/833101995723194437.gif?size=128`)
            .setDescription(`> **You left [this Giveaway](https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId}) and aren't participating anymore.**\n\n> Go back to the Channel: <#${giveaway.channelId}>`)
            .setFooter(member.guild.name, member.guild.iconURL({dynamic: true}))
        ]
      }).catch(() => {});
      console.log(`${member.user.tag} left giveaway #${giveaway.messageId} (${reaction.emoji?.name})`);
    } catch (e) {
      console.log(e);
    }
  });
  client.giveawaysManager.on("giveawayEnded", (giveaway, winners) => {
    for(const winner of winners) {
      winner.send({
        contents: `Congratulations, **${winner.user.tag}**! You won the Giveaway.`,
        embeds: [
          new MessageEmbed()
            .setColor(ee.color)
            .setThumbnail(winner.guild.iconURL({dynamic: true}))
            .setAuthor(`Giveaway Won!`, `https://cdn.discordapp.com/emojis/833101995723194437.gif?size=128`)
            .setDescription(`> **You won [this Giveaway](https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId}), congrats!**\n\n> Go to the Channel: <#${giveaway.channelId}>\n\n**Prize:**\n> ${giveaway.prize}`)
            .setFooter(winner.guild.name, winner.guild.iconURL({dynamic: true}))
        ]
      }).catch(() => {});
    }
    console.log(`Giveaway #${giveaway.messageId} ended! Winners: ${winners.map((member) => member.user.username).join(', ')}`);
  });
  // This can be used to add features such as a congratulatory message per DM
  manager.on('giveawayRerolled', (giveaway, winners) => {
    for(const winner of winners) {
      winner.send({
        contents: `Congratulations, **${winner.user.tag}**! You won the Giveaway through a \`reroll\`.`,
        embeds: [
          new MessageEmbed()
            .setColor(ee.wrongcolor)
            .setThumbnail(winner.guild.iconURL({dynamic: true}))
            .setAuthor(`Giveaway Won!`, `https://cdn.discordapp.com/emojis/833101995723194437.gif?size=128`)
            .setDescription(`> **You won [this Giveaway](https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId}), congrats!**\n\n> Go to the Channel: <#${giveaway.channelId}>\n\n**Prize:**\n> ${giveaway.prize}`)
            .setFooter(winner.guild.name, winner.guild.iconURL({dynamic: true}))
        ]
      }).catch(() => {});
    }
  })
  console.log(`[x]:: `.magenta + `LOADED THE ${client.commands.size} COMMANDS after: `.brightGreen + `${Date.now() - dateNow}ms`.green)
};
/**
 * @DEVELOPMENT FOR PERICOLRPG (youtube.com/PericolRPG)
 */

