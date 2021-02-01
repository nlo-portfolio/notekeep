![NoteKeep](https://raw.githubusercontent.com/nlo-portfolio/nlo-portfolio.github.io/master/style/images/programs/notekeep.png "NoteKeep")

## Description ##

NoteKeep is an SPA webapp for taking secure notes in-browser, with everything saved in local storage right in the user's profile. Provides an additional encryption layer on top of the built-in browser protection, as well as import and export functionality for backing up user data.
<br><br>
[LIVE DEMO AVAILABLE](https://nlo-portfolio.github.io/notekeep "NoteKeep Demo")

## Dependencies ##

None. Can be opened locally in a web browser (notekeep/index.html).<br>
Testing requires Selenium WebDriver and Node.js. Tests can be run using the provided docker-compose file.<br>
<br>
Browsers: Tested in Firefox v89+, Chromium v91+.

## Usage ##

For new users, select the Create a New User link on the login page. Enter a new username (must not have been taken already) and password.<br>
Notes and folders can be viewed in the left window. Notes can be modified in the right window.<br>
Search for notes in the current folder using the search box.<br>
Import, export, change password and logout functions can be found in the navigation bar on the far left.<br>
<br>
Docker:

```
docker-compose build
docker-compose run test
```
