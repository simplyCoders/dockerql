import aws from 'aws-sdk'

export const type = 'ecr'

export const init = async (config: any): Promise<any> => {
  const namespace = (typeof (config.namespace) !== 'undefined') ? config.namespace : 'us-east-1'

  // login
  const ecr = new aws.ECR({
    apiVersion: '2015-09-21',
    customUserAgent: 'dockerql',
    region: namespace,
    credentials: {
      accessKeyId: config.username,
      secretAccessKey: config.password,
    },
  })
  const authTokenResponse = await ecr.getAuthorizationToken().promise()
  if (!Array.isArray(authTokenResponse.authorizationData)
    || !authTokenResponse.authorizationData.length) {
    throw new Error(`ECR ${config.name} error getting an authorization token from AWS.`)
  }

  const context = {
    type,
    name: config.name,
    host: authTokenResponse.authorizationData[0].proxyEndpoint,
    namespace,
    username: config.username,
    password: config.password,
    token: authTokenResponse.authorizationData[0].authorizationToken,
    expiresAt: authTokenResponse.authorizationData[0].expiresAt,
    ecr,
  }

  console.info(`Authenticated successfully to ${config.name} (type: ${type})`)
  console.info('Host:', context.host)
  console.info('Namespace (Region):', namespace)
  console.info('User:', config.username)
  console.info('--------------------------------------------------')

  return context
}
