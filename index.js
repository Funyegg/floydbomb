//FLOYDBOMB 2.0 COPYRAPE FUNE 1939-2133
const discord = require("discord.js-selfbot-v13");
const bot = new discord.Client();
const fs = require("fs");
let settings = JSON.parse(fs.readFileSync("./settings.json").toString());
let spammers = {
};

//A very simple spammer template
class spammer{
    constructor(channl){
        this.channel = channl;
        this.spammer = null; //Don't spam yet
    }
}

//Commands
const commands = {
    test: (message, param)=>{
        message.channel.send("Success V@1.0.0");
    },
    spam: (message, param)=>{
        if(isNaN(param)) return;
        //Validate that nothing else is being spammed
        if(spammers[message.channel.id] !== undefined){
            message.channel.send("I'm busy spamming already.");
            return;
        }
        
        //Set channel
        spammers[message.channel.id] = new spammer(message.channel);
        //Change the interval setting (idk why i even added it to settings)
        param = parseInt(param);
        settings.interval = param;

        //Spam a random message every interval (in milliseconds)
        spammers[message.channel.id].spammer = setInterval(()=>{
            spammers[message.channel.id].channel.send(settings.tospam[Math.floor(Math.random() * settings.tospam.length)])
        }, settings.interval);
    },
    kill: ()=>{
        //Kill the bot
        process.exit();
    },
    stop: (message)=>{
        if(spammers[message.channel.id].channel == undefined) return; //Only stop if you already started
        //Clear the spammer
        clearInterval(spammers[message.channel.id].spammer);
        spammers[message.channel.id] = undefined;
    },
    status: (message, param)=>{
        bot.user.setActivity(param);
        message.channel.send("New status: "+param);
    },
}

bot.login(settings.token);

//Wait for the bot to prepare
bot.on("ready", ()=>{
    //It started!
    console.log(bot.user.username+" is ready to rape!");
    bot.user.setActivity(settings.status);

    //Wait for a command
    bot.on("messageCreate", message=>{
        //Check whether a command should be executed
        if(!message.content.startsWith(settings.prefix)) return;
        else if(message.author.id !== settings.ownerid){
            message.channel.send("You're not the fucking owner.");
            return;
        }
        
        //Parse the command
        let comd = "";
        let param = ""
        if(message.content.includes(" ")){
            comd = message.content.substring(settings.prefix.length, message.content.indexOf(" "));
            param = message.content.substring(message.content.indexOf(" "), message.content.length);
        } else comd = message.content.substring(settings.prefix.length, message.content.length);

        //Check if command exists
        if(commands[comd] == undefined) return;
        //Execute the command
        commands[comd](message, param);
    })
})
