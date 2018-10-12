function fetch(cmc, color, power_toughness, name)
{
    var requestParts = [];
    requestParts.push("v1");
    if(cmc != null)
    {
        requestParts.push("&cmc=", cmc);
    }
    if(color != null)
    {
        requestParts.push("&colors=", color);
    }
    if(power_toughness != null)
    {
        power_toughness = power_toughness.replace("/", "\\");
        var power = power_toughness.split("\\")[0];
        var toughness = power_toughness.split("\\")[1];
        requestParts.push("&power=", power);
        requestParts.push("&toughness=", toughness);
    }
    if(name != null)
    {
        requestParts.push("&name:", name);
    }
    var request = requestParts.join("").replace("&", "");
    getCards(request);
    //return cards[Math.floor(Math.random() * cards.size())];
}

function getCards(query) {
    console.log(query);

    var options = {
        hostname: 'api.magicthegathering.io',
        path: query,
        method: 'GET'
    };

    var botReq = HTTPS.request(options, function (res) {
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
    var response = botReq.end();
    console.log(response);
    console.log(JSON.parse(response).cards[0].name);
}

exports.fetch = fetch;
