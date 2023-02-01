import {
  createContext,
  ReactNode,
  useState,
  useEffect,
  useContext,
  MutableRefObject,
  useRef,
  useMemo
} from 'react'

import { setCookie, parseCookies, destroyCookie } from 'nookies'

import Router from 'next/router'

import { api } from '../services/apiClient'

type User = {
  id: number
  tipo: number
  ativo: number
  nome_completo: string
  email: string
  celular: string
  telefone: string
  cpf: string
  nascimento: string
  genero: string
  created_at: Date
  updated_at: Date
  ie: string
  im: string
  cnpj: string
  newsletter: number
  data_acesso: Date
  total_pedidos: number
  estrangeiro: number
  permissoes: string[]
  roles: string[]
}

type SignInCredentials = {
  email: string
  senha: string
}

type AuthContextData = {
  signIn(credentials: SignInCredentials): Promise<number>
  signInCheckout(credentials: SignInCredentials): Promise<User | number>
  signOut: () => void
  userData: User
  setUserData: ({}: User) => void
  isAuthenticated: Boolean
  broadcastAuth: MutableRefObject<BroadcastChannel>
}

type AuthProviderProps = {
  children: ReactNode
}

export const AuthContext = createContext({} as AuthContextData)

export function signOut() {
  destroyCookie(undefined, 'nextauth.token')
  destroyCookie(undefined, 'nextauth.refreshToken')
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [userData, setUserData] = useState<User>()
  const isAuthenticated = useMemo(() => Boolean(userData), [userData])
  const cookies = parseCookies()
  const broadcastAuth = useRef<BroadcastChannel>(null)

  useEffect(() => {
    broadcastAuth.current = new BroadcastChannel('auth')

    broadcastAuth.current.onmessage = message => {
      switch (message.data) {
        case 'signOut':
          signOut()
          break

        default:
          break
      }
    }
  }, [broadcastAuth])

  // RECUPERANDO OS DADOS DO USUARIOS SE ELE TIVER LOGADO
  useEffect(() => {
    if (cookies['nextauth.token']) {
      api
        .get('perfil')
        .then(response => {
          const {
            email,
            roles,
            permissoes,
            id,
            tipo,
            ativo,
            nome_completo,
            celular,
            telefone,
            cpf,
            nascimento,
            genero,
            created_at,
            updated_at,
            cnpj,
            data_acesso,
            estrangeiro,
            ie,
            im,
            newsletter,
            total_pedidos
          } = response.data
          setUserData({
            email,
            roles,
            permissoes,
            id,
            tipo,
            ativo,
            nome_completo,
            celular,
            telefone,
            cpf,
            nascimento,
            genero,
            created_at,
            updated_at,
            cnpj,
            data_acesso,
            estrangeiro,
            ie,
            im,
            newsletter,
            total_pedidos
          })
        })
        .catch(() => {
          signOut()
        })
    }
  }, [])

  async function signIn({ email, senha }: SignInCredentials) {
    try {
      const response = await api.post('sessions', {
        email,
        senha
      })

      const { user, token, refreshTokenId } = response.data
      const {
        roles,
        permissoes,
        id,
        tipo,
        ativo,
        nome_completo,
        celular,
        telefone,
        cpf,
        nascimento,
        genero,
        created_at,
        updated_at,
        cnpj,
        data_acesso,
        estrangeiro,
        ie,
        im,
        newsletter,
        total_pedidos
      } = user

      setCookie(undefined, 'nextauth.token', token, {
        maxAge: 60 * 60 * 24 * 30, // 1 mes,
        path: '/'
      })

      setCookie(undefined, 'nextauth.refreshToken', refreshTokenId, {
        maxAge: 60 * 60 * 24 * 30, // 1 mes,
        path: '/'
      })

      setUserData({
        email,
        roles,
        id,
        permissoes,
        tipo,
        ativo,
        nome_completo,
        celular,
        telefone,
        cpf,
        nascimento,
        genero,
        created_at,
        updated_at,
        cnpj,
        data_acesso,
        estrangeiro,
        ie,
        im,
        newsletter,
        total_pedidos
      })

      api.defaults.headers['Authorization'] = `Bearer ${token}`

      Router.push('/userinfo')
    } catch (err) {
      alert('Falha na autenticação, verifique seus dados')
      return -1
    }
  }

  async function signInCheckout({ email, senha }: SignInCredentials) {
    try {
      const response = await api.post('sessions', {
        email,
        senha
      })

      const { user, token, refreshTokenId } = response.data
      const {
        roles,
        permissoes,
        id,
        tipo,
        ativo,
        nome_completo,
        celular,
        telefone,
        cpf,
        nascimento,
        genero,
        created_at,
        updated_at,
        cnpj,
        data_acesso,
        estrangeiro,
        ie,
        im,
        newsletter,
        total_pedidos
      } = user

      setCookie(undefined, 'nextauth.token', token, {
        maxAge: 60 * 60 * 24 * 30, // 1 mes,
        path: '/'
      })

      setCookie(undefined, 'nextauth.refreshToken', refreshTokenId, {
        maxAge: 60 * 60 * 24 * 30, // 1 mes,
        path: '/'
      })

      setUserData({
        email,
        roles,
        id,
        permissoes,
        tipo,
        ativo,
        nome_completo,
        celular,
        telefone,
        cpf,
        nascimento,
        genero,
        created_at,
        updated_at,
        cnpj,
        data_acesso,
        estrangeiro,
        ie,
        im,
        newsletter,
        total_pedidos
      })

      api.defaults.headers['Authorization'] = `Bearer ${token}`

      return user
    } catch (err) {
      return -1
    }
  }

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signOut,
        setUserData,
        signInCheckout,
        broadcastAuth,
        isAuthenticated,
        userData
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuthContext = () => useContext(AuthContext)
