import Logger from '../utils/logger'
import { useJiraIssue } from './jira/issue'

const logger = Logger.getInstance('Jira')

const { run } = useJiraIssue(logger)

export default {
  run,
}
