import * as fs from 'fs'
import * as os from 'os'
import * as path from 'path'
import Logger from './logger'

const logger = Logger.getInstance('Config')

export interface PitConfig {
  gitUser: GitUser
  jiraProjects: Record<string, JiraProject>
}

export interface GitUser {
  personalEmail: string
  workEmail: string
}

export interface JiraProject {
  prefix: string // project prefix of issue numbers e.g. DC-
  folders: string[] // local folders connected to the project
  url: string // Jira board base url
  user: string // email used to log in to Jira
  apiToken: string // Jira API Token
}

function validateConfigFile(config: PitConfig): void {
  if (
    !config?.gitUser?.workEmail ||
    typeof config.gitUser.workEmail !== 'string' ||
    !config?.gitUser?.personalEmail ||
    typeof config.gitUser.personalEmail !== 'string' ||
    !config?.jiraProjects ||
    Object.values(config.jiraProjects).some(p => {
      return (
        !p.prefix || !p.url || !p.user || !p.apiToken || !p.folders || !Array.isArray(p.folders)
      )
    })
  ) {
    logger.red('Invalid config file')
    process.exit(1)
  }
}
function readConfigFile(): PitConfig {
  try {
    const homePath = os.homedir()
    const configPath = path.join(homePath, '.pitconfig.json')
    if (!fs.existsSync(configPath)) {
      logger.red('Config file has not been found at ' + configPath)
      process.exit(1)
    }
    const rawData = fs.readFileSync(configPath)
    const config: PitConfig = JSON.parse(rawData.toString())
    validateConfigFile(config)
    return config
  } catch (e) {
    logger.red('Could not parse config file.')
    logger.def(e)
    process.exit(1)
  }
}

function getGitUser(): GitUser {
  return readConfigFile().gitUser
}

function getCurrentJiraProject(): JiraProject {
  const projects = Object.values(readConfigFile().jiraProjects)
  const currentFolder = path.basename(path.resolve(process.cwd()))
  const project = projects.find(p => p.folders.includes(currentFolder))
  if (!project) {
    logger.red('Could not find Jira project in config.')
    process.exit(1)
  }
  return project
}

export default {
  getGitUser,
  getCurrentJiraProject,
}
