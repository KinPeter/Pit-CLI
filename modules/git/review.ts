import { GitError, SimpleGit } from 'simple-git'
import { LoggerInstance } from '../../utils/logger'
import { confirmRepo, getLocalName, getOriginName, showLatestCommit } from '../../utils/gitUtils'
import Ui from '../../utils/ui'

export function useGitReview(git: SimpleGit, logger: LoggerInstance) {
  async function reviewBranch(namePart: string): Promise<void> {
    try {
      logger.blue('Fetching from remote origin...')
      await git.fetch(['--prune'])
      const allBranches = await git.branch()
      const branch = allBranches.all.find(name => name.includes(namePart))
      if (!branch) {
        logger.red('No such branch found.')
        return
      }
      if (!branch.startsWith('remotes/')) {
        logger.cyan('Branch is already checked out locally, please use that and pull.')
        return
      }
      const origin = getOriginName(branch)
      logger.blue(`Switching to remote branch ${origin}...`)
      await git.checkout(origin)
      await showLatestCommit(logger, git)
    } catch (e) {
      logger.red(`Failed to checkout branch for review.`)
      logger.def(e instanceof GitError ? e.message : e)
    }
  }

  async function reviewWithSelect(): Promise<void> {
    try {
      logger.blue('Fetching from remote origin...')
      await git.fetch(['--prune'])
      const branches = await git.branch()
      const remoteBranches = branches.all.filter(b => b.startsWith('remotes/'))
      const localBranches = branches.all.filter(b => !b.startsWith('remotes/'))
      const description = 'Select a branch to review:'
      const selected = await Ui.selectMenuString(description, remoteBranches)
      if (!selected) {
        logger.cyan('Nothing selected, exiting...')
        return
      }
      if (localBranches.includes(getLocalName(selected))) {
        logger.cyan('Branch is already checked out locally, please use that and pull.')
        return
      }
      const origin = getOriginName(selected)
      logger.blue(`Switching to remote branch ${origin}...`)
      await git.checkout(origin)
      await showLatestCommit(logger, git)
    } catch (e) {
      logger.red(`Failed to checkout branch for review.`)
      logger.def(e instanceof GitError ? e.message : e)
    }
  }

  async function review([branchNumber, ..._rest]: string[]): Promise<void> {
    await confirmRepo(logger, git)
    if (branchNumber) {
      await reviewBranch(branchNumber)
      return
    }
    await reviewWithSelect()
  }

  return {
    review,
  }
}
