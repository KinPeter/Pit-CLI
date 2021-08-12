import ActionParser from './modules/actionParser'
import { PitAction } from './enums/PitAction'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const [_node, _app, action, ...args] = process.argv

ActionParser.parse(action as PitAction, args).then()
