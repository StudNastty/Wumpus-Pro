const botconfig = require("./botconfig.json");
const Discord = require("discord.js");
const errors = require("./utils/errors.js")
const token = proces.env.token;
const fs = require("fs");
const ms = require("ms");
let mutes = JSON.parse(fs.readFileSync("./mutes.json", "utf8"));
let unmutes = JSON.parse(fs.readFileSync("./unmutes.json", "utf8"));
const bot = new Discord.Client({disableEveryone: true});
bot.commands = new Discord.Collection();
let coins = require('./coins.json');
let warns = JSON.parse(fs.readFileSync("./warnings.json", "utf8"));








fs.readdir("./commands/", (err, files) => {

  if(err) console.log(err)
  let jsfile = files.filter(f => f.split(".").pop() === "js")
  if(jsfile.lenght <= 0){
    console.log("Couldn't find command!")
    return;
  }

  jsfile.forEach((f, i) =>{
    let props = require(`./commands/${f}`);
    console.log(`${f} loaded!😀`);
    bot.commands.set(props.help.name, props);
  });
});



bot.on("ready", async () => {
  console.log(`${bot.user.username} loged at ${bot.guilds.size} servers!`);
  bot.user.setActivity("with Wumpus || h", {type:"WATCHING"});

});

  bot.on("guildMemberAdd", async member => {
    console.log(`${member.id} joined the server.`);

    let welcomechannel = member.guild.channels.find(`name`, "welcome_leave");
    welcomechannel.send(`Look out everyone! ${member} has joined to party`);

  });
  bot.on("guildMemberRemove", async member => {
    console.log(`${member.user.username} left the server.`);

    let welcomechannel = member.guild.channels.find(`name`, "welcome_leave");
    welcomechannel.send(`Good Riddance!  ${member} has bailed on the server`);

  });
  bot.on("channelCreate", async channel => {
    console.log(`${channel.name} has been created.`);

    let sChannel = channel.guild.channels.find(`name`, "wumpuslog");
    let ccEmbed = new Discord.RichEmbed()
    .setDescription("Create Channel")
    .setColor('RANDOM')
    .addField(`${channel.name} has been created!`, channel.createdAt);

    sChannel.send(ccEmbed);
  });

  bot.on("channelDelete", async channel => {
    console.log(`${channel.name} has been created.`);

    let sChannel = channel.guild.channels.find(`name`, "wumpuslog");
    let delEmbed = new Discord.RichEmbed()
    .setDescription("Delete Channel")
    .setColor('RANDOM')
    .addField(`${channel.name} has been deleted!`, "*End Embed*");

    sChannel.send(delEmbed);
  });


