import simpleGit, { SimpleGit, SimpleGitOptions } from 'simple-git'
import Logger from '../utils/logger'

const options: Partial<SimpleGitOptions> = {
  baseDir: process.cwd(),
  binary: 'git',
  maxConcurrentProcesses: 6,
}

const git: SimpleGit = simpleGit(options)
const logger = Logger.getInstance('Git')

async function confirmRepo(): Promise<void> {
  const isRepo = await git.checkIsRepo()
  if (!isRepo) {
    logger.red('Not a git repository!')
    process.exit(1)
  }
}

async function checkout([branchNumber, ..._rest]: string[]): Promise<void> {
  await confirmRepo()
  const branches = await git.branchLocal()
  console.log(branches, branchNumber)
}

async function checkoutDevelop([flag]: string[]): Promise<void> {
  await confirmRepo()
  await git.checkout('develop')
  if (flag === '-r') {
    const res = await git.pull('origin', 'develop')
    console.log(res)
  }
}

export default {
  checkout,
  checkoutDevelop,
}
