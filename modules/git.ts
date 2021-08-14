import simpleGit, { SimpleGit, SimpleGitOptions } from 'simple-git'
import Logger from '../utils/logger'
import { useGitCheckout } from './git/checkout'
import { useGitPull } from './git/pull'
import { useGitReview } from './git/review'
import { useGitClean } from './git/clean'

const options: Partial<SimpleGitOptions> = {
  baseDir: process.cwd(),
  binary: 'git',
  maxConcurrentProcesses: 6,
}

const git: SimpleGit = simpleGit(options)
const logger = Logger.getInstance('Git')

const { checkout, checkoutMaster, checkoutDevelop } = useGitCheckout(git, logger)
const { pullOriginHead } = useGitPull(git, logger)
const { review } = useGitReview(git, logger)
const { clean } = useGitClean(git, logger)

export default {
  checkout,
  checkoutDevelop,
  checkoutMaster,
  pullOriginHead,
  review,
  clean,
}
