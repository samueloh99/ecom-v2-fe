import axios, { AxiosError } from 'axios'
import { parseCookies, setCookie } from 'nookies'
import { signOut } from '../contexts/AuthContext'

let isRefreshing = false
let failedRequestQueue = []

export function setupAPIClient(ctx = undefined) {
  let cookies = parseCookies(ctx)

  const api = axios.create({
    baseURL: 'https://backend.chaes.com.br',
    headers: {
      'secret-key': '1a4556dfdc663c87e2fd585a7fbd93cb',
      Authorization: `Bearer ${cookies['nextauth.token']}`
    }
  })

  // REFRESH TOKEN
  api.interceptors.response.use(
    response => {
      return response
    },
    (error: AxiosError) => {
      if (error.response.status === 401) {
        //RENOVAR O TOKEN
        if (error.response.data.message === 'Invalid JWT token') {
          cookies = parseCookies(ctx)

          const { 'nextauth.refreshToken': refreshToken } = cookies
          const originalConfig = error.config

          if (!isRefreshing) {
            isRefreshing = true
            api
              .post('/refresh_token', {
                refresh_token: refreshToken
              })
              .then(response => {
                const { token } = response.data

                setCookie(ctx, 'nextauth.token', token, {
                  maxAge: 60 * 60 * 24 * 30, // 1 mes,
                  path: '/'
                })

                if (response.data.refreshTokenId !== undefined) {
                  setCookie(
                    ctx,
                    'nextauth.refreshToken',
                    response.data.refreshTokenId,
                    {
                      maxAge: 60 * 60 * 24 * 30, // 1 mes,
                      path: '/'
                    }
                  )
                }

                api.defaults.headers['Authorization'] = `Bearer ${token}`

                failedRequestQueue.forEach(request => request.onSuccess(token))
                failedRequestQueue = []
              })
              .catch(err => {
                failedRequestQueue.forEach(request => request.onFailure(err))
                failedRequestQueue = []

                if (process.browser) {
                  signOut()
                }
              })
              .finally(() => {
                isRefreshing = false
              })
          }

          return new Promise((resolve, reject) => {
            failedRequestQueue.push({
              onSuccess: (token: string) => {
                originalConfig.headers['Authorization'] = `Bearer ${token}`

                resolve(api(originalConfig))
              },
              onFailure: (err: AxiosError) => {
                reject(err)
              }
            })
          })
        } else {
          signOut()
        }
      }
      return Promise.reject(error)
    }
  )

  return api
}
