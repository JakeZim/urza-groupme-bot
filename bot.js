var HTTPS = require('https');

var botID = process.env.BOT_ID;

var plusOnes = [
    "Until end of turn, up to one target creature gets +1/+1 and gains first strike, vigilance, and lifelink.",
    "Distribute three +1/+1 counters among one, two, or three target creatures you control.",
    "Destroy target noncreature permanent.",
    "Create two 3/1 red Elemental creature tokens with haste. Exile them at the beginning of the next end step.",
    "Create three 1/1 white Soldier creature tokens.",
    "Create a 3/3 black Beast creature token with deathtouch.",
    "Reveal the top five cards of your library. Put all creature cards revealed this way into your hand and the rest on the bottom of your library in any order.",
    "During target opponent’s next turn, creatures that player controls attack Urza if able.",
    "Put a loyalty counter on Urza for each creature target opponent controls.",
    "Until your next turn, whenever a creature an opponent controls attacks, it gets -1/-0 until end of turn.",
    "Target player exiles a card from his or her hand.",
    "Reveal the top card of your library. If it’s a land card, put it onto the battlefield. Otherwise, put it into your hand.",
    "Target land you control becomes a 4/4 Elemental creature with trample. It’s still a land.",
    "Draw a card, then add one mana of any color to your mana pool.",
    "Until end of turn, Urza becomes a legendary 4/4 red Dragon creature with flying, indestructible, and haste. (He doesn’t lose loyalty while he’s not a planeswalker.)",
    "Until your next turn,creatures you control get +1/+0 and gain lifelink.",
    "Look at the top five cards of your library. You may reveal an artifact card from among them and put it into your hand. Put the rest on the bottom of your library in any order.",
    "Urza deals 3 damage to target creature or player.",
    "Until your next turn,whenever a creature deals combat damage to Urza, destroy that creature.",
    "Add X mana in anycombination of colors to your mana pool, where X is thenumber of creatures you control."
];

var minusOnes = [
    "Urza deals 3 damage to each creature.",
    "Gain control of target creature.",
    "Urza deals 4 damage to target creature or player and you gain 4 life.",
    "Destroy target creature. You gain life equal to its toughness.",
    "You get an emblem with “Creatures you control get +1/+1.”",
    "You may put a creature card from your hand onto the battlefield.",
    "Draw three cards, then put a card from your hand on top of your library.",
    "Target player puts the top ten cards of his or her library into his or her graveyard.",
    "Reveal the top five cards of your library. An opponent separates those cards into two piles. Put one pile into your hand and the other on the bottom of your library in any order.",
    "Exile target permanent.",
    "Reveal the top five cards of your library. You may put all creature cards and/or land cards from among them into your hand. Put the rest into your graveyard.",
    "Search your library for a card and put that card into your hand. Then shuffle your library.",
    "Target player sacrifices two creatures.",
    "Create a 5/5 black Demon creature token with flying. You lose 2 life.",
    "Create a 4/4 gold Dragon creature token with flying.",
    "Target player’s life total becomes 10.",
    "Destroy target nonland permanent.",
    "Return target permanent from a graveyard to the battlefield under your control.",
    "Create two 3/3 green Beast creature tokens.",
    "Draw four cards and discard two cards."
];

var minusSixes = [
    "Urza deals 7 damage to target player. That player discards seven cards, then sacrifices seven permanents.",
    "You get an emblem with “If a source would deal damage to you or a planeswalker you control, prevent all but 1 of that damage.”",
    "Destroy all lands target player controls.",
    "Create X 2/2 white Cat creature tokens, where X is your life total.",
    "You gain 100 life.",
    "Urza deals 10 damage to target player and each creature he or she controls.",
    "You get an emblem with “Creatures you control have double strike, trample, hexproof, and haste.”",
    "You get an emblem with “Artifacts, creatures, enchantments, and lands you control have indestructible.”",
    "Create a 6/6 green Wurm creature token for each land you control.",
    "Each player shuffles his or her hand and graveyard into his or her library. You draw seven cards.",
    "Destroy up to three target creatures and/or other planeswalkers. Return each card put into a graveyard this way to the battlefield under your control.",
    "You get an emblem with “Whenever you cast a spell, exile target permanent.”",
    "You get an emblem with “Whenever a creature enters the battlefield under your control, you may have it fight target creature.” Then create three 8/8 blue Octopus creature tokens.",
    "You control target player during that player’s next turn.",
    "Exile all cards from target player’s library, then that player shuffles his or her hand into his or her library.",
    "Create three 1/1 black Assassin creature tokens with “Whenever this creature deals combat damage to a player, that player loses the game.”",
    "Put all creature cards from all graveyards onto the battlefield under your control.",
    "You gain X life and draw X cards, where X is the number of lands you control.",
    "Flip five coins. Take an extra turn after this one for each coin that comes up heads.",
    "You gain 7 life, draw seven cards, then put up to seven permanent cards from your hand onto the battlefield."
];

function respond() {
    var request = JSON.parse(this.req.chunks[0]),
        botRegex = /^[uU]rza ([+-][16])$/,
        rollRegex = /[rR]oll ?[dD]?([0-9]+)/,
        timeRegex = /^[tT]ime[s]? ([1-9][1-9]?):?([0-9][0-9])? ?(.*)$/;
    console.log("Trying to respond to request" + request);

    if (request.text && botRegex.test(request.text)) {
        var ability = request.text.match(botRegex)[1],
            message = getResult(ability);

        this.res.writeHead(200);
        postMessage(message);
        this.res.end();
    } else if (request.text && rollRegex.test(request.text)) {
        var die = request.text.match(rollRegex)[1]
        this.res.writeHead(200);
        postMessage(roll(die));
        this.res.end();
    } else if (request.text && timeRegex.test(request.text)) {
        var hour = request.text.match(timeRegex)[1];
        var minutes = request.text.match(timeRegex)[2];
        var tz = request.text.match(timeRegex)[3];
        var times = getTimes(hour, minutes, tz);
        var message = times[0] + '\n' + times[1] + '\n' + times[2];
        postMessage(message);
    } else {
        //console.log("don't care");
        this.res.writeHead(200);
        this.res.end();
    }
}

function getTimes(hour, minutes, tz)
{
    hour = Number(hour);
    //console.log("Getting times for " + hour + ":" + minutes + " " + tz);
    var est, cst, pst;
    if (tz == "EST" || tz == "est" || tz == "ET" || tz == "et") {
        est = hour;
        cst = hour - 1;
        pst = hour - 3;
    } else if  (tz == "CST" || tz == "cst" || tz == "CT" || tz == "ct") {
        est = hour + 1;
        cst = hour;
        pst = hour - 2;
    } else if (tz == "PST" || tz == "pst" || tz == "PT" || tz == "pt") {
        est = hour + 3;
        cst = hour + 2;
        pst = hour;
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
            return plusOnes[roll20];
        case "-1":
            return minusOnes[roll20];
        case "-6":
            return minusSixes[roll20];
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