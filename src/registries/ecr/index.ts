import { init } from './init'
import { getNamespaces } from './namespaces'
import { getRepos } from './repos'
import { getImages } from './images'

import { RegistryType } from '../registry-type'

export const ECR = new RegistryType(
  'ecr',
  init,
  getNamespaces,
  getRepos,
  getImages,
)
