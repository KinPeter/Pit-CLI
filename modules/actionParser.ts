import { PitAction } from '../enums/PitAction'
import Git from './git'
import Jira from './jira'

async function parse(action: PitAction, args: string[]): Promise<void> {
  console.log('cwd:', process.cwd(), 'action:', action, 'args:', JSON.stringify(args))
  switch (action) {
    case PitAction.CHECKOUT:
    case PitAction.CHECKOUT_ALIAS:
      await Git.checkout(args)
      break
    case PitAction.CHECKOUT_DEVELOP:
      await Git.checkoutDevelop(args)
      break
    case PitAction.CHECKOUT_MASTER:
      await Git.checkoutMaster(args)
      break
    case PitAction.REVIEW:
    case PitAction.REVIEW_ALIAS:
      await Git.review(args)
      break
    case PitAction.CLEAN:
    case PitAction.CLEAN_ALIAS:
      await Git.clean(args)
      break
    case PitAction.PULL_ORIGIN:
      await Git.pullOriginHead()
      break
    case PitAction.USER:
      await Git.user(args)
      break
    case PitAction.JIRA:
      await Jira.run(args)
      break
    case PitAction.DOCKER:
    case PitAction.DOCKER_ALIAS:
      break
    case PitAction.HELP:
      break
    case PitAction.DEBUG:
      break
    default:
      break
  }
}

export default {
  parse,
}
