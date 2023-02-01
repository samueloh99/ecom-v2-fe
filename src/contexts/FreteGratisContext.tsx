import { createContext, ReactNode, useContext } from 'react'

import axios from 'axios'

import { useFretes } from '../services/hooks/useConfiguracoes'
import { api } from '../services/apiClient'

interface ViaCEPResponse {
  bairro: string
  cep: string
  complemento: string
  ddd: string
  gia: string
  ibge: string
  localidade: string
  logradouro: string
  siafi: string
  uf: string
  erro?: string
}

interface ResponseCorreios {
  data: {
    Codigo: string
    Valor: string
    PrazoEntrega: string
    ValorSemAdicionais: string
    ValorMaoPropria: string
    ValorAvisoRecebimento: string
    ValorDeclarado: string
    EntregaDomiciliar: string
    EntregaSabado: string
    obsFim: string
    Erro: string
    MsgErro: string
    cod_servico: string
  }
}

type FreteGratisContextData = {
  formatCep: (cep: string, valor: number) => Boolean
  cepResultAutoComplete: (cep: string) => Promise<ViaCEPResponse>
}

type FreteGratisProviderProps = {
  children: ReactNode
}

export const FreteGratisContext = createContext({} as FreteGratisContextData)

export function FreteGratisProvider({ children }: FreteGratisProviderProps) {
  const { isSuccess, data } = useFretes()

  let checkList = []

  const formatCep = (cep: string, valor: number) => {
    checkList = []

    isSuccess &&
      data.map(item => {
        if (
          item.cep_maximo >= cep &&
          item.cep_minimo <= cep &&
          parseInt(item.compra_minima) <= valor
        ) {
          checkList.push(true)
        }
      })

    if (checkList.includes(true)) {
      return true
    } else {
      return false
    }
  }

  const cepResultAutoComplete = async (
    cep: string
  ): Promise<ViaCEPResponse> => {
    try {
      const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`)

      const viaCepData: ViaCEPResponse = response.data

      return viaCepData
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <FreteGratisContext.Provider
      value={{
        formatCep,
        cepResultAutoComplete
      }}
    >
      {children}
    </FreteGratisContext.Provider>
  )
}

export const useFreteGratisContext = () => useContext(FreteGratisContext)
