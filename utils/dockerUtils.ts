import { Choice } from 'prompts'

export interface DockerResponse {
  command: string
  raw: string
}

export interface DockerContainersResponse extends DockerResponse {
  containerList: DockerContainerListItem[]
}

export interface DockerContainerListItem {
  'container id': string
  id: string
  image: string
  command: string
  created: string
  status: string
  ports: string
  names: string
}

export interface DockerImagesResponse extends DockerResponse {
  images: DockerImageListItem[]
}

export interface DockerImageListItem {
  'image id': string
  id: string
  repository: string
  tag: string
  created: string
  size: string
}

export function getContainerList(res: DockerContainersResponse): DockerContainerListItem[] {
  return res.containerList.map(item => ({
    ...item,
    id: item['container id'],
  }))
}

export function getImageList(res: DockerImagesResponse): DockerImageListItem[] {
  return res.images.map(item => ({
    ...item,
    id: item['image id'],
  }))
}

export function getVolumeList(res: DockerResponse): string[] {
  return res.raw.split('\n').filter(line => line !== '')
}

export function makeContainerOptions(list: DockerContainerListItem[]): Choice[] {
  return list.map(item => ({
    title: `${item.names} (${item.status})`,
    value: item.id,
  }))
}

export function makeImageOptions(list: DockerImageListItem[]): Choice[] {
  return list.map(item => ({
    title: `${item.repository}:${item.tag} (${item.size})`,
    value: item.id,
  }))
}
