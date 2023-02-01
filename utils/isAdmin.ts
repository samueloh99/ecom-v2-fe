import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult
} from 'next'

import jwt_decode from 'jwt-decode'
import { destroyCookie, parseCookies } from 'nookies'
import { AuthTokenError } from '../src/services/errors/AuthTokenError'

export function isAdmin<P>(fn: GetServerSideProps<P>) {
  return async (
    ctx: GetServerSidePropsContext
  ): Promise<GetServerSidePropsResult<P>> => {
    const cookies = parseCookies(ctx)

    if (!cookies['nextauth.token']) {
      return {
        redirect: {
          destination: '/login',
          permanent: false
        }
      }
    } else {
      const verifyIsAdmin = jwt_decode(cookies['nextauth.token'])
        ['sub'].split('/')
        .includes('false')

      if (verifyIsAdmin === true) {
        return {
          redirect: {
            destination: '/',
            permanent: false
          }
        }
      }
    }

    try {
      return await fn(ctx)
    } catch (err) {
      if (err instanceof AuthTokenError) {
        destroyCookie(ctx, 'nextauth.token')
        destroyCookie(ctx, 'nextauth.refreshToken')

        return {
          redirect: {
            destination: '/',
            permanent: false
          }
        }
      }
    }
  }
}
