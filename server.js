const Discord = require('discord.js');
var openDB = require('json-file-db');
var db = openDB('Votes/voters.json'); 
var times = openDB('Votes/VoterTimes.json');
const client = new Discord.Client();
var fs = require('fs');
const mainId = "374670637077233675";
var mainGuild;
var mainChannel;
client.on('ready', () => {
  mainGuild = client.guilds.find(val => val.id == mainId);
  mainChannel = mainGuild.channels.find(val => val.name == "leaderboard");
});

client.on('message', message => {
  if(message.content === '/leaderBoard')
  {
     leaderBoard(message);
  }  
  if (message.content.substr(0, 5) === '/vote') {
    if(message.guild.id == mainId) 
    {
      times.get({id: parseInt(message.author.id)}, function(err, data) {
        var time;
        var good = false;
        if(data.length != 0)
        {
          time = new Date(data[0].lastTime);

        }
        else{
          time = new Date();
          good = true;
          console.log("Here");
        }
        console.log(time.getMilliseconds());
         
      if(daysBetween(new Date(), time) || good)        
      {
        if(fs.existsSync("Guild-Owners/" + message.mentions.members.first().id + ".txt"))
        {
          fs.readFile("Guild-Owners/" + message.mentions.members.first().id + ".txt", function(err,data){
            if(!err)
            {
              
              const guil = client.guilds.find(val => val.id == data);
              
              var temp;
              var obj;
              times.put({id: parseInt(message.author.id), lastTime: time.getTime()}, function(err) {});
   
              db.get({id: parseInt(message.author.id), server:guil.id}, function(err, data){
                try{
              console.log(JSON.stringify(data));                
                  temp = parseInt(JSON.stringify(data[0]).split(':')[3].split('}')[0]);
                  console.log(JSON.stringify(data[0]).split(':')[3].split('}')[0]);
                }catch(ex)
                {
                  temp = 0;
                }
                db.put({id: parseInt(message.author.id), server: guil.id, value: temp + 1}, function(err){
                 
                });                
                //console.log("Data is " + data[0].data);
                
                
              });
           
              var ser = openDB('Votes/server.json');             
              ser.get({id: parseInt(guil.id)}, function(err, data){
                var temp;
                if(data.length != 0)
                  temp = data[0].votes;
                else
                  temp = 0;
                ser.put({id: parseInt(guil.id), votes: temp+1}, function(err)
                {
                  leaderBoard();
                });
                
              });
  
            
                          //if(guil.)
              const channel = guil.channels.find('name', 'general');
              channel.send(message.author + " voted!");
              message.reply(" successfully voted!");

            }
          });        
        }else{
          message.reply(" there is no server on Adhub owned by " + message.mentions.members.first());
        }
      }else{
        message.reply(" you already voted on " + time)
      }
    });
    }
    
    
  }else{
    if(message.content.substr(1, 9) == 'adCommand')
    {
      var commands = openDB('Client-Server/commands.json');
      commands.get({id: parseInt(message.guild.id)}, function (err, data){
          commands.put({id: parseInt(message.guild.id), command: data + "\n" + message.content.substring(10)}, 
                function (err) {});          
      });
      
    }
  }
  if(message.content.substr(1, 5) == 'apply')
  {
    if(message.content.split(' ').length == 2)
    {
      client.fetchInvite(message.content.split(' ')[1]).then(g => {
    //g is a GuildAuditLogs
        message.channel.send(g.guild.name);
        //log is a GuildAuditLogsEntry
        //do stuff with log
      });
    }
  }  

});

client.on('guildCreate', guild => {
  
  fs.writeFile("Guild-Owners/" + guild.ownerId + ".txt", guild.id, function(err) {
      if(err) {
          return console.log(err);
      }
  
      console.log("The file was saved!");
  });   
  
});

client.on('guildMemberRemove', member => {
    var ser = openDB('Votes/server.json');             
    ser.get({id: parseInt(member.guild.id)}, function(err, data){
    var temp;
    if(data.length != 0)
      temp = data[0].votes;
    else
      temp = 0;
    db.get({id: parseInt(member.id), server:member.guild.id}, function(err, data){
      var temp1;
      try{
        temp1 = parseInt(JSON.stringify(data[0]).split(':')[3].split('}')[0]);
      }catch(ex)
      {
        temp1 = 0;
      }
      ser.put({id: parseInt(member.guild.id), votes: temp1-temp}, function(err){});      
    });      

  });  
  
});


