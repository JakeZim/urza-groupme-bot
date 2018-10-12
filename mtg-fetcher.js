const baseURI = 'https://api.magicthegathering.io/v1';

function fetch(cmc, color, power_toughness, name)
{
    var requestParts = [];
    requestParts.push(baseURI);
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
    getResponse(request);
    //return cards[Math.floor(Math.random() * cards.size())];
}

function getResponse(request)
{
    console.log(request);
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
         if (this.readyState == 4 && this.status == 200) {
             console.log(this.responseText);
             var jsonResponse = JSON.parse(this.responseText);
             console.log(jsonResponse.cards[0].name);
         }
    };
    xhttp.open("GET", request, true);
    xhttp.send();
}

exports.fetch = fetch;
