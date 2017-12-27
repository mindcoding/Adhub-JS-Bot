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
  }
}