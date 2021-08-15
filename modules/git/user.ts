import { GitConfigScope, GitError, SimpleGit } from 'simple-git'
import { LoggerInstance } from '../../utils/logger'
import Config from '../../utils/config'

enum UserParam {
  GLOBAL = '-g',
  WORK = '-w',
  PERSONAL = '-p',
}

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
    const params = options as UserParam[]
    if (!params.length) {
      await getUser()
      return
    }
    if (params.length === 1) {
      switch (params[0] as UserParam) {
        case UserParam.GLOBAL:
          await getUser({ global: true })
          break
        case UserParam.WORK:
          await setUser({ work: true, global: false })
          break
        case UserParam.PERSONAL:
          await setUser({ work: false, global: false })
          break
        default:
          logger.red('Unknown option parameter: ' + params[0])
          process.exit(1)
          break
      }
    } else if (params.length === 2) {
      if (
        !params.every(o => Object.values(UserParam).includes(o)) ||
        !params.includes(UserParam.GLOBAL)
      ) {
        logger.red('Invalid option parameters: ' + params)
        process.exit(1)
      }
      if (params.includes(UserParam.WORK)) {
        await setUser({ work: true, global: true })
      } else if (params.includes(UserParam.PERSONAL)) {
        await setUser({ work: false, global: true })
      }
    } else {
      logger.red('Invalid option parameters: ' + params)
      process.exit(1)
    }
  }

  return {
    user,
  }
}
