import { Docker } from 'docker-cli-js'
import { LoggerInstance } from '../../utils/logger'

export enum RemoveAction {
  CONTAINERS = 'rm',
  IMAGES = 'rmi',
  VOLUMES = 'rmv',
}

export function useDockerRemove(docker: Docker, logger: LoggerInstance) {
  async function remove([action]: string[]): Promise<void> {
    logger.green(action)
    const data = await docker.command('ps -a')
    console.log(data)
  }

  return {
    remove,
  }
}
