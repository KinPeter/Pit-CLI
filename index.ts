import ActionParser from './modules/actionParser'
import { PitAction } from './enums/PitAction'

const [action, ...args] = process.argv.slice(2)

ActionParser.parse(action as PitAction, args).then()
