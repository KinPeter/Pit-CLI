import { IOptions, Docker } from 'docker-cli-js' // https://github.com/Quobject/docker-cli-js
import Logger from '../utils/logger'
import { useDockerRemove } from './docker/remove'

const options: IOptions = { currentWorkingDirectory: process.cwd(), echo: false }
const docker = new Docker(options)
const logger = Logger.getInstance('Docker')

const { remove } = useDockerRemove(docker, logger)

export default {
  remove,
}
