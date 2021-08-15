import { Docker } from 'docker-cli-js'
import { LoggerInstance } from '../../utils/logger'
import {
  DockerContainersResponse,
  DockerImagesResponse,
  DockerResponse,
  getContainerList,
  getImageList,
  getVolumeList,
  makeContainerOptions,
  makeImageOptions,
} from '../../utils/dockerUtils'
import Ui from '../../utils/ui'

export enum RemoveAction {
  CONTAINERS = 'rm',
  IMAGES = 'rmi',
  VOLUMES = 'rmv',
}

export function useDockerRemove(docker: Docker, logger: LoggerInstance) {
  async function removeContainers(): Promise<void> {
    try {
      const data = await docker.command('ps -a')
      const containers = getContainerList(data as DockerContainersResponse)
      if (!containers?.length) {
        logger.cyan('No containers found, exiting...')
        return
      }
      const options = makeContainerOptions(containers)
      const description = 'Select containers to remove:'
      const selected = await Ui.multiSelect(description, options)
      if (!selected?.length) {
        logger.cyan('Nothing selected, exiting...')
        return
      }
      for (const id of selected) {
        const container = containers.find(c => c.id === id)
        logger.green(`Removing container: ${container?.names}`)
        await docker.command(`rm ${id}`)
      }
    } catch (e) {
      logger.red('Could not remove containers.')
      logger.def(e)
    }
  }

  async function removeImages(): Promise<void> {
    try {
      const data = await docker.command('images')
      const images = getImageList(data as DockerImagesResponse)
      if (!images?.length) {
        logger.cyan('No images found, exiting...')
        return
      }
      const options = makeImageOptions(images)
      const description = 'Select images to remove:'
      const selected = await Ui.multiSelect(description, options)
      if (!selected?.length) {
        logger.cyan('Nothing selected, exiting...')
        return
      }
      for (const id of selected) {
        const image = images.find(i => i.id === id)
        logger.green(`Removing image: ${image?.repository}:${image?.tag}`)
        await docker.command(`rmi ${id}`)
      }
    } catch (e) {
      logger.red('Could not remove images.')
      logger.def(e)
    }
  }

  async function removeVolumes(): Promise<void> {
    try {
      const data = await docker.command('volume ls --format "{{.Name}}"')
      const volumes = getVolumeList(data as DockerResponse)
      if (!volumes?.length) {
        logger.cyan('No volumes found, exiting...')
        return
      }
      const description = 'Select volumes to remove:'
      const selected = await Ui.multiSelectString(description, volumes)
      if (!selected?.length) {
        logger.cyan('Nothing selected, exiting...')
        return
      }
      for (const volume of selected) {
        logger.green(`Removing volume: ${volume}`)
        await docker.command(`volume rm ${volume}`)
      }
    } catch (e) {
      logger.red('Could not remove volumes.')
      logger.def(e)
    }
  }

  async function remove([action]: string[]): Promise<void> {
    switch (action as RemoveAction) {
      case RemoveAction.CONTAINERS:
        await removeContainers()
        break
      case RemoveAction.IMAGES:
        await removeImages()
        break
      case RemoveAction.VOLUMES:
        await removeVolumes()
        break
      default:
        logger.red('Unknown action parameter: ' + action)
        process.exit(1)
    }
  }

  return {
    remove,
  }
}