function leaderBoard()
{
  fs.readFile("Votes/server.json", function (err, data)
  {
    var jsonObj = JSON.parse(data);
    jsonObj.sort(GetSortOrder('votes'));
    console.log(jsonObj);
    var servers = "";
    for(var i = jsonObj.length -1 > 5 ? 5 : jsonObj.length - 1 ; i>=0; i--) {
        client.guilds.find(val => val.id == jsonObj[i].id).fetchInvites().then(invites => 
        servers += invites.array()[0]);
    }
    console.log("SERVERS: " + servers);
    for(var i = jsonObj.length -1 > 5 ? 5 : jsonObj.length - 1 ; i>=0; i--)
    {
      servers += (i + 1) + ", " + client.guilds.find(val => val.id == jsonObj[i].id).name 
      + " " + jsonObj[i].votes;
      if(i != 0) servers += "\n";
    }
    mainChannel.fetchMessage('395319602676236288')
  .then(message => message.edit(servers));

  });
}

function GetSortOrder(prop) {  
    return function(a, b) {  
        if (a[prop] < b[prop]) {  
            return 1;  
        } else if (a[prop] > b[prop]) {  
            return -1;  
        }  
        return 0;  
    }  
}  

function daysBetween( date1, date2 ) {
  //Get 1 day in milliseconds
  var one_day=1000*60*60*24;

  // Convert both dates to milliseconds
  var date1_ms = date1.getTime();
  var date2_ms = date2.getTime();

  // Calculate the difference in milliseconds
  var difference_ms = date2_ms - date1_ms;
    
  // Convert back to days and return
  return difference_ms / one_day * 7 >= 7; 
}

client.login('Mzk0NjMxNjY0MDAyNzkzNDcy.DSHI5w.66jhjypls9GyDpJWZNupIuiM5_4');

dd(client);




const authors = [];
var warned = [];
var banned = [];
var messagelog = [];

/**
 * Add simple spam protection to your discord server.
 * @param  {Bot} bot - The discord.js CLient/bot
 * @param  {object} options - Optional (Custom configuarion options)
 * @return {[type]}         [description]
 */
  // Set options
const warnBuffer = 3;
const maxBuffer = 5;
const interval = 1000;
const warningMessage = "Please cease your spamming!";
const banMessage = "did not cease and disest there activities";
const maxDuplicatesWarning = 7;
const maxDuplicatesBan = 10;

function dd(bot)
{
  bot.on('message', msg => {
  
    if(msg.author.id != bot.user.id){
      var now = Math.floor(Date.now());
      authors.push({
        "time": now,
        "author": msg.author.id
      });
      messagelog.push({
        "message": msg.content,
        "author": msg.author.id
      });
  
      // Check how many times the same message has been sent.
      var msgMatch = 0;
      for (var i = 0; i < messagelog.length; i++) {
        if (messagelog[i].message == msg.content && (messagelog[i].author == msg.author.id) && (msg.author.id !== bot.user.id)) {
          msgMatch++;
        }
      }
      // Check matched count
      if (msgMatch == maxDuplicatesWarning && !warned.includes(msg.author.id)) {
        warn(msg, msg.author.id);
      }
      if (msgMatch == maxDuplicatesBan && !banned.includes(msg.author.id)) {
        ban(msg, msg.author.id);
      }
  
      var matched = 0;
      
      for (var i = 0; i < authors.length; i++) {
        if (authors[i].time > now - interval) {
          matched++;
          if (matched == warnBuffer && !warned.includes(msg.author.id)) {
              warn(msg, msg.author.id);
          }
          else if (matched == maxBuffer) {
            if (!banned.includes(msg.author.id)) {
              ban(msg, msg.author.id);
            }
          }
        }
         else if (authors[i].time < now - interval) {
           authors.splice(i);
           warned.splice(warned.indexOf(authors[i]));
           banned.splice(warned.indexOf(authors[i]));
         }
         if (messagelog.length >= 200) {
           messagelog.shift();
         }
      }
    }
  });
  
    /**
     * Warn a user
     * @param  {Object} msg
     * @param  {string} userid userid
     */
  function warn(msg, userid) {
    warned.push(msg.author.id);
    msg.channel.send(msg.author + " " + warningMessage);
  }
  
  
  function ban(msg, userid) {
    for (var i = 0; i < messagelog.length; i++) {
      if (messagelog[i].author == msg.author.id) {
        messagelog.splice(i);
  
      }
    }
  
    banned.push(msg.author.id);
  
      var role = msg.guild.roles.find(val => val.name == "Adhub-Mute");
      msg.guild.members.find(val => val.id == msg.author.id).addRole(role);
      setTimeout(function()
      {
        msg.guild.members.find(val => val.id == msg.author.id).removeRole(role);
        msg.reply("Mute is up, please do not spam");
      }, 300000);
      
      msg.reply(" did not cease and desist");
  }
}
