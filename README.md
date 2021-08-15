# Pit CLI

A command line "toolbox" supporting Git, Docker and Jira workflows by some added functionality, powered by Node.js and written in TypeScript.

## Features:
- Config file handling - set your user info and Jira project credentials in a central config file
- Git:
    - Clean unused branches using a multi select list menu or with auto mode
    - Check out a branch by issue number or by a select menu
    - Check out a remote branch for Code Review - also by issue number or a select menu
    - Shortcuts to check out main branches and also refresh them with one short command
    - Set pre-defined user info for a repository or globally
- Docker:
    - Remove containers, images or volumes using a multi select list menu
- Jira:
    - Fetch base information about Jira issues by issue number
    - Create a branch parsing and using the Jira issue title as branch name

## Install and setup on Linux

1) Have an up-to-date Node.js and NPM installed (I used Node 16.x, not tested with earlier versions).
2) Run `npm install` or `npm ci` in the project directory to install dependencies. This will automatically build the project at the end, but you can build using the `npm run build` command as well.
3) Create an alias in your bash config file such as 
```bash
alias pit='node ~/path/to/pit-cli/dist/index.js'
```
4) Create a `.pitconfig.json` file in your user's HOME directory (e.g. `/home/peter/`), enter the required information according to the `.pitconfig.example.json` file in the project folder.
5) Run `pit help` for more information about how to get started!
