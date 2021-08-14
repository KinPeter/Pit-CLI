import { GitConfigScope, GitError, SimpleGit } from 'simple-git'
import { LoggerInstance } from '../../utils/logger'
import Config from '../../utils/config'

export function useGitUser(git: SimpleGit, logger: LoggerInstance) {
  async function getUser({ global } = { global: false }): Promise<void> {
    try {
      const gitConfigResponse = await git.listConfig(
        global ? GitConfigScope.global : GitConfigScope.local
      )
      const gitConfigFile = gitConfigResponse.files[0]
      const gitConfig = gitConfigResponse.values[gitConfigFile]
      const userEmail = gitConfig['user.email']
      if (!userEmail) {
        logger.cyan(`${global ? 'Global' : 'Local'} user is not defined.`)
        return
      }
      logger.green(`${global ? 'Global' : 'Local'} user is ${userEmail}`)
    } catch (e) {
      logger.red(`Could not get git user.`)
      logger.def(e instanceof GitError ? e.message : e)
    }
  }

  async function setUser({ work, global } = { work: false, global: false }): Promise<void> {
    try {
      const emails = Config.getGitUser()
      const email = work ? emails.workEmail : emails.personalEmail
      const scope = global ? GitConfigScope.global : GitConfigScope.local
      await git.addConfig('user.email', email, false, scope)
      logger.green(`${global ? 'Global' : 'Local'} user is set to ${email}`)
    } catch (e) {
      logger.red(`Could not set git user.`)
      logger.def(e instanceof GitError ? e.message : e)
    }
  }

  async function user([...options]: string[]): Promise<void> {
    if (!options.length) {
      await getUser()
      return
    }
    if (options.length === 1) {
      switch (options[0]) {
        case '-g':
          await getUser({ global: true })
          break
        case '-w':
          await setUser({ work: true, global: false })
          break
        case '-p':
          await setUser({ work: false, global: false })
          break
        default:
          logger.red('Unknown option parameter: ' + options[0])
          process.exit(1)
          break
      }
    } else if (options.length === 2) {
      if (!options.every(o => ['-g', '-w', '-p'].includes(o)) || !options.includes('-g')) {
        logger.red('Invalid option parameters: ' + options)
        process.exit(1)
      }
      if (options.includes('-w')) {
        await setUser({ work: true, global: true })
      } else if (options.includes('-p')) {
        await setUser({ work: false, global: true })
      }
    } else {
      logger.red('Invalid option parameters: ' + options)
      process.exit(1)
    }
  }

  return {
    user,
  }
}
