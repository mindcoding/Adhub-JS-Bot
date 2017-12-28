const Discord = require('discord.js');
var openDB = require('json-file-db');
// Create an instance of a Discord client
const client = new Discord.Client();
const config = require("./config.json");
// The token of your bot - https://discordapp.com/developers/applications/me
const token = config.token;

// The ready event is vital, it means that your bot will only start reacting to information
// from Discord _after_ ready is emitted
client.on('ready', () => {
  console.log('I am ready!');
});

// Create an event listener for messages
client.on('message', message => {
  // If the message is "ping"
  if(message.content.substr(1, 11) == 'testcommand')
  {
    message.channel.send("This is how messages *should* look!");
  }
  if (message.content.substr(1, 4) === 'ping') {
    // Send "pong" to the same channel
    message.channel.send('pong');
  }
  if(message.content.substr(1, 4) == 'warn')
  {
    var args = message.content.substr(' ');
    if(args[0] != '/warn') return;
    if(message.member.roles.some(r=>["DC | Moderators", "DC | Admin", "AdHub | Board of Directors"].includes(r.name)))
    {
      var warns = openDB('warns.json'); 
      warns.get({id: parseInt(message.mentions.first().id)}, function(err, data) {
        var warnings;
        if(data == undefined || data[0] == undefined)
        {
          warnings = data[0].warn;
        }else
        {
          warnings = 0;
        }
        warns.put({id: message.mentions.first().id, warn: warnings});
      });
    }
  }
  if(message.content.split(' ')[0] == 'checkWarnings')
  {
    if(message.member.roles.some(r=>["DC | Moderators", "DC | Admin", "AdHub | Board of Directors"].includes(r.name)))
    {
      var warns = openDB('warns.json');
      warns.get({id: parseInt(message.mentions.first().id)}, function(err, data) {
        if(data.length > 0)
          return message.channel.send("User has been warned " + data[0].warn);
        else
          message.channel.send("This user has not received any warnings");
      });
    }else {
      message.reply(" you do not have permissions to check warnings");
    }
  }
  if(message.content.substr(1, 8) == 'shutdown')
  {
    if(!message.author.id == "118455061222260736")
    {
      message.channel.send("Nice try m8");
    }else
    {
      client.destroy();
    }
  }
  if(message.content.substr(1, 9) == 'sendEmbed')
  {
    if(message.author.id == "118455061222260736")
    {
      message.channel.send(message.content.substring(11));
    }
  }
  if(message.content.substr(1, 3) == 'ban')
  {
    var args = message.content.split(' ');
    if(args[0] != '/ban') return;
    if(!message.member.roles.some(r=>["DC | Admin", "AdHub | Board of Directors"].includes(r.name)) )    
    {
      message.channel.send("You do not have permissions to ban");
    }else
    {
      message.guild.ban(message.mentions.members.first());
    }
  }
  if(message.content.substr(1, 4) == 'mute')
  {
    if(!message.member.roles.some(r=>["DC | Moderators", "DC | Admin", "AdHub | Board of Directors"].includes(r.name)) )    
    {
      message.channel.send("You do not have permissions to mute");
    }else
    {
      var role = message.guild.roles.find(val => val.name == "Adhub-Mute");
      message.guild.members.find(val => val.id == message.author.id).addRole(role);
    }
  } 
  if(message.content.substr(1, 5) == 'unban')
  {
    if(!message.member.roles.some(r=>["DC | Admin", "AdHub | Board of Directors"].includes(r.name)) )    
    {
      message.channel.send("You do not have permissions to unban");
    }else
    {
      message.guild.unban(message.mentions.members.first());
    }
  }
  if(message.content.substr(1, 6) == 'unmute')
  {
    if(!message.member.roles.some(r=>["DC | Moderators", "DC | Admin", "AdHub | Board of Directors"].includes(r.name)) )    
    {
      message.channel.send("You do not have permissions to unmute");
    }else
    {
      var role = message.guild.roles.find(val => val.name == "Adhub-Mute");
      message.guild.members.find(val => val.id == message.author.id).removeRole(role);
    }
  }   
  if(message.content.substr(1, 17) == 'overrideChanPerms')
  {
    if(message.author.id == "118455061222260736")
    {
      var channels = message.mentions.channels;
    }
  }
  if(message.content.substr(1, 5) == 'apply')
  {
    if(message.content.split(' ').length == 2)
    {
      try {
      client.fetchInvite(message.content.split(' ')[1]).then(g => {
        message.channel.send(g.guild.name);
      }catch(err)
      {
        message.reply(" sorry the code you provided is not valid.");
      }
      });
    }
  }
  if(message.content.substr(1, 6) == 'review')
  {
    var add = openDB("review.json");
    var arr = message.content.split(' ');
    var revie = "";
    for(var i = 2; i<arr.length; i++)
    {
        revie += arr[i];
        if(arr.length - 1 != i)
            revie += " ";
    }
    client.fetchInvite(message.content.split(' ')[1]).then(g => {
        console.log("PLEASE READ THIS: " + message.content.split(' ')[1]);
        add.put({id: g.guild.id, name: g.guid.name}, function(err) {});
    });
  }
});

// Log our bot in
client.login(token);
