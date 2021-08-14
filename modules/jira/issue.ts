import { LoggerInstance } from '../../utils/logger'
import Config from '../../utils/config'
import axios from 'axios'
import {
  createAuthorizationString,
  getSuggestedBranchName,
  JiraIssue,
  printIssueData,
} from '../../utils/jiraUtils'
import Git from '../git'
import { GitError } from 'simple-git'

export function useJiraIssue(logger: LoggerInstance) {
  const projectConfig = Config.getCurrentJiraProject()
  const baseUrl = `${projectConfig.url}/rest/api/3/issue/${projectConfig.prefix}-`
  const http = axios.create({
    headers: {
      Authorization: createAuthorizationString(projectConfig),
    },
  })

  async function getIssueData(issueNumber: string): Promise<JiraIssue> {
    try {
      const res = await http.get(baseUrl + issueNumber)
      const data = res.data as JiraIssue
      printIssueData(data, projectConfig)
      return data
    } catch (e) {
      logger.red(`Could not fetch issue data.`)
      logger.def(e instanceof GitError ? e.message : e)
      process.exit(1)
    }
  }

  async function getDataAndCreateBranch(issueNumber: string): Promise<void> {
    const issue = await getIssueData(issueNumber)
    const branchName = getSuggestedBranchName(issue)
    await Git.createBranch(branchName)
  }

  function parseIssueNumber(options: string[]): string {
    const issueNumber = options.find(o => o !== '-c')
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
    } else if (options.length === 2 && options.includes('-c')) {
      await getDataAndCreateBranch(parseIssueNumber(options))
    } else {
      logger.red('Invalid option parameters: ' + options)
      process.exit(1)
    }
  }

  return {
    run,
  }
}
