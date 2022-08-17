import { GitError, SimpleGit } from 'simple-git'
import { confirmRepo } from '../../utils/gitUtils'
import { LoggerInstance } from '../../utils/logger'

export function useGitPull(git: SimpleGit, logger: LoggerInstance) {
  async function pull(remote: string, branch: string, withRebase = false): Promise<void> {
    try {
      let res: string
      if (withRebase) {
        logger.blue(`Pulling from ${remote}/${branch} with rebasing...`)
        res = await git.raw('pull', remote, branch, '--rebase')
      } else {
        logger.blue(`Pulling from ${remote}/${branch}...`)
        res = await git.raw('pull', remote, branch)
      }
      logger.def(res)
    } catch (e) {
      logger.red(`Could not pull from ${remote}/${branch}`)
      logger.def(e instanceof GitError ? e.message : e)
    }
  }

  async function pullOrigin(branch: string, withRebase = false): Promise<void> {
    await pull('origin', branch, withRebase)
  }

  async function pullOriginHead(
    { rebase }: { rebase: boolean } = { rebase: false }
  ): Promise<void> {
    try {
      await confirmRepo(logger, git)
      const currentBranch = (await git.branchLocal()).current
      await pullOrigin(currentBranch, rebase)
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
