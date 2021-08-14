import { GitError, SimpleGit } from 'simple-git'
import { LoggerInstance } from '../../utils/logger'
import { confirmRepo } from '../../utils/gitUtils'
import Ui from '../../utils/ui'

const protectedBranches = ['main', 'master', 'develop', 'staging']

export function useGitClean(git: SimpleGit, logger: LoggerInstance) {
  async function autoClean(option: string): Promise<void> {
    const isForce = option.includes('f')
    try {
      const branches = await git.branchLocal()
      const filteredBranches = branches.all.filter(
        b => b !== branches.current && !protectedBranches.includes(b)
      )
      for (const branch of filteredBranches) {
        try {
          await git.deleteLocalBranch(branch, isForce)
          logger.green(`Deleted branch ${branch}`)
        } catch (e) {
          logger.cyan(`Could not delete ${branch}, please try manually.`)
          logger.def(e)
        }
      }
    } catch (e) {
      logger.red(`Branch auto clean failed.`)
      logger.def(e instanceof GitError ? e.message : e)
    }
  }

  async function cleanWithSelect(): Promise<void> {
    try {
      const branches = await git.branchLocal()
      const currentExcluded = branches.all.filter(b => b !== branches.current)
      if (!currentExcluded?.length) {
        logger.cyan('No branches to clean, exiting...')
        return
      }
      const description = 'Select branches to delete:'
      const selected = await Ui.multiSelectString(description, currentExcluded)
      if (!selected?.length) {
        logger.cyan('Nothing selected, exiting...')
        return
      }
      for (const branch of selected) {
        await git.deleteLocalBranch(branch, true)
        logger.green(`Deleted branch ${branch}`)
      }
    } catch (e) {
      logger.red(`Branch clean failed.`)
      logger.def(e instanceof GitError ? e.message : e)
    }
  }

  async function clean([option, ..._rest]: string[]): Promise<void> {
    await confirmRepo(logger, git)
    if (!option) {
      await cleanWithSelect()
      return
    }
    switch (option) {
      case '-a':
      case '-af':
        await autoClean(option)
        break
      default:
        logger.red('Unknown option argument: ' + option)
        process.exit(1)
    }
  }

  return {
    clean,
  }
}
