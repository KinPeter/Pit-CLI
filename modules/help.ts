import Logger from '../utils/logger'
import { useHelp } from './help/helpByCommand'
import { PitAction } from '../enums/PitAction'

const logger = Logger.getInstance('Help')

const {
  showMainHelp,
  showCheckoutHelp,
  showCleanHelp,
  showDockerHelp,
  showJiraHelp,
  showPullHelp,
  showReviewHelp,
  showUserHelp,
} = useHelp()

function showHelp([command]: string[]): void {
  switch (command as PitAction) {
    case PitAction.CHECKOUT:
    case PitAction.CHECKOUT_ALIAS:
    case PitAction.CHECKOUT_DEVELOP:
    case PitAction.CHECKOUT_MASTER:
      showCheckoutHelp()
      break
    case PitAction.REVIEW:
    case PitAction.REVIEW_ALIAS:
      showReviewHelp()
      break
    case PitAction.CLEAN:
    case PitAction.CLEAN_ALIAS:
      showCleanHelp()
      break
    case PitAction.PULL_ORIGIN:
      showPullHelp()
      break
    case PitAction.USER:
      showUserHelp()
      break
    case PitAction.JIRA:
      showJiraHelp()
      break
    case PitAction.DOCKER:
    case PitAction.DOCKER_ALIAS:
      showDockerHelp()
      break
    case PitAction.HELP:
    case PitAction.HELP_ALIAS1:
    case PitAction.HELP_ALIAS2:
    case PitAction.HELP_ALIAS3:
      showMainHelp()
      break
    default:
      logger.red('Unknown command: ' + command.toString())
      logger.cyan('Make sure to run `pit help` with available commands.')
      break
  }
}

export default {
  showHelp,
}
