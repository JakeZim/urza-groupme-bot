var HTTPS = require('https');
var mtg = require('mtgsdk');

function fetch(cmc, color, power_toughness, name)
{
    // var card = {
    //     "cmc":null,
    //     "colors":null,
    //     "power":null,
    //     "toughness":null,
    //     "name":null
    // };
    // if(cmc != null)
    // {
    //     card.cmc = cmc;
    // }
    // if(color != null)
    // {
    //     card.colors = color;
    // }
    if(power_toughness != null)
    {
        power_toughness = power_toughness.replace("/", "\\");
        var power = power_toughness.split("\\")[0];
        var toughness = power_toughness.split("\\")[1];
        card.power = power;
        card.toughness = toughness;
    }
    // if(name != null)
    // {
    //     card.name = name;
    // 
    
    //getCards(card);
    
	
	//mtg.card.where({cmc: cmc, colors:color, power: power, toughness: toughness, name: name}).then(cards => console.log(cards[0].name));
	return mtg.card.where({cmc: cmc, colors:color, power: power, toughness: toughness, name: name}).then(cards => cards[0].imageUrl);
    //return cards[Math.floor(Math.random() * cards.size())];
}

function getCards(card) {
    console.log(card);

    var options = {
        hostname: 'api.magicthegathering.io',
        path: "/v1/cards",
        method: 'GET'
    };

    var botReq = HTTPS.get(options, function (res) {
        console.log(res);
        if (res.statusCode == 202) {
            //Cool beans
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
    var response = botReq.end(card);
}

exports.fetch = fetch;
