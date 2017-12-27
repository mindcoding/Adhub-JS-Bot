const Discord = require('discord.js');
var openDB = require('json-file-db');
// Create an instance of a Discord client
const client = new Discord.Client();

// The token of your bot - https://discordapp.com/developers/applications/me
const token = 'your bot token here';

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
      client.fetchInvite(message.content.split(' ')[1]).then(g => {
        message.channel.send(g.guild.name);

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
