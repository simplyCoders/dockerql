import * as aws from 'aws-sdk'

import { iRegistry, iSession } from '../types'

// ----------------------------------------------
// connect
// ----------------------------------------------
export const connect = async (registry: iRegistry): Promise<iSession> => {

  const namespace = (typeof (registry.namespace) !== 'undefined') ? registry.namespace : 'us-east-1'

  // login
  const ecr = new aws.ECR({
    apiVersion: '2015-09-21',
    customUserAgent: 'dockerql',
    region: namespace,
    credentials: {
      accessKeyId: registry.username,
      secretAccessKey: registry.password,
    },
  })
  const authTokenResponse = await ecr.getAuthorizationToken().promise()
  if (!Array.isArray(authTokenResponse.authorizationData)
    || !authTokenResponse.authorizationData.length) {
    throw new Error(`ECR ${registry.name} error getting an authorization token from AWS.`)
  }

  const host = authTokenResponse.authorizationData[0].proxyEndpoint
  const token = authTokenResponse.authorizationData[0].authorizationToken
  const expiresAt = authTokenResponse.authorizationData[0].expiresAt

  console.info(`Authenticated successfully to ${registry.name} (type: ${registry.type})`)
  console.info(`Host: ${host}, Namespace (Region): ${namespace}, User: ${registry.username}`)
  console.info('--------------------------------------------------')

  return {
    registry: registry.name,
    type: registry.type,
    namespace,
    host,
    token,
    custom: {
      ecr,
      expiresAt
    }
  }
}
