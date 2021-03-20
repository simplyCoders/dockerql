import { Dockerhub } from './dockerhub'
import { ECR } from './ecr'
import { GCR } from './gcr'

// ----------------------------------------------
// interfaces
// ----------------------------------------------
export interface iRegistryType {
  type: string,
  connect: any,
  getNamespaces: any,
  getRepos: any,
  getImages: any
}

export interface iRegistry {
  name: string,
  type: string,
  namespace?: string,
  username?: string,
  password?: any,
  host?: string // Optional, currently only used by gcp
}

export interface iSession {
  registry: string,
  type: string,
  host: string,
  namespace: string,
  token: string,
  custom?: any
}

export interface iActiveSessions { // registry is a definition of connection details with a registry
  default: string, // name of the registry for the default session
  entries: Map<string, iSession> // map of active sessions, the index is the registry name
}

// ----------------------------------------------
// internal dictionary
// ----------------------------------------------
const registryTypes: Map<string, iRegistryType> = new Map([
  [Dockerhub.type, Dockerhub],
  [ECR.type, ECR],
  [GCR.type, GCR],
])

// ----------------------------------------------
// help functions
// ----------------------------------------------
export const getRegistryType = (type: string): iRegistryType => registryTypes.get(type)
export const isARegistryType = (type: string): boolean => registryTypes.has(type)
