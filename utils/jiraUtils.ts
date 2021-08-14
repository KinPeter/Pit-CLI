import { JiraProject } from './config'
import { blue } from 'chalk'

const specialCharacters = /[$&+,:;=?¿@#|'<>.^*()%!¡~/`\]\[{}\\_-]/g
const spaces = /\s/g

export interface JiraIssue {
  id: string
  key: string
  fields: IssueFields
}

export interface IssueFields {
  summary: string
  issuetype: NamedProperty
  resolution: NamedProperty
  status: NamedProperty
  components: NamedProperty[]
  reporter: JiraUser
  assignee: JiraUser
  parent: JiraIssue
}

export interface NamedProperty {
  name: string
}

export interface JiraUser {
  displayName: string
}

export function createAuthorizationString(config: JiraProject): string {
  const string = `${config.user}:${config.apiToken}`
  const buffer = Buffer.from(string)
  const base64 = buffer.toString('base64')
  return `Basic ${base64}`
}

export function printIssueData(issue: JiraIssue, config: JiraProject): void {
  const componentNames = issue.fields.components.map(c => c.name)
  const components = componentNames.length ? componentNames.join(', ') : '<none>'
  const l = console.log
  l(blue(`\n[Jira] ${issue.key}: ${issue.fields.summary}`))
  l()
  l(`${blue('Type:')}       ${issue.fields.issuetype.name}`)
  l(`${blue('Components:')} ${components}`)
  l()
  l(`${blue('Status:')}     ${issue.fields.status.name}`)
  if (issue.fields.resolution) {
    l(`${blue('Resolution:')} ${issue.fields.resolution.name}`)
  }
  l()
  l(`${blue('Reporter:')}   ${issue.fields.reporter.displayName}`)
  if (issue.fields.assignee) {
    l(`${blue('Assignee:')}   ${issue.fields.assignee.displayName}`)
  }
  l()
  l(`${blue('Link:')}       ${config.url}/browse/${issue.key}`)
  l()
  if (issue.fields.parent) {
    l(`${blue('Parent:')}     ${issue.fields.parent.key}: ${issue.fields.parent.fields.summary}`)
    l(`${blue('Link:')}       ${config.url}/browse/${issue.fields.parent.key}`)
    l()
  }
  l()
  l(`${blue('Suggested:')}  ${getSuggestedBranchName(issue)}`)
  l()
}

export function getSuggestedBranchName(issue: JiraIssue): string {
  const branchType = issue.fields.issuetype.name === 'Bug' ? 'bugfix' : 'feature'
  const summary = issue.fields.summary
    .trim()
    .toLowerCase()
    .replace(specialCharacters, '')
    .replace(spaces, '-')
  return `${branchType}/${issue.key}-${summary}`
}
