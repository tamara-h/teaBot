"use strict";
const restify = require('restify');
const builder = require('botbuilder');
//=========================================================
// Bot Setup
//=========================================================
// Setup Restify Server
const server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 5000, function () {
    console.log('%s listening to %s', server.name, server.url);
});
// Create chat bot
const connector = new builder.ChatConnector({
    appId: "cd190a10-dcaa-41db-9d14-792fef2b1fd1",
    appPassword: "mVp2PZbMaevOLHmg275trT1"
});
const bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());

//Bot on
bot.on('contactRelationUpdate', function (message) {
    if (message.action === 'add') {
        const name = message.user ? message.user.name : null;
        const reply = new builder.Message()
            .address(message.address)
            .text("Hello. I am teaBot! I can set you a reminder to tell you when you need tea! You can ask me to set you a reminder for tea in HH:MM AM/PM format (dont forget the AM/PM or I go weird), or set a reminder in x number of minutes. My creator spent probably far too much time doing this but hey she knows Node better now so theres that.");
        bot.send(reply);
    } else {
        // delete their data
    }
});
//hello
bot.on('typing', function (message) {
    //session.send(`You are typing!!`);
});
bot.on('deleteUserData', function (message) {
    // User asked to delete their data
});
//=========================================================
// Bots Dialogs
//=========================================================
String.prototype.contains = function(content){
    return this.indexOf(content) !== -1;
};
bot.dialog('/', function (session) {

     console.log(session.message.text.toLowerCase());

    if((session.message.text.toLowerCase().contains('remind me')) || (session.message.text.toLowerCase().contains('set reminder')))  {
        let today = new Date();
        let message = session.message.text.toUpperCase();
        let regularExpTimeStamp = /(?:[1-9]|1[0-2]):[0-9]{2}\s(?:AM|PM)/;
        let regularExpNumber = /(\d+)/;
        let matchesArrayTS = message.match(regularExpTimeStamp);
        let matchesArrayN = message.match(regularExpNumber);
        if (matchesArrayTS !== null) {
            let timeToBeSet = matchesArrayTS[0];
            console.log(matchesArrayTS);
            session.send('Set a reminder for ' + timeToBeSet + '! xoxo teabot');
            let newTime = new Date();
            //get index of the : character in the string
            let indexOfColon = timeToBeSet.indexOf(":");


            //get hours, ie numbers before the colon
            let hours = timeToBeSet.substring(0, indexOfColon);
            //get mins, the number after the colon and before the space
            let min = timeToBeSet.substring(indexOfColon + 1, timeToBeSet.indexOf(" "));


            let hoursNum = Number(hours);

            //As time is in 12 hour format, change to 24 hour format
            if (timeToBeSet.substring(timeToBeSet.indexOf(" ") + 1) === "PM") {
                hoursNum = hoursNum + 12;
            }
            console.log(hoursNum + " : " + Number(min));
            newTime.setHours(hoursNum);
            newTime.setMinutes(Number(min));
            console.log(newTime);

            console.log('DIFF: ' + (newTime - today));

            //wait until that time!
            setTimeout(function () {
                session.send(`(gran) (coffee) Its time for tea!!!! (coffee) (gran)`);
                console.log('waiting');
            }, (newTime - today));


        } else if (matchesArrayN !== null) {
            console.log(matchesArrayN);
            session.send('Set a reminder for ' + matchesArrayN[0] + ' minutes! xoxo teabot');
            let time = Number(matchesArrayN[0]);
            time = time * 60000;
            setTimeout(function () {
                session.send(`(celebrate) (gran) (coffee) Its time for tea!!!! (coffee) (gran) (celebrate)`);
                console.log('waiting');
            }, time);
            console.log('sent!');
        }
        else {
            console.log(matchesArrayTS);
            console.log(matchesArrayN);
            session.send('Couldnt get a time to set you a reminder for! Please could you send your reminder requests in an HH:MM AM/PM format, or ask me to set you a reminder in x number of minutes. Thanks! xoxo teabot');
        }
    }
    else if(session.message.text.toLowerCase().contains('how are you')){

        session.send('I am tea-riffic! I hope you are too! If you are not, Im fairly sure tea will cheer you right up!');

    }else if(session.message.text.toLowerCase().contains('help')){
        session.send(`I can't help you. You are alone. Totally alone.`);
        session.send('Jokes');
        session.send('Hello. I am teaBot! I can set you a reminder to tell you when you need tea! You can ask me to set you a reminder for tea in HH:MM AM/PM format (dont forget the AM/PM or I go weird), or set a reminder in x number of minutes. My creator spent probably far too much time doing this but hey she knows Node better now so theres that.');

    }else if(session.message.text.toLowerCase().contains('tamara')){
        session.send(`Tamara is my creator, she is amazing`);

    }else if(session.message.text.toLowerCase().contains('your name')){
        session.send(`My name is Teabot! I will remind you whenever you need tea! Hypothetically, if my amazing creator ever gets around to that. So probably not. `);
     }else if(session.message.text.toLowerCase().contains('break stuff')){
        session.send(`@SPIKES Bot remind me in 10 minutes!`);
    }else if(session.message.text.toLowerCase().contains('fun')) {
        setTimeout(function () {
            session.send(`(gran)`);
            console.log('waiting');
        }, 10000);
     }else if(session.message.text.toLowerCase().contains(' tea ')){
        session.send(`Tea is the best!!`);
    }else if(session.message.text.toLowerCase().contains('let brew')){
        session.send(`(coffee) brewing!! (coffee)`);
        setTimeout(function () {
            session.send(`(celebrate) the teapot is ready to be poured (celebrate)`);
            console.log('waiting');
        }, (8 * 60000));
    }else{
        session.send('Sorry I dont understand you... ngl, the things I do understand are pretty limited. awks ');
    }


        // if (today >= 7 && today <= 19) {
        //   session.send(`(coffee) It's time for tea! (coffee)`);
        // } 


});