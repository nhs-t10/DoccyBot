const Discord = require('discord.js');
const bot = new Discord.Client();

const GoogleSpreadsheet = require('google-spreadsheet');
const { promisify } = require('util');



//---------------------------------------------------------------------------------------------------------------------------------



const creds = require('./client_secret.json')
async function accessDocSpreadsheet(user){
    const doc = new GoogleSpreadsheet('1PEOVTKqOyI3ezu3RPZnxAyFeJjSp9lgcEEZDCCjL2BU');
    await promisify(doc.useServiceAccountAuth)(creds);
    const info = await promisify(doc.getInfo)();
    const sheet = info.worksheets[0];
    const row = {
        num: `${date.getMonth()+1}/${date.getDate()}`,
        name: nameMap.get(user),
        action: actionMap.get(user),
        goal: goalMap.get(user)
    }
    await promisify(sheet.addRow)(row);

}



//----------------------------------------------------------------------------------------------------------------------------------------------------



const token = 'NjYzMjE3MzQxMjU2OTU3OTcy.XhFT5g.D-zLURx2qX9cYMvTJn7XCwbLbxw';

const PREFIX = '!';//we might change this later because I want to make !d

const documentation = {
    NOT: 'not',
    NAME: 'name',
    ACTION: 'action',
    ACHIEVEMENT: 'achievement'
}
var nameMap = new Map()
var actionMap = new Map()
var goalMap = new Map()
var date;

var docMap = new Map()
// OTHER ENUMS WILL GO HERE LATER NERDS
bot.on('ready', () => {
    console.log('this bot is online');
    bot.user.setActivity(' !help');
})
bot.login(token);
bot.on('message', message=>{
    let args = message.content.substring(PREFIX.length).split(" ");

    switch(args[0])
    {
        case 'help':
            const embed = new Discord.RichEmbed()
            .setTitle('Commands:')
            .addField('!doc', 'document what you did today',false)
            .addBlankField()
            .addField('!scout prematch','answer questions about a team to scout them',false)
            .addBlankField()
            .addField('!scout match', 'score a team and answer questions to scout them',false)
            .addBlankField()
            .addField('!link','gives the link to Doccys spreadsheet', false)
            .setColor(0xF1C40F)
            message.channel.sendEmbed(embed);
            break;
        case 'doc':  
            date = new Date();
            docMap.set(message.author.username,documentation.NAME)
            message.channel.sendMessage('('+message.author.username+') What is your name?')
            break;
        case 'scout':
            if(args[1] === 'prematch')
            {
                message.channel.sendMessage('you have chosen prematch scouting')
            }else if(args[1] === 'match')
            {
                message.channel.sendMessage("you are doing in game scouting")
            }
            break;
        case 'link':
            message.channel.sendMessage("https://docs.google.com/spreadsheets/d/1PEOVTKqOyI3ezu3RPZnxAyFeJjSp9lgcEEZDCCjL2BU/edit?usp=sharing")
            break;

        default:
            if(!(message.author.username === 'DoccyBot'))
            {
                switch(docMap.get(message.author.username))
                {
                case documentation.ACHIEVEMENT:
                    docMap.set(message.author.username,documentation.NOT)
                    goalMap.set(message.author.username,message)
                    accessDocSpreadsheet(message.author.username);
                    break;
                case documentation.ACTION:
                    docMap.set(message.author.username,documentation.ACHIEVEMENT)
                    actionMap.set(message.author.username,message)
                    message.channel.sendMessage('('+message.author.username+') What did you finish/accomplish?')
                    break;
                case documentation.NAME:
                    docMap.set(message.author.username,documentation.ACTION)
                    nameMap.set(message.author.username,message)
                    message.channel.sendMessage('('+message.author.username+') What did you do today?')
                    break;
                }
                
                    
            }
           

    
        
    }
})



//TODO: 
// make the bot interact with a spreadsheet
// make the bot be able to score matches live
//enum system + conversation

//helpful stuff:
//message.reply - pings person
//channel.sendMessage - sends message into a channel

// case 'clear':
        //     if(!args[1]) return message.reply('add a second argument') - deletes messages
        //     message.channel.bulkDelete(args[1]);
        //     break;

//message.author.username - fetches user's name
//message.author.avatarURL - image of url
