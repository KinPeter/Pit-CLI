import { LoggerInstance } from '../../utils/logger'
import Config from '../../utils/config'
import axios from 'axios'
import {
  BranchNaming,
  createAuthorizationString,
  getSuggestedBranchName,
  JiraIssue,
  printIssueData,
} from '../../utils/jiraUtils'
import Git from '../git'

export function useJiraIssue(logger: LoggerInstance) {
  function initialize() {
    const projectConfig = Config.getCurrentJiraProject()
    const baseUrl = `${projectConfig.url}/rest/api/3/issue/${projectConfig.prefix}-`
    const http = axios.create({
      headers: {
        Authorization: createAuthorizationString(projectConfig),
      },
    })
    return {
      projectConfig,
      baseUrl,
      http,
    }
  }

  async function getIssueData(issueNumber: string): Promise<JiraIssue> {
    try {
      const { projectConfig, http, baseUrl } = initialize()
      const res = await http.get(baseUrl + issueNumber)
      const data = res.data as JiraIssue
      printIssueData(data, projectConfig)
      return data
    } catch (e) {
      logger.red(`Could not fetch issue data.`)
      console.log('Error:', (e as any)?.response?.data ?? (e as any).message)
      process.exit(1)
    }
  }

  async function getDataAndCreateBranch(
    issueNumber: string,
    options: { type: BranchNaming } = { type: BranchNaming.FULL }
  ): Promise<void> {
    const issue = await getIssueData(issueNumber)
    const { type } = options
    const branchName = getSuggestedBranchName({ issue, type })
    await Git.createBranch(branchName)
  }

  function parseIssueNumber(options: string[]): string {
    const issueNumber = options.find(o => !['-c', '-cs', '-ck'].includes(o))
    if (!issueNumber) {
      logger.red('Could not parse issue number.')
      process.exit(1)
    }
    return issueNumber
  }

  async function run(options: string[]): Promise<void> {
    if (!options.length) {
      logger.red('Please specify at least one parameter.')
      process.exit(1)
    } else if (options.length === 1) {
      await getIssueData(options[0])
    } else if (options.length === 2 && options.includes('-cs')) {
      await getDataAndCreateBranch(parseIssueNumber(options), { type: BranchNaming.SHORT })
    } else if (options.length === 2 && options.includes('-ck')) {
      await getDataAndCreateBranch(parseIssueNumber(options), { type: BranchNaming.KEY_ONLY })
    } else if (options.length === 2 && options.includes('-c')) {
      await getDataAndCreateBranch(parseIssueNumber(options), { type: BranchNaming.FULL })
    } else {
      logger.red('Invalid option parameters: ' + options)
      process.exit(1)
    }
  }

  return {
    run,
  }
}
