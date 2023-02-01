import { createContext, ReactNode, useContext } from 'react'

type Parcela = {
  id: number
  ativo: number
  parcela: number
  tipo: string
  taxa: number
  valor: number
}[]

type ParcelaFormated = {
  valor: number
  tipo: string
  parcela: number
  valido: boolean
}

type ParcelaContextData = {
  calcParcela: (total: number, data: Parcela) => ParcelaFormated[]
}

interface ParcelaContext {
  children: ReactNode
}

const ParcelaContext = createContext({} as ParcelaContextData)

export function ParcelaContextProvider({ children }: ParcelaContext) {
  const calcParcela = (total: number, data: Parcela) => {
    const parcelaOpt: ParcelaFormated[] = []

    data.map(item => {
      const { tipo, valor, parcela, taxa } = item

      const valido = valor > total ? false : true

      switch (tipo) {
        case '0':
          parcelaOpt.push({
            parcela,
            tipo: 'Sem Juros',
            valido,
            valor: parseFloat((total / parcela).toFixed(2))
          })
          break

        case '1':
          parcelaOpt.push({
            valor: parseFloat(
              ((total - total * (taxa / 100)) / parcela).toFixed(2)
            ),
            parcela,
            valido,
            tipo: 'Desconto'
          })
          break

        case '2':
          parcelaOpt.push({
            valor: parseFloat(
              ((total * Math.pow(1 + taxa / 100, parcela)) / parcela).toFixed(2)
            ),
            parcela,
            valido,
            tipo: 'Juros Composto'
          })
          break

        case '3':
          parcelaOpt.push({
            valor: parseFloat(
              ((total * (taxa / 100) * parcela + total) / 3).toFixed(2)
            ),
            parcela,
            valido,
            tipo: 'Juros Simples'
          })
          break

        default:
          break
      }
    })

    return parcelaOpt
  }

  return (
    <ParcelaContext.Provider value={{ calcParcela }}>
      {children}
    </ParcelaContext.Provider>
  )
}

export const useParcelaContext = () => useContext(ParcelaContext)
