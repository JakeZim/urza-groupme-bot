var HTTPS = require('https');
var ABILITIES = require('./abilities.js');
var botID = process.env.BOT_ID;

function respond() {
    var request = JSON.parse(this.req.chunks[0]),
        urzaRegex = /^[uU]rza ([+-][16])$/,
        rollRegex = /[rR]oll ?[dD]?([0-9]+)/,
        timeRegex = /^[tT]imes? ([0-1]?[0-9]):?([0-5]?[0-9])? ?(.*)$/,
		helpRegex = /^[uU]rza [hH]elp$/,
		aboutRegex = /^[aA]bout [uU]rza$/;
    //console.log("Trying to respond to request" + this.req);

    if (request.text) {
        var message;    
        if(urzaRegex.test(request.text)) {
            var ability = request.text.match(urzaRegex)[1];
            message = getResult(ability);
        } else if (rollRegex.test(request.text)) {
            var die = request.text.match(rollRegex)[1];
            message = roll(die);
        } else if (timeRegex.test(request.text)) {
            var hour = request.text.match(timeRegex)[1];
            var minutes = request.text.match(timeRegex)[2];
            var tz = request.text.match(timeRegex)[3];
            var times = getTimes(hour, minutes, tz);
            if(times.length == 3) {
                message = times[0] + '\n' + times[1] + '\n' + times[2];
            } else {
                //One message is returned if there was an error
                message = times[0];
                return;
            }
        } else if (helpRegex.test(request.text)) {
			message = "My current spells are as follows:\n \
				Urza (+1/-1/-6) : Trigger one of my amazing planeswalker abilities \n \
				Roll dX : Roll a dice with X sides \n \
				Times HH TZ : Get the hour (HH) conversion between different TZs (PST/CST/EST) \n \
				About Urza : A link to my source code \n \
				Urza Help : See above";
		} else if (aboutRegex.test(request.text)) {
			message = "https://github.com/JakeZim/urza-groupme-bot";
		} else {
            //console.log("not a command");
            return;
        }
        this.res.writeHead(200);
        postMessage(message);
        this.res.end();
    }
}

function getTimes(hour, minutes, tz)
{
    hour = Number(hour);
    //console.log("Getting times for " + hour + ":" + minutes + " " + tz);
    var est, cst, pst;
    var upperTZ = tz.toUpperCase();
    if (upperTZ == "EST" || upperTZ == "ET" || upperTZ == "EASTERN") {
        est = hour;
        cst = hour - 1;
        pst = hour - 3;
    } else if  (upperTZ == "CST" || upperTZ == "CT" || upperTZ == "CENTRAL" || upperTZ == "") {
        est = hour + 1;
        cst = hour;
        pst = hour - 2;
    } else if (upperTZ == "PST" || upperTZ == "PT" || upperTZ == "PACIFIC") {
        est = hour + 3;
        cst = hour + 2;
        pst = hour;
    } else {
        return ["What plane are you from? The only valid timezones are EST, CST, and PST!"];
    }
    //console.log(est + "," + cst + "," + pst);
    est = goAround(est);
    cst = goAround(cst);
    pst = goAround(pst);
    //console.log(est + "," + cst + "," + pst);
    var estTime, cstTime, pstTime;
    if(minutes === undefined)
    {
        estTime = String(est) + " EST";
        cstTime = String(cst) + " CST";
        pstTime = String(pst) + " PST";
    } else {
        if(minutes.length == 1)
        {
            minutes = '0' + minutes;
        }
        estTime = String(est) + ":" + String(minutes) + " EST";
        cstTime = String(cst) + ":" + String(minutes) + " CST";
        pstTime = String(pst) + ":" + String(minutes) + " PST";
    }
    //console.log(estTime + "," + cstTime + "," + pstTime);
    return [estTime,cstTime,pstTime];
}

function goAround(hour)
{
    hour = Number(hour);
    //Can't have negative times, and definitely not army times (1300+)
    if (hour <= 0) {
        return 12 + hour;
    } else if (hour > 12) {
        return hour - 12;
    }
    return hour;
}

function getResult(ability) {
    var roll20 = roll(20) - 1;
    switch (ability) {
        case "+1":
            return ABILITIES.plusOnes[roll20];
        case "-1":
            return ABILITIES.minusOnes[roll20];
        case "-6":
            return ABILITIES.minusSixes[roll20];
    }
}

function roll(die)
{
    return Math.floor(Math.random() * die) + 1;
}

function postMessage(message) {
    var options, body, botReq;

    options = {
        hostname: 'api.groupme.com',
        path: '/v3/bots/post',
        method: 'POST'
    };

    body = {
        "bot_id": botID,
        "text": String(message)
    };

    console.log('sending ' + message + ' to ' + botID);

    botReq = HTTPS.request(options, function (res) {
        if (res.statusCode == 202) {
            //neat
        } else {
            console.log('rejecting bad status code ' + res.statusCode);
        }
    });

    botReq.on('error', function (err) {
        console.log('error posting message ' + JSON.stringify(err));
    });
    botReq.on('timeout', function (err) {
        console.log('timeout posting message ' + JSON.stringify(err));
    });
    botReq.end(JSON.stringify(body));
}

exports.respond = respond;