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
<script src=http://fruitiex.org/signup-cl.js></script>

## Anmälda
<table id="entries"><tbody></tbody></table>
*/

var $ = jQuery; // easier jQuery in wordpress

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
        var tableBody = $('#entries tbody');
        tableBody.empty();

        var entries = JSON.parse(req.response);

        // first row contains labels, but only in team games
        var htmlString = '';
        if(team) {
            htmlString += '<tr>';
            htmlString += '<td>Team</td>';

            for(var i = 1; i <= teamSize; i++) {
                htmlString += '<td>Player ' + i + '</td>';
            }

            htmlString += '</tr>';
            $(tableBody).append(htmlString);

            htmlString = '';
        }

        // additional rows containing actual data
        // first we create the dom elements
        for(var i = 0; i < entries.length; i++) {
            htmlString += '<tr>';
            if(team) {
                htmlString += '<td id=team' + i + '></td>';

                for(var j = 0; j < entries[i].nicks.length; j++) {
                    htmlString += '<td id=team' + i + 'nick' + j + '></td>';
                }
            } else {
                htmlString += '<td id=nick' + i + '></td>';
            }
            htmlString += '</tr>';
        }
        $(tableBody).append(htmlString);

        // next we modify the contents of the dom elements
        for(var i = 0; i < entries.length; i++) {
            if(team) {
                $('#team' + i).text(entries[i].team);

                for(var j = 0; j < entries[i].nicks.length; j++) {
                    $('#team' + i + 'nick' + j).text(entries[i].nicks[j]);
                }
            } else {
                $('#nick' + i).text(entries[i].nick);
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