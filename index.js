const Discord = require('discord.js'); 
const dl = require('discord-leveling');
const client = new Discord.Client();
const Giveaway = require("discord.js-giveaway")
 
const giveaway = Giveaway(client, {})

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setActivity('help: *help', {type:"WATCHING"})
});

client.on('message', message => {
  if (message.content.startsWith('*helpstaff')) {
    const member = message.mentions.members.first()
    if (!message.member.hasPermission('ADMINISTRATION')) {
      return message.channel.send("Tu na pas les drois de faire cette commands !!")
    }
    if (!member) {
      return message.channel.send({embed: {
        color: 3447003,
        author: {
          name: client.user.username,
          icon_url: client.user.avatarURL
        },
        title: 'Help Staff pour le bot',
        description: 'Commandes du bot',
        fields: [
          {
            name: "*delete",
            value: "Delete l'xp du jouer mentioner."
          },
          {
            name: "*giveaway",
            value: "Permais de faire des giveaway."
          
        ],
        timestamp: new Date(),
        footer:{
          text: ''
        }
      }})
    }
  }
})
client.on('message', msg => {
  if (msg.content === "*help"){
    msg.channel.send({embed: {
      color: 3447003,
      author: {
        name: client.user.username,
        icon_url: client.user.avatarURL
      },
      title: 'Help pour le bot',
      description: 'Commandes du bot',
      fields: [
        {
          name: "*profile",
          value: "Montre ton level et ton xp."
        },
        {
          name: "*leaderboard",
          value: "Commande désactivée jusqu'à que l'on le règle."
        },
      ],
      timestamp: new Date(),
      footer:{
        text: ''
      }
    }})
  }
})

client.on('message', async message => {
  const settings = {
    prefix: '*',
  }
 
  
  var command = message.content.toLowerCase().slice(settings.prefix.length).split(' ')[0];
 
  
  var args = message.content.split(' ').slice(1);
 
  
  if (message.author.bot) return;
 
  
  var profile = await dl.Fetch(message.author.id)
  dl.AddXp(message.author.id, 10)
  
  if (profile.xp + 10 > 1000) {
    await dl.AddLevel(message.author.id, 1)
    await dl.SetXp(message.author.id, 0)
    message.channel.send({embed: {
      color: 3447003,
      author: {
        name: message.author.username,
        icon_url: message.author.avatarURL,
      },
      title: `Tu es passer ${profile.level + 1}`,
      description: `GG a toi`,
      timestamp: new Date(),
      footer:{
        text: ''
      }
    }})
  }
 
  if (!message.content.startsWith(settings.prefix)) return;
 
  if (command === 'profile') {
 
    var user = message.mentions.users.first() || message.author
 
    var output = await dl.Fetch(user.id)
    message.channel.send({embed: {
        color: 000255,
        author: {
          name: `${user.tag}`,
          icon_url: `${user.avatarURL}`,
        },
        title: 'Ton level',
        description: `tu as ${output.level} levels`,
        fields: [
          {
            name: "Ton xp",
            value: `tu as ${output.xp} Sur 1000 Xp`
          }
        ],
        timestamp: new Date(),
        footer:{
          text: ''
        }
      }})
    }
 
  if (command === 'leaderboardstaff') {
 
    
    if (message.mentions.users.first()) {
 
      var output = await dl.Leaderboard({
        search: message.mentions.users.first().id
      })
      message.channel.send(`The user ${message.mentions.users.first().tag} is number ${output.placement} on my leaderboard!`);
 
      
    } else {
 
      dl.Leaderboard({
        limit: 3
      }).then(async users => { 
 
        var firstplace = await client.fetchUser(users[0].userid) 
        var secondplace = await client.fetchUser(users[1].userid) 
        var thirdplace = await client.fetchUser(users[2].userid) 
 
        message.channel.send(`My leaderboard:
 
1 - ${firstplace.tag} : ${users[0].level} : ${users[0].xp}
2 - ${secondplace.tag} : ${users[1].level} : ${users[1].xp}
3 - ${thirdplace.tag} : ${users[2].level} : ${users[2].xp}`)
 
      })
 
    }
  }
 
  if (command == 'delete') { 

 
    var user = message.mentions.users.first()
    if (!user) return message.reply('Pls, Specify a user I have to delete in my database!')
 
    if (!message.guild.me.hasPermission(`ADMINISTRATION`)) return message.reply('You need to be admin to execute this command!')
 
    var output = await dl.Delete(user.id)
    if (output.deleted == true) return message.reply('Succesfully deleted the user out of the database!')
 
    message.reply('Error: Could not find the user in database.')
 
  }
 
})

client.login(process.env.TOKEN)