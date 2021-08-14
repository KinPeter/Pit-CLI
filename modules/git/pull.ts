import { GitError, SimpleGit } from 'simple-git'
import { confirmRepo } from '../../utils/gitUtils'
import { LoggerInstance } from '../../utils/logger'

export function useGitPull(git: SimpleGit, logger: LoggerInstance) {
  async function pull(remote: string, branch: string): Promise<void> {
    try {
      logger.blue(`Pulling from ${remote}/${branch}...`)
      const res = await git.raw('pull', remote, branch)
      logger.def(res)
    } catch (e) {
      logger.red(`Could not pull from ${remote}/${branch}`)
      logger.def(e instanceof GitError ? e.message : e)
    }
  }

  async function pullOrigin(branch: string): Promise<void> {
    await pull('origin', branch)
  }

  async function pullOriginHead(): Promise<void> {
    try {
      await confirmRepo(logger, git)
      const currentBranch = (await git.branchLocal()).current
      await pullOrigin(currentBranch)
    } catch (e) {
      logger.red(`Pull failed.`)
      logger.def(e instanceof GitError ? e.message : e)
    }
  }

  return {
    pullOrigin,
    pullOriginHead,
  }
}
