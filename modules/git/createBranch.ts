import { GitError, SimpleGit } from 'simple-git'
import { LoggerInstance } from '../../utils/logger'
import { confirmRepo } from '../../utils/gitUtils'

export function useGitCreateBranch(git: SimpleGit, logger: LoggerInstance) {
  async function createBranch(name: string): Promise<void> {
    try {
      await confirmRepo(logger, git)
      logger.green(`Creating branch ${name}...`)
      await git.checkoutLocalBranch(name)
    } catch (e) {
      logger.red(`Could not create branch.`)
      logger.def(e instanceof GitError ? e.message : e)
    }
  }

  return {
    createBranch,
  }
}