bot.on("message", async message => {
  if(message.author.bot) return;
  if(message.channel.type === "dm") return;


  let prefixes = JSON.parse(fs.readFileSync("./prefixes.json", "utf8"));
  if(!prefixes[message.guild.id]){
    prefixes[message.guild.id] = {
      prefixes: botconfig.prefix
    };
  }



  let prefix  = prefixes[message.guild.id].prefixes;
  //let prefix = botconfig.prefix
  let messageArray = message.content.split(" ");
  let cmd = messageArray[0]
  let args = messageArray.slice(1);

   let commandfile = bot.commands.get(cmd.slice(prefix.lenght));
   if (commandfile) commandfile.run(bot,message,args);




  if(!coins[message.author.id]){
    coins [message.author.id] = {
      coins: 0
    };
  }

  bot.on('message', message => {
    if (cmd === `${prefix}avatar`) {
      const member = message.mentions.members.first();
      let embed = new Discord.RichEmbed()
    .setImage(message.member.avatarURL)
    .setColor('#275BF0')
      message.channel.send(embed)
    }
  });

  if(cmd === `${prefix}`){
  let coinAmt = Math.floor(Math.random() * 1)+ 15;
  let baseAmt = Math.floor(Math.random() * 1)+ 15;
  console.log(`${coinAmt} ; ${baseAmt}`);

if(coinAmt === baseAmt ){
  coins[message.author.id] = {
    coins: coins[message.author.id].coins + coinAmt
  };
  fs.writeFile("./coins.json", JSON.stringify(coins), (err) => {
    if(err) console.log(err)
  });
  let coinEmbed = new Discord.RichEmbed()
  .setDescription("MONEY")
  .setAuthor(message.author.username)
  .setColor('RANDOM')
  .addField("💰", `${coinAmt} coin added!`);

  message.channel.send(coinEmbed).then(msg => {msg.delete(5000)});
}

  }

if(cmd === `${prefix}scount`){
  message.reply(`${bot.user.username} logined at ${bot.guilds.size} servers!`)
}

  if(cmd === `${prefix}support`){
    message.reply("https://discord.gg/AtCPWM9")
  }


if(cmd === `invite`){
  message.reply("Okey, https://discordapp.com/oauth2/authorize?client_id=489122808652103680&permissions=8&scope=bot ");
  try {
    let link = await bot.generateInvite(["ADMINISTRATOR"]);
    console.log(link);
  } catch(e) {
    console.log(e.stack);
  }
}




if(cmd === `${prefix}coins`){
  if(!coins[message.author.id]){
    coins [message.author.id] = {
      coins: 0
    };
  }
  let uCoins = coins[message.author.id].coins;

  let coinEmbed = new Discord.RichEmbed()
  .setAuthor(message.author.username)
  .setColor("#00000F")
  .addField("💰", uCoins);

  message.channel.send(coinEmbed).then(msg => {msg.delete(5000)});
};




if(cmd === `${prefix}setrole`){
 

  if(!message.member.hasPermission("MANAGE_MEMBERS")) return message.reply("Sorry pal, you can't do that.");
  let pMember = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
  if(!pMember) return message.reply("Couldn't find rhat user, yo.");
  let role = args.join(" ").slice(22);
  if(!role) return message.reply("Specify a role!");
  let gRole = message.guild.roles.find(`name`, role)
  if(!gRole) return message.reply("Couldn't find that role.");;

  if(pMember.roles.has(gRole.id))("They have already role!");
  await(pMember.addRole(gRole.id));

  try{
  await    pMember.send(`Congrats to <@${pMember.id}> have been given the role ${gRole.name}. We tried to DM them, but their DMs are locked!`);
  }catch(e){
  message.channel.send(`Congrats to <@${pMember.id}> have been given the role ${gRole.name}.`);
  }
}

if(cmd === `${prefix}remrole`){

  if(!message.member.hasPermission("MANAGE_MEMBERS")) return message.reply("Sorry pal, you can't do that.");
  let iMember = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
  if(!iMember) return message.reply("Couldn't find rhat user, yo.");
  let role = args.join(" ").slice(22);
  if(!role) return message.reply("Specify a role!");
  let sRole = message.guild.roles.find(`name`, role)
  if(!sRole) return message.reply("Couldn't find that role.");;

  if(iMember.roles.has(sRole.id));
  await(iMember.removeRole(sRole.id));

  let remEmbed = new Discord.RichEmbed()
  .setTitle("Remove role")
  .setColor('RANDOM')
  .addField(`RIP  to ${iMember.user.username} have been remove the role ${sRole.name}.`, "I don't know...Maybe this error!");

  try{
  await    iMember.send(`RIP to <@${iMember.id}> have been remove the role ${sRole.name}. We tried to DM them, but their DMs are locked!`);
  }catch(e){
  message.channel.send(remEmbed);
  }
}


  if(cmd === `config`){
    let configEmbed = new Discord.RichEmbed()
    .setDescription("Config from Wumpus")
    .setColor('RANDOM')
    .addField("`For set welcome, create channel:` 'welcome_leave'")
    .addField("`For set log, create channel:` 'wumpuslog'")
    .addField("`For set report, create channel:` 'reports' ")
    .addField("`For warn, create role:` 'muted'")
    .addField("`For modinator log, create channel:` 'incidents'");
    message.channel.send(configEmbed);
  }

   if(cmd === `help`){

    let helpEmbed = new Discord.RichEmbed()
    .setColor('RANDOM')
    .addField("Prefix - Work", "prefserver")
    .addField("Mod help - Work", "mod")
    .addField("`Report` - Work", `${prefix}report`)
  .addField("`Hello` - Work", `${prefix}hello`)
    .addField("`Server info` - Work", `${prefix}serverinfo`)
    .addField("`Bot Info` - Work", `${prefix}botinfo`)
    .addField("`8b` - Work", `${prefix}8b`)
    .addField("`!say` - Work", `${prefix}say`)
    .addField("`Help warn` - Work", `${prefix}hw`)
    .addField("`Help report` - Work", `${prefix}hr`)
    .addField("`Update` - Work", `${prefix}update`)
    .addField("`Support` - Work", `${prefix}support`)
    .addField("        ` Author`: Famas_4sh", message.createdAt);

    return message.channel.send(helpEmbed);
  };



   

  if(cmd === `mod`){

    let helpEmbed = new Discord.RichEmbed()
    .setTitle("HELP MOD")
    .setColor('RANDOM')
    .addField("Config bot - Work", "Please write this command first 'config' ")
    .addField("Mute - Work", `${prefix}mute <@user> <reason>`)
    .addField("Unmute - Work", `${prefix}unmute <@user>`)
    .addField("Server id - Work ", `${prefix}serverid`)
    .addField("Report - Work", `${prefix}report`)
    .addField("User id - Work", `${prefix}userid <@user>`)
    .addField("Warn - Work", `${prefix}warn <@user> <Reason>`)
    .addField("Warn level - Work", `${prefix}warnlevel <@user>`)
    .addField("Kick - Work", `${prefix}kick`)
    .addField("Ban - Work", `${prefix}ban <@user>`)
    .addField("Clear - Work", `${prefix}clear `)
    .addField("Setrole - Work", `${prefix}setrole <@user> <role>`)
    .addField("Remove role - Work", `${prefix}remrole <@User> <role>`)
    .addField("        ` Author`: Famas_4sh", "Famas_4sh");

    return message.channel.send(helpEmbed);
  };


  if(cmd === `h`){

    let helpEmbed = new Discord.RichEmbed()
    .setColor('RANDOM')
    .addField("Prefix - Work", "prefserver")
    .addField("Mod help - Work", "mod")
    .addField("`Report` - Work", `${prefix}report`)
  .addField("`Hello` - Work", `${prefix}hello`)
    .addField("`Server info` - Work", `${prefix}serverinfo`)
    .addField("`Bot Info` - Work", `${prefix}botinfo`)
    .addField("`8b` - Work", `${prefix}8b`)
    .addField("`!say` - Work", `${prefix}say`)
    .addField("`Help warn` - Work", `${prefix}hw`)
    .addField("`Help report` - Work", `${prefix}hr`)
    .addField("`Update` - Work", `${prefix}update`)
    .addField("`Support` - Work", `${prefix}support`)
    .addField("        ` Author`: Famas_4sh", message.createdAt);

    return message.channel.send(helpEmbed);
  };


  if(cmd === `${prefix}report`){
    message.delete();
    let rUser = message.guild.member(message.mentions.users.first() || msd.guild.members.get(args[0]));
    if(!rUser) return message.channel.send("Couldn't find user.");
    let reason = args.join(" ").slice(22);

    let reportEmbed = new Discord.RichEmbed()
      .setDescription("Reports")
      .setColor("#15f152")
      .addField("Reported User", `${rUser} with ID: ${rUser.id}`)
      .addField("Reported By", `${message.author} with ID: ${message.author.id}`)
      .addField("Channel", message.channel)
      .addField("Time", message.createdAt)
      .addField("Reason", reason);

      let reportschannel = message.guild.channels.find(`name`, "reports");
      if(!reportschannel) return message.channel.send("Couldn't find reports channel.");

      reportschannel.send(reportEmbed);
      message.member.send("Your report delivered! This example:", reportEmbed)
  }

if(cmd === `${prefix}prefix`){
  if(!message.member.hasPermission("MANAGE_SERVER")) return message.reply("No no no.");


     let prefixes = JSON.parse(fs.readFileSync("./prefixes.json", "utf8"));

     prefixes[message.guild.id] = {
       prefixes: args[0]
     };

     fs.writeFile("./prefixes.json", JSON.stringify(prefixes), (err) => {
       if (err) console.log(err)
     });

     



     message.channel.send(`***New prefix set, "prefserver" to see prefix now, last prefix***: ${prefix}`);
}

if(cmd === `prefserver`){
  message.reply(`Prefix: ${prefix}`)
}
/*if(cmd === `${prefix}testban`){
  message.delete();
  if(!message.member.hasPermission("BAN_MEMBERS")) return errors.noPerms(message, "BAN_MEMBERS");
  if(args[0] == "help"){
    message.reply("Usage: !ban <user> <reason>");
    return;
  }
  let bUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
  if(!bUser) return errors.cantfindUser(message.channel);
  if(bUser.id === bot.user.id) return errors.botuser(message);
  let bReason = args.join(" ").slice(22);
  if(!bReason) return errors.noReason(message.channel);
  if(bUser.hasPermission("MANAGE_MESSAGES")) return errors.equalPerms(message, bUser, "MANAGE_MESSAGES");

  let banEmbed = new Discord.RichEmbed()
  .setDescription("~Ban~")
  .setColor("#bc0000")
  .addField("Banned User", `${bUser} with ID ${bUser.id}`)
  .addField("Banned By", `<@${message.author.id}> with ID ${message.author.id}`)
  .addField("Banned In", message.channel)
  .addField("Time", message.createdAt)
  .addField("Reason", bReason);


  let incidentchannel = message.guild.channels.find(`name`, "incidents");
  if(!incidentchannel) return message.channel.send("Can't find incidents channel.");

  message.guild.member(bUser).ban(bReason);
  incidentchannel.send(banEmbed);
}*/

if(cmd === `${prefix}hello`){
  return message.channel.send("Hello");

}







  if(cmd === `${prefix}clear`){
    let logchannel = message.guild.channels.find(`name`, "wumpuslog");
    if(!logchannel) return message.channel.send("Can't find wumpus log channel.");
    if(!message.member.hasPermission("MANAGE_MESSAGES")) return errors.noPerms(message, "MANAGE_MESSAGES");
    if(!args[0]) return message.channel.send("oof.");
    message.channel.bulkDelete(args[0]).then(() => {
        logchannel.send(`Cleared ${args[0]} messages.`).then(msg => message.delete(5000))
    });
  };

  if(cmd === `${prefix}ban`){
    let reason = args.slice(1).join(' ')
    let user = message.mentions.users.first();
    if(reason.length < 1) return message.reply("You must supply a reason of the ban!");
    if(message.mentions.users.size < 1) return message.reply('You must mentions someone to ban them').catch(console.error);
    let incidentchannel = message.guild.channels.find(`name`, "incidents");
    if(!incidentchannel) return message.channel.send("Can't find incidents channel.");


    if(!message.guild.member(user).bannable) return message.reply("No.");
    message.guild.ban(user, 2);

    const banw = new Discord.RichEmbed()
    .setDescription("Function")
    .setColor('RANDOM')
    .setTimestamp()
    .addField("Action", "Ban")
    .addField("User:", `${user.username}#${message.author.discriminator}`)
    .addField("Moderator", `${message.author.username}#${message.author.discriminator}`);

    message.reply(`User ${user.username} has banned <:BanHammer:498911349061976074>`)
  user.send(`You banned in ${message.guild.name}, reason: ${reason}`)
    return incidentchannel.send(banw);
    

  };

  if(cmd === `${prefix}kick`){

    let reason = args.slice(1).join(' ');
    let user = message.mentions.users.first();
    let incidentchannel = message.guild.channels.find(`name`, "incidents");
    if(!incidentchannel) return message.channel.send("Can't find incidents channel.");
    if (reason.length < 1) return message.reply('You must supply a reason for the kick.');
    if (message.mentions.users.size < 1) return message.reply('You must mention someone to kick them.').catch(console.error);
  
    if (!message.guild.member(user).kickable) return message.reply('I cannot kick that member');
    message.guild.member(user).kick();
  
    const embed = new Discord.RichEmbed()
      .setColor(0x00AE86)
      .setTimestamp()
      .addField('Action:', 'Kick')
      .addField('User:', `${user.username}#${user.discriminator} (${user.id})`)
      .addField('Modrator:', `${message.author.username}#${message.author.discriminator}`)
      .addField('Reason', reason);

      user.send(`You kicked from ${message.guild.name}, reason : ${reason}`)
      message.reply("***User has kicked!***")
    return bot.channels.get(incidentchannel.id).sendEmbed(embed);
    
  };

  if(cmd === `${prefix}unban`){
    let reason = args.slice(1).join(' ')
    let user = args[0];
    if(reason.length < 1) return message.reply("You must supply a reason of the unban!");
    if(!user) return message.reply('You must supply a user UserResolvable, such a Userid!').catch(console.error);
    message.guild.unban(user);
    let incidentchannel = message.guild.channels.find(`name`, "incidents");
    if(!incidentchannel) return message.channel.send("Can't find incidents channel.");


    const unban = new Discord.RichEmbed()
    .setColor('RANDOM')
    .setTimestamp()
    .addField("Action", "Unban")
    .addField("User:", `${user.username}#${message.author.discriminator}`)
    .addField("Moderator", `${message.author.username}#${message.author.discriminator}`);

    message.reply(`This user unbanned !`);
    user.search(`You unbanned in ${message.guild.name}, reason: ${reason}`);
    return incidentchannel.send(unban);

  };
  

 if(cmd === `${prefix}avatar`){
  var data = await bot.funcs.userSearch(msg, {user: [user], name: this.help.name});
    
  if (data.valid !== false) { 
     bot.users.fetch(data.user[0].id).then(avatar => { msg.channel.send("", { files: [avatar.displayAvatarURL()]}); }); 
  }
 }

  if(cmd === `${prefix}lockdown`){
    if(!message.member.hasPermission("MANAGE_GUILD")) return errors.noPerms(message, "MANAGE_GUILD");
    if (!bot.lockit) bot.lockit = [];
    let time = args.join(' ');
    let validUnlocks = ['release', 'unlock'];
    if (!time) return message.reply('You must set a duration for the lockdown in either hours, minutes or seconds');
  
    if (validUnlocks.includes(time)) {
      message.channel.overwritePermissions(message.guild.id, {
        SEND_MESSAGES: null
      }).then(() => {
        message.channel.sendMessage('Lockdown lifted.');
        clearTimeout(bot.lockit[message.channel.id]);
        delete bot.lockit[message.channel.id];
      }).catch(error => {
        console.log(error);
      });
    } else {
      message.channel.overwritePermissions(message.guild.id, {
        SEND_MESSAGES: false
      }).then(() => {
        message.channel.sendMessage(`Channel locked down for ${ms(ms(time), { long:true })}`).then(() => {
  
          bot.lockit[message.channel.id] = setTimeout(() => {
            message.channel.overwritePermissions(message.guild.id, {
              SEND_MESSAGES: null
            }).then(message.channel.sendMessage('Lockdown lifted.')).catch(console.error);
            delete bot.lockit[message.channel.id];
          }, ms(time));
  
        }).catch(error => {
          console.log(error);
        });
      });
    }
  };

if(cmd === `${prefix}createrole`){
  message.reply("In Developing")
}

/*if(cmd === `${prefix}mute`){
  let reason = args.slice(1).join(' ')
    let user = message.mentions.users.first();
    let Muterole = bot.guilds.get(message.guild.id).roles.find(`name`, "muted")
    let incidentchannel = message.guild.channels.find(`name`, "incidents");
    let wumpuslog = message.guild.channels.find(`name`, "wumpuslog");
    if(!incidentchannel) return message.channel.send("Can't find incidents channel.");
    if(!Muterole) return message.reply("I cannot find muted role!");
    if(reason.length < 1) return message.reply("You must supply a reason of the mute!");
    if(message.mentions.users.size < 1) return message.reply('You must mentions someone to mute them').catch(console.error);

    const muteEmbed = new Discord.RichEmbed()
    .setDescription("Function")
    .setColor('RANDOM')
    .setTimestamp()
    .addField("Action", "Mute")
    .addField("User:", `${user.username}#${message.author.discriminator}`)
    .addField("Moderator", `${message.author.username}#${message.author.discriminator}`)
    .addField("User Id:", user.id)
    .addField("Moderator Id:", message.author.id);

if(!message.guild.member(bot.user).hasPermission("MANAGE_ROLES_OR_PERMISSIONS")) return message.react("I do not have correct permissions.").catch(console.error);

if(message.guild.member(user).roles.has(Muterole.id)) {
  message.guild.member(user).removeRole(Muterole).then() => {
    bot.channels.get(incidentchannel.id).sendEmbed(muteEmbed).catch(console.error);
  };

}else{
  message.guild.member(user).addRole(Muterole).then(() => {
    bot.channels.get(incidentchannel.id).sendEmbed(muteEmbed).cath(console.error)
  })

}

    incidentchannel.send(muteEmbed);
   // wumpuslog.send("User has been muted", `${user.username}#${message.author.discriminator}`)

}*/

  if(cmd === `${prefix}say`){
  //if(message.member.hasPermission("  ")) return message.reply("No");
    let botmessage = args.join(" ");
    message.delete().catch();
    message.channel.send(botmessage);
}

  if(cmd === `${prefix}userid`){
    let kiUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    if(!kiUser) return errors.cantfindUser(message.channel);
    message.reply(`User id: ${kiUser.id}`);
  }

 

  if(cmd === `${prefix}serverid`){
    message.reply(`Server id: ${message.guild.id}`)
  }

if(cmd === `${prefix}8ball`){
  if(!args[2]) return message.reply("Please ask a full question!");
      let replies = ["Yes.", "No.","Maybe.", " I don't know.", "Ask later."];
      let result = Math.floor((Math.random() * replies.length));
      let question = args.slice(0).join(" ");


      let ballEmbed = new Discord.RichEmbed()
      .setAuthor(message.author.tag)
      .setColor("#aaaaaa")
      .addField("Question", question)
      .addField("Answer", replies[result]);

      message.channel.send(ballEmbed);
  };
  if(cmd === `${prefix}botinfo`){

    let bicon = bot.user.avatarURL;
    let botEmbed = new Discord.RichEmbed()
    .setDescription("Bot Information")
    .setColor('RANDOM')
    .setThumbnail(bicon)
    .addField("Bot Name", bot.user.username)
    .addField("Created At", bot.user.createdAt);

    return message.channel.send(botEmbed);
  }

  if(cmd === `${prefix}testmute`){
   message.reply("In developing!")
  }

  if(cmd === `${prefix}warn`){
    message.delete();
    if(!message.member.hasPermission("WARN_MEMBERS")) return errors.noPerms(message, "WARN_MEMBERS");
    if(args[0] == "help"){
      message.reply("Usage: !warn <user> <reason>");
      return;
    }
    let warns = JSON.parse(fs.readFileSync("./warnings.json", "utf8"));
   // if(!message.member.hasPermission("MANAGE_MEMBERS")) return message.reply("No can do pal!");
    let wUser = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0])
    if(!wUser) return message.reply("Couldn't find them yo");
    if(wUser.hasPermission("MANAGE_MESSAGES")) return message.reply("They waaaay too kewl");
    let reason = args.join(" ").slice(22);
     if(!warns[wUser.id]) warns[wUser.id] = {
      warns: 0
    };
     warns[wUser.id].warns++;
     fs.writeFile("./warnings.json", JSON.stringify(warns), (err) => {
      if (err) console.log(err)
    });
     let warnEmbed = new Discord.RichEmbed()
    .setDescription("Warns")
    .setAuthor(message.author.username)
    .setColor("#fc6400")
    .addField("Warned User", `<@${wUser.id}>`)
    .addField("Warned In", message.channel)
    .addField("Number of Warnings", `${warns[wUser.id].warn}`)
    .addField("Reason", reason);
     let warnchannel = message.guild.channels.find(`name`, "incidents");
    if(!warnchannel) return message.reply("Couldn't find channel");
     warnchannel.send(warnEmbed);
     message.reply(`***User has warned! Reason: ${reason}***`);
     wUser.send(`You warned in server *${message.guild.name}* reason : ${reason}`);

  }




  if(cmd === `${prefix}warnlevel`){
    if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply("You can't do that.");
    let wUser = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0])
    if(!wUser) return message.reply("Couldn't find them yo");
    let warnlevel = warns[wUser.id].warns;

    message.reply(`<@${wUser.id}> has ${warnlevel} warnings.<:wumpuss:498051622564528149>`);

  };



  if(cmd === `${prefix}mute`){

    let reason = args.slice(1).join(' ');
  let user = message.mentions.users.first();
  
  let muteRole = bot.guilds.get(message.guild.id).roles.find('name', 'muted');
  if(!mutes[user.id]) mutes[user.id] = {
    mutes: 0
  };
   mutes[user.id].mutes++;
   fs.writeFile("./mutes.json", JSON.stringify(mutes), (err) => {
    if (err) console.log(err)
  });
  let incidentchannel = message.guild.channels.find(`name`, "incidents");
  if(!incidentchannel) return message.channel.send("Can't find incidents channel.");
  if (!muteRole) return message.reply('I cannot find a mute role').catch(console.error);
  if (reason.length < 1) return message.reply('You must supply a reason for the mute.').catch(console.error);
  if (message.mentions.users.size < 1) return message.reply('You must mention someone to mute them.').catch(console.error);
  const embed = new Discord.RichEmbed()
    .setColor(0x00AE86)
    .setTimestamp()
    .addField('Action:', 'Mute')
    .addField('User:', `${user.username}#${user.discriminator}`)
    .addField('Modrator:', `${message.author.username}#${message.author.discriminator}`);

  if (!message.guild.member(bot.user).hasPermission('MANAGE_ROLES_OR_PERMISSIONS')) return message.reply('I do not have the correct permissions.').catch(console.error);

  if (message.guild.member(user).roles.has(muteRole.id)) {
    message.guild.member(user).removeRole(muteRole).then(() => {
      bot.channels.get(incidentchannel.id).sendEmbed(embed).catch(console.error);
    });
  } else {
    message.guild.member(user).addRole(muteRole).then(() => {
      bot.channels.get(incidentchannel.id).sendEmbed(embed).catch(console.error);
    });
  }
  }
  if(cmd === `${prefix}unmute`){
    let user = message.mentions.users.first();
    if(!unmutes[user.id]) unmutes[user.id] = {
      unmutes: 0
    };
     unmutes[user.id].unmutes++;
     fs.writeFile("./unmutes.json", JSON.stringify(unmutes), (err) => {
      if (err) console.log(err)
    });
    let iMember = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
    if(!iMember) return message.reply("Couldn't find rhat user, yo.");

    let incidentchannel = message.guild.channels.find(`name`, "incidents");
    if(!incidentchannel) return message.channel.send("Can't find incidents channel.");

  ///let muteRole = bot.guilds.get(message.guild.id).roles.find('name', 'muted');
  
  let sRole = message.guild.roles.find(`name`, `muted`)
  if(!sRole) return message.reply("Couldn't find muted role.");;

  
  if(iMember.roles.has(sRole.id));
    await(iMember.removeRole(sRole.id));

  const embed = new Discord.RichEmbed()
    .setColor(0x00AE86)
    .setTimestamp()
    .addField('Action:', 'Unmute')
    .addField('User:', `${user.username}#${user.discriminator}`)
    .addField('Moderator:', `${message.author.username}#${message.author.discriminator}`);

    
    incidentchannel.send(embed);
    message.reply("***User unmuted!***")
  }
  
  bot.on('message', message => {
    // If the message is "how to embed"
    if (message.content === 'Example embed') {
      // We can create embeds using the MessageEmbed constructor
      // Read more about all that you can do with the constructor
      // over at https://discord.js.org/#/docs/main/stable/class/RichEmbed
      const embed = new Discord.RichEmbed()
        // Set the title of the field
        .setTitle('This is example')
        // Set the color of the embed
        .setColor(0xFF0000)
        // Set the main content of the embed
        .setDescription('Now you see that)');
      // Send the embed to the same channel as the message
      message.channel.send(embed);
    }
  });

  


  if(cmd === `${prefix}hr`){
    message.reply("Format for report - `<Prefix>report <@user> <reason>`.Example : `!report @tester You realy cool! P.S : If a command has <> in it, that means that it is an optional argument.<:peperead:498050860082003968>");
  };



    if(cmd === `${prefix}update`){
      message.delete();
      message.reply("***Litle update! Add lockdown, mute. Lockdown - `!lockdown 10s`, `!lockdown unlock`. And mute - `!mute <@user> <reason>`, `!unmute <@user>`.*** <:avatar:498051701530558464>")
    }

