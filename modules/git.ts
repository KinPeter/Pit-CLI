import simpleGit, { GitError, SimpleGit, SimpleGitOptions } from 'simple-git'
import Logger from '../utils/logger'
import { confirmRepo, getLocalName, showLatestCommit } from '../utils/gitUtils'

const options: Partial<SimpleGitOptions> = {
  baseDir: process.cwd(),
  binary: 'git',
  maxConcurrentProcesses: 6,
}

const git: SimpleGit = simpleGit(options)
const logger = Logger.getInstance('Git')

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

async function checkoutBranch(namePart: string): Promise<void> {
  try {
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

async function checkout([branchNumber, ..._rest]: string[]): Promise<void> {
  await confirmRepo(logger, git)
  await checkoutBranch(branchNumber)
}

async function checkoutDevelop([flag]: string[]): Promise<void> {
  try {
    await confirmRepo(logger, git)
    logger.blue(`Switching to branch develop...`)
    await git.checkout('develop')
    if (flag === '-r') {
      await pullOrigin('develop')
    }
    await showLatestCommit(logger, git)
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
    if (flag === '-r') {
      await pullOrigin(branch)
    }
    await showLatestCommit(logger, git)
  } catch (e) {
    logger.red(`Checkout failed.`)
    logger.def(e instanceof GitError ? e.message : e)
  }
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

export default {
  checkout,
  checkoutDevelop,
  checkoutMaster,
  pullOriginHead,
}
