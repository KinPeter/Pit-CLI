import { blueBright, bold, cyan } from 'chalk'

export function useHelp() {
  function showMainHelp() {
    console.log(`
${bold(blueBright('Pit CLI Usage'))}
${bold(blueBright('============='))}

Pit has different modules which can be started by running ${bold(cyan('pit <module> [<parameters>]'))}. 
You can choose from the below modules to run:

  ${cyan('checkout, co')}            Checkout - Checks out a branch.
  ${cyan('review, rv')}              Reviewer - Checks out a remote branch for review.
  ${cyan('clean, cl')}               Branch Cleaner - Deletes local branches in a Git repository.
  ${cyan('pulo')}                    Pulls from origin from the current branch.
  ${cyan('docker, d')}               Deletes containers, images or volumes using a multiselect menu.
  ${cyan('jira')}                    Fetches information about a Jira issue
  ${cyan('user')}                    Gets/sets Git user email locally or globally.
  
  ${cyan('help')}                    Displays this help page.
  
Run ${bold(cyan('pit help <command>'))} for more detailed usage information.
    `)
  }
  function showCheckoutHelp() {
    console.log(`
${bold(blueBright('Checkout'))}
${bold(blueBright('--------'))}
  
  ${cyan('checkout, co')}            Checks out a branch.

Without parameters: displays a select menu to choose which branches to check out. 
Press ${cyan('<Enter>')} after selecting the branch, or ${cyan('<ESC>')} to cancel and quit. 

Shortcut options:
  ${cyan('com')}                     Checks out the 'master' or 'main' branch (whichever exists).
  ${cyan('cod')}                     Checks out the 'develop' branch. 
  ${cyan('-r')}                      Used with the 'com' or 'cod' command, also performs a pull.
  ${cyan('-rr')}                     Used with the 'com' or 'cod' command, also performs a pull with rebasing.

Optional parameters for the ${cyan('checkout')} or ${cyan('co')} commands: 
  ${cyan('[string]')}                Looks for the given string in branch names and checks out the first one
                          it finds.    
    `)
  }

  function showReviewHelp() {
    console.log(`
${bold(blueBright('Review'))}
${bold(blueBright('------'))}
  
  ${cyan('review, rv')}              Checks out a remote branch for review.

Without parameters: displays a select menu to choose which remote branches to check out.  
Press ${cyan('<Enter>')} after selecting the branch, or ${cyan('<ESC>')} to cancel and quit. 

Optional parameters: 
  ${cyan('[string]')}                Looks for the given string in branch names and checks out the first one
                          it finds.    
    `)
  }

  function showCleanHelp() {
    console.log(`
${bold(blueBright('Branch cleaner'))}
${bold(blueBright('--------------'))}
  
  ${cyan('clean, cl')}               Deletes local branches in a Git repository.
  
Without parameters: displays a multiselect menu to choose which local branches to delete. Use ${cyan('<Space>')} to 
select branches, press ${cyan('<Enter>')} when you're done with the selection, or ${cyan('<ESC>')} to cancel and quit.

Optional parameters: 
  ${cyan('-a')}                      Auto mode: Tries to delete all branches except the current HEAD and 
                          master/main/develop branches. It will skip those branches which are not yet merged into 
                          the current branch. 
  ${cyan('-af')}                     Auto+Force mode: Force deletes all branches except the current HEAD 
                          and master/main/develop branches.     
    `)
  }

  function showPullHelp() {
    console.log(`
${bold(blueBright('Pull from origin'))}
${bold(blueBright('----------------'))}
  
  ${cyan('pulo')}                    Pulls from origin from the branch with the same name as pointed at the current HEAD.

No optional parameters.    
    `)
  }

  function showDockerHelp() {
    console.log(`
${bold(blueBright('Docker'))}
${bold(blueBright('------'))}
  
  ${cyan('docker, d')}               Offers a multiselect menu to remove docker containers, images and volumes.

Parameters:
  ${cyan('rm')}                      Removes containers
  ${cyan('rmi')}                     Removes images
  ${cyan('rmv')}                     Removes volumes    
    `)
  }

  function showJiraHelp() {
    console.log(`
${bold(blueBright('Jira'))}
${bold(blueBright('----'))}
  
  ${cyan('jira')}                    Fetches information about a Jira issue from the Jira Cloud API.
  
Parameters:
  ${cyan('[number]')}                The requested issue number

Optional parameters:
  ${cyan('-c')}                      Creates a new branch with the suggested branch name

Configuration:
Create a ${cyan('.pitconfig.json')} file in your user directory. Use the ${cyan('.pitconfig.example.json')} file in 
the ${cyan('pit-cli')} folder as an example.
There can be multiple projects configured, just make sure the project folders are correct.     
    `)
  }

  function showUserHelp() {
    console.log(`
${bold(blueBright('User'))}
${bold(blueBright('----'))}
  
  ${cyan('user')}                    Gets or sets the global or local (for repository) Git user email according to 
                          the given parameters.
   
Without parameters: Gets the local user email set for the current repository.

Parameters:
  ${cyan('-g')}                      Sets the config level to Global
  ${cyan('-p')}                      Sets the Git user email to the pre-set personal email address
  ${cyan('-w')}                      Sets the Git user email to the pre-set work email address
  
Configuration:
Create a ${cyan('.pitconfig.json')} file in your user directory. Use the ${cyan('.pitconfig.example.json')} file in 
the ${cyan('pit-cli')} folder as an example.    
    `)
  }

  return {
    showMainHelp,
    showCheckoutHelp,
    showCleanHelp,
    showDockerHelp,
    showJiraHelp,
    showPullHelp,
    showReviewHelp,
    showUserHelp,
  }
}
