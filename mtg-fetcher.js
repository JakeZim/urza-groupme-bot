const baseURI = 'https://api.magicthegathering.io/v1';

function fetch(cmc, color, power_toughness, name)
{
    var request = [];
    request.push(baseURI);
    if(cmc != null)
    {
        request.push("&cmc=", cmc);
    }
    if(color != null)
    {
        request.push("&colors=", color);
    }
    if(power_toughness != null)
    {
        power_toughness = power_toughness.replace("/", "\\");
        var power = power_toughness.split("\\")[0];
        var toughness = power_toughness.split("\\")[1];
        request.push("&power=", power);
        request.push("&toughness=", toughness);
    }
    if(name != null)
    {
        request.push("&name:", name);
    }
    request = request.replace("&", "");
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
