import * as aws from 'aws-sdk'

import { DQLError } from '../../types'
import { iRegistry, iSession } from '../types'
import * as logger from '../../helpers/logger'

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
    throw { code: 400, message: `ECR "${registry.name}" error getting an authorization token from AWS.` } as DQLError
  }

  const host = authTokenResponse.authorizationData[0].proxyEndpoint
  const token = authTokenResponse.authorizationData[0].authorizationToken
  const expiresAt = authTokenResponse.authorizationData[0].expiresAt

  logger.info(`Authenticated successfully to ${registry.name} (type: ${registry.type})`)
  logger.info(`Host: ${host}, Namespace (Region): ${namespace}, User: ${registry.username}`)
  logger.info('--------------------------------------------------')

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
