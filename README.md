signupjs
========

very simple signup system

Features:

- Teams or singleplayer signups
- For teams, individual nicknames must be specified
- JSON based REST API
- Signups are stored as JSON in `tournies/tourney_name.json`
- Creating a new tourney is as simple as using a new URL
- CSRF ;)

Installation
------------

1. npm install
2. PORT=8080 node signup.js

Usage
-----

    curl -X POST -d '{"nick":"test"}' localhost:8080/test_tourney
    curl localhost:8080/test_tourney

When hosting a test server, Check `localhost:8080/` for more info.
