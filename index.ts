import simpleGit, { SimpleGit, SimpleGitOptions } from 'simple-git'

const options: Partial<SimpleGitOptions> = {
  baseDir: process.cwd(),
  binary: 'git',
  maxConcurrentProcesses: 6,
}

// when setting all options in a single object
const git: SimpleGit = simpleGit(options)

async function run(): Promise<void> {
  const branches = await git.branchLocal()
  console.log(branches)
}

run().then(() => console.log('finished'))
