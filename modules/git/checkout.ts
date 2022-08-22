import { GitError, SimpleGit } from 'simple-git'
import { LoggerInstance } from '../../utils/logger'
import { confirmRepo, getLocalName, showLatestCommit } from '../../utils/gitUtils'
import Ui from '../../utils/ui'
import { useGitPull } from './pull'

export function useGitCheckout(git: SimpleGit, logger: LoggerInstance) {
  const { pullOrigin } = useGitPull(git, logger)

  async function checkoutBranch(namePart: string): Promise<void> {
    try {
      if (namePart === '-') {
        logger.blue(`Switching to previous branch...`)
        await git.raw('checkout', '-')
        await showLatestCommit(logger, git)
        return
      }
      let branch: string | undefined
      const localBranches = await git.branchLocal()
      if (localBranches.all.length) {
        branch = localBranches.all.find(name => name.includes(namePart))
        if (branch) {
          logger.blue(`Switching to branch ${branch}...`)
          await git.checkout(branch)
          await showLatestCommit(logger, git)
          return
        }
      }
      await git.fetch(['--prune'])
      const allBranches = await git.branch()
      branch = allBranches.all.find(name => name.includes(namePart))
      if (!branch) {
        logger.red('No such branch found.')
        return
      }
      logger.blue('Only remote found.')
      logger.blue(`Switching to branch ${branch}...`)
      await git.checkout(getLocalName(branch))
      await showLatestCommit(logger, git)
    } catch (e) {
      logger.red(`Checkout failed.`)
      logger.def(e instanceof GitError ? e.message : e)
    }
  }

  async function checkoutWithSelect(): Promise<void> {
    try {
      const branches = await git.branch()
      const description = 'Select a branch to check out:'
      const selected = await Ui.selectMenuString(description, branches.all)
      if (!selected) {
        logger.cyan('Nothing selected, exiting...')
        return
      }
      const isRemoteOnly = selected.startsWith('remotes/')
      const branch = isRemoteOnly ? getLocalName(selected) : selected
      logger.blue(`Switching to branch ${branch}...`)
      await git.checkout(branch)
      await showLatestCommit(logger, git)
    } catch (e) {
      logger.red(`Checkout failed.`)
      logger.def(e instanceof GitError ? e.message : e)
    }
  }

  async function checkout([branchNumber, ..._rest]: string[]): Promise<void> {
    await confirmRepo(logger, git)
    if (branchNumber) {
      await checkoutBranch(branchNumber)
      return
    }
    await checkoutWithSelect()
  }

  async function checkoutDevelop([flag]: string[]): Promise<void> {
    try {
      await confirmRepo(logger, git)
      logger.blue(`Switching to branch develop...`)
      await git.checkout('develop')
      if (flag === '-r' || flag === '-rr') {
        await pullOrigin('develop', flag === '-rr')
      }
    } catch (e) {
      logger.red(`Checkout failed.`)
      logger.def(e instanceof GitError ? e.message : e)
    }
  }

  async function checkoutMaster([flag]: string[]): Promise<void> {
    try {
      await confirmRepo(logger, git)
      const branches = await git.branch()
      const hasMain = branches.all.includes('main')
      const branch = hasMain ? 'main' : 'master'
      logger.blue(`Switching to branch ${branch}...`)
      await git.checkout(branch)
      if (flag === '-r' || flag === '-rr') {
        await pullOrigin(branch, flag === '-rr')
      }
    } catch (e) {
      logger.red(`Checkout failed.`)
      logger.def(e instanceof GitError ? e.message : e)
    }
  }

  return {
    checkout,
    checkoutDevelop,
    checkoutMaster,
  }
}
