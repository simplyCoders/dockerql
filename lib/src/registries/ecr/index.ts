import { connect } from './connect'
import { getNamespaces } from './namespaces'
import { getRepos } from './repos'
import { getImages } from './images'
import { iRegistryType } from '../types'

export const ECR = {
  type: 'ecr',
  connect,
  getNamespaces,
  getRepos,
  getImages
} as iRegistryType
