import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'

import { verify, decode } from 'jsonwebtoken'
import { createLogger } from '../../utils/logger'

import { Jwt } from '../../auth/Jwt'
import { JwtPayload } from '../../auth/JwtPayload'

const logger = createLogger('auth')

// TODO: Provide a URL that can be used to download a certificate that can be used
// to verify JWT token signature.
// To get this URL you need to go to an Auth0 page -> Show Advanced Settings -> Endpoints -> JSON Web Key Set
//const jwksUrl = 'https://dev-nprun7v8.auth0.com/.well-known/jwks.json'
const secret = '-----BEGIN CERTIFICATE-----\n' +
    'MIIDBzCCAe+gAwIBAgIJGDZfrsllm4BAMA0GCSqGSIb3DQEBCwUAMCExHzAdBgNV\n' +
    'BAMTFmRldi1ucHJ1bjd2OC5hdXRoMC5jb20wHhcNMjAwNDIyMDgwNTI4WhcNMzMx\n' +
    'MjMwMDgwNTI4WjAhMR8wHQYDVQQDExZkZXYtbnBydW43djguYXV0aDAuY29tMIIB\n' +
    'IjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAuGQseYm0teM8iCym435LSIVu\n' +
    'uXaV9LGs/gCfls9L712y7V13gaISL6dp2xpZ68huCGfiRKQeKVtDrr07QKCJHUBg\n' +
    'pnChNu/mb9MOOfwDE5Jg/9Yq6HCTtZFpMOkmEGozRhiPCgdBcpknXHtuixp9CyUs\n' +
    'kEnp37ORQzWKn1KnooDC4allcKrq485Lys2UEbd7BG5Ds5E5UrUeU5H9Z7jgcMHl\n' +
    'k0VYry0hBuGNUCPKM8QgSVQn2NTUpBrwPg4siAxv7AuLcgdeCHCx13Vtyru4rsQW\n' +
    'INVr/wRqApKIB2pZkDiZjjwsiDoeEzSn9evdPrZ75Al3Riw6sYg3uBzYXpI/ywID\n' +
    'AQABo0IwQDAPBgNVHRMBAf8EBTADAQH/MB0GA1UdDgQWBBTCesH809Ab7+Xy6PeC\n' +
    '2oiQ1Pw6hzAOBgNVHQ8BAf8EBAMCAoQwDQYJKoZIhvcNAQELBQADggEBAHqfaOM+\n' +
    'VJjc6XrAfNEi01do6X1kztM9rF+c5OxSjiu5+WUebUYHHAZLhgclItKEeX2wqrWw\n' +
    'St+lbGXdKTc+yzDUiHkBv5qvSbFQMO1ZgR3XVGcT2sfmcXeylPLYlqlIWPpLROl8\n' +
    'FuflRoOZc3HebFaOEiKLl1xPjktuVozmy6Ej6H+TDP9fDm5SMyANrRt1YebmrVkp\n' +
    'hTt/MGUE0CQceNEDRA0j69LVRiWfYqqwF+1FHmK7/pDdHz+T+2BBE50NQxG8a0vc\n' +
    'ZGhviXDlhdqTs/e5el04nTGLtKg7JPVjniZHv956dkyy4FeHkU2lZt9HR+Eu5HRD\n' +
    'T/V5daJXYF7UOsg=\n' +
    '-----END CERTIFICATE-----'

export const handler = async (
  event: CustomAuthorizerEvent
): Promise<CustomAuthorizerResult> => {
  logger.info('Authorizing a user', event.authorizationToken)
  try {
    const jwtToken = await verifyToken(event.authorizationToken)
    logger.info('User was authorized', jwtToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

async function verifyToken(authHeader: string): Promise<JwtPayload> {
  const token = getToken(authHeader)
  const jwt: Jwt = decode(token, { complete: true }) as Jwt

  // TODO: Implement token verification
  // You should implement it similarly to how it was implemented for the exercise for the lesson 5
  // You can read more about how to do this here: https://auth0.com/blog/navigating-rs256-and-jwks/
  verify(token, secret)

  return jwt.payload
}

function getToken(authHeader: string): string {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}
