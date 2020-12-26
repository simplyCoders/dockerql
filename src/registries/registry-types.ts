import { RegistryType } from './registry-type'
import { Dockerhub } from './dockerhub'
import { GCR } from './gcr'

// registry data model
const registryTypes: Map<string, RegistryType> = new Map([
  [Dockerhub.type, Dockerhub],
  [GCR.type, GCR],
])

// ----------------------------------------------
// getRegistryType
// ----------------------------------------------
export const getRegistryType = (type:string): RegistryType => registryTypes.get(type)
export const isARegistryType = (type:string): Boolean => registryTypes.has(type)
