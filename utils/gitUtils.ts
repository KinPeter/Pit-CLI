import { LoggerInstance } from './logger'
import { SimpleGit } from 'simple-git'

export async function confirmRepo(logger: LoggerInstance, git: SimpleGit): Promise<void> {
  const isRepo = await git.checkIsRepo()
  if (!isRepo) {
    logger.red('Not a git repository!')
    process.exit(1)
  }
}

export function getLocalName(remoteName: string): string {
  return remoteName.split('/').slice(2).join('/')
}

export function getOriginName(remoteName: string): string {
  return remoteName.split('/').slice(1).join('/')
}

export async function showLatestCommit(logger: LoggerInstance, git: SimpleGit): Promise<void> {
  const latest = (await git.log()).latest
  if (!latest) return
  logger.green(
    `Latest commit: (${latest.hash.substr(0, 8)}) "${latest.message}" by ${latest.author_name}`
  )
}
