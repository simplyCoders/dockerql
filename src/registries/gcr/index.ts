import { init } from './init'
import { getNamespaces } from './namespaces'
import { getRepos } from './repos'
import { getImages } from './images'

import { RegistryType } from '../registry-type'

export const GCR = new RegistryType(
  'gcr',
  init,
  getNamespaces,
  getRepos,
  getImages,
)
