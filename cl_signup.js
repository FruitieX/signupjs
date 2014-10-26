/*
<!-- exempelanmälningar. ta bort kommentaren på typ av önskad turnering -->

## Anmälning

<!-- multiplayer turnering, lägg till/ta bort namn vid behov -->

<!--
Fyll i alla fält.

Lagets namn: <input id="team" type="text">

* Spelare 1: <input id="nick1" type="text">
* Spelare 2: <input id="nick2" type="text">
* Spelare 3: <input id="nick3" type="text">
* Spelare 4: <input id="nick4" type="text">

<button onclick="Submit();">Anmäl er!</button>
-->

<!-- singleplayer turnering -->

<!--
Din bögiga nick: <input id="nick" type="text">

<button onclick="Submit();">Anmäl dig!</button>
-->

<script>
tourney_url = 'http://fruitiex.org:1337/quake3test';
</script>
<script src=http://fruitiex.org/cl_signup.js></script>

## Anmälda
<div id="entries"></div>
*/

var $ = jQuery; // easier jQuery in wordpress

var nameMaxLen = 32;
var teamMaxLen = 64;

// either one of these elements must exist
var nick = document.getElementById('nick');
var team = document.getElementById('team');

// find out team size
var teamSize = 1;
while ((document.getElementById('nick' + teamSize))) {
    teamSize++;
}
teamSize--;

// submit button pressed
Submit = function() {
    var nicks = [];
    var entry;

    if(team) {
        var teamNickId = 1;
        var teamNick;
        while ((teamNick = document.getElementById('nick' + teamNickId++))) {
            nicks.push(teamNick.value);
        }

        entry = {
            team: team.value,
            nicks: nicks
        };
    } else {
        entry = {
            nick: nick.value
        };
    }

    var req = new XMLHttpRequest();
    req.open("post", tourney_url, true);
    req.setRequestHeader("Content-Type", "application/json");

    req.onreadystatechange = function() {
        if (req.readyState === 4) {
            if (req.status === 200) {
                alert("Anmälningen lyckades. GLHF!");

                if(team) {
                    team.value = '';
                    var teamNickId = 1;
                    var teamNick;
                    while ((teamNick = document.getElementById('nick' + teamNickId++))) {
                        teamNick.value = '';
                    }
                } else {
                    nick.value = '';
                }

                updateEntries();
            } else {
                alert("Anmälningen misslyckades. Kolla att du fyllt i alla fält. Kontakta styrelsen vid behov");
            }
        }
    };

    console.log(JSON.stringify(entry));
    req.send(JSON.stringify(entry));
};

var updateEntries = function() {
    var req = new XMLHttpRequest();
    req.onload = function() {
        var entriesDiv = $('#entries');
        entriesDiv.empty();

        var entries = JSON.parse(req.response);

        // first we create the dom elements
        for(var i = 0; i < entries.length; i++) {
            entriesDiv.append('<table id="table' + i + '"></table>');

            var htmlString = '';
            htmlString += '<tr>';
            if(team) {
                htmlString += '<td style="text-align:center;" colspan="' + teamSize + '" id=team' + i + '></td></tr><tr>';

                for(var j = 0; j < entries[i].nicks.length; j++) {
                    htmlString += '<td id=team' + i + 'nick' + j + '></td>';
                }
            } else {
                $('#table' + i).css('margin', '1px')
                htmlString += '<td id=nick' + i + '></td>';
            }
            htmlString += '</tr>';
            $('#table' + i).html(htmlString);
        }

        // next we modify the contents of the dom elements
        for(var i = 0; i < entries.length; i++) {
            if(team) {
                $('#team' + i).text(entries[i].team.substring(0,teamMaxLen));

                for(var j = 0; j < entries[i].nicks.length; j++) {
                    $('#team' + i + 'nick' + j).text(entries[i].nicks[j].substring(0,nameMaxLen));
                }
            } else {
                console.log('#nick' + i, entries[i].nick);
                $('#nick' + i).text(entries[i].nick.substring(0,nameMaxLen));
            }
        }
    };
    req.open("get", tourney_url, true);
    req.send();
};

window.onload = function() {
    updateEntries();
    // update entries with 10 sec intervals
    setInterval(updateEntries, 10000);
};