if(cmd === `${prefix}userinfo`){
  let kUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
  if(!kUser) return errors.cantfindUser(message.channel);

  let bicon = kUser.user.avatarURL;
  let botiEmbed = new Discord.RichEmbed()
  .setDescription("User Information")
  .setColor("#3390f")
  .setThumbnail(bicon)
  .addField("User Name", kUser.user.username)
  .addField("ID:", kUser.id)
  .addField("Join to server:", kUser.joinedAt);
  
  return message.channel.send(botiEmbed);
  
}
if(cmd === `${prefix}ufo`){
  let kUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
  if(!kUser) return errors.cantfindUser(message.channel);

  let bicon = kUser.user.avatarURL;
  let botiEmbed = new Discord.RichEmbed()
  .setDescription("User Information")
  .setColor("#3390f")
  .setThumbnail(bicon)
  .addField("User Name", kUser.user.username)
  .addField("ID:", kUser.id)
  .addField("Join to server:", kUser.joinedAt);
  
  return message.channel.send(botiEmbed);
  
}

if(cmd === `${prefix}serverinfo`){

  let sicon = message.guild.iconURL;
  let serverembed = new Discord.RichEmbed()
  .setDescription("Server Information")
  .setColor("#15f153")
  .setThumbnail(sicon)
  .addField("Server Name", message.guild.name)
  .addField("Created On", message.guild.createdAt)
  .addField("You Joined", message.member.joinedAt)
  .addField("ID:", message.guild.id)
  .addField("Total Members", message.guild.memberCount);

  message.channel.send(serverembed);
   return;
}

if(cmd === `${prefix}sinfo`){

  let sicon = message.guild.iconURL;
  let serverembed = new Discord.RichEmbed()
  .setDescription("Server Information")
  .setColor("#15f153")
  .setThumbnail(sicon)
  .addField("Server Name", message.guild.name)
  .addField("Created On", message.guild.createdAt)
  .addField("You Joined", message.member.joinedAt)
  .addField("ID:", message.guild.id)
  .addField("Total Members", message.guild.memberCount);

  message.channel.send(serverembed);
   return;
}

});

bot.login(token);
