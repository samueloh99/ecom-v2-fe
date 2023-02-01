import {
  createContext,
  ReactNode,
  useState,
  useContext,
  useEffect
} from 'react'

import { useRouter } from 'next/router'

import { setCookie, parseCookies } from 'nookies'
interface IProductSkuDTO {
  idProd: number
  nome: string
  referencia: string
  ncm: string
  variante1: string
  variante2: string
  foto: string
  quantidade: number
  sku_referencia: string
  preco: number
  idSku: number
  peso: number
}

type ICupomCartDTO = {
  cupomName: string
  valido: number
  desconto_tipo: string
  desconto_valor: number
  cupom_id: number | null
}

type CartContextData = {
  cart: IProductSkuDTO[]
  setCart: (produto: {}) => void
  decreaseCart: (index: number) => void
  incrementCart: (index: number) => void
  deleteItemOnCart: (index: number) => void
  totalPeso: () => number
  totalCart: () => number
  totalQtd: () => number
  cartCupom: ICupomCartDTO
  setCartCupom: (data: ICupomCartDTO) => void
  handleApplyCupom: (data: ICupomCartDTO) => void
  reaplyCupom: () => void
}

type CartProviderProps = {
  children: ReactNode
}

export const CartContext = createContext({} as CartContextData)

export function CartProvider({ children }: CartProviderProps) {
  const { pathname } = useRouter()
  const [cart, setCart] = useState<IProductSkuDTO[]>([])

  const [cartCupom, setCartCupom] = useState<ICupomCartDTO>({
    cupomName: '',
    valido: 0,
    desconto_valor: 0.0,
    desconto_tipo: 'F',
    cupom_id: null
  })

  const cookies = parseCookies()

  useEffect(() => {
    if (cookies['cart'] !== undefined) {
      setCart(JSON.parse(cookies['cart']))
    }

    if (cookies['cupom'] !== undefined) {
      setCartCupom(JSON.parse(cookies['cupom']))
    } else {
      setCartCupom({
        cupom_id: null,
        cupomName: '',
        desconto_tipo: '',
        desconto_valor: 0.0,
        valido: 0
      })
    }
  }, [pathname])

  useEffect(() => {
    let newArr = [...cart]
    newArr
      .map(e => e['idSku'])
      .map((e, i, final) => {
        if (final.indexOf(e) !== i) {
          newArr.splice(i, 1)

          newArr[final.indexOf(e)].quantidade =
            newArr[final.indexOf(e)].quantidade + 1
          setCart(newArr)
        }
      })

    setCookie(undefined, 'cart', JSON.stringify(newArr), {
      maxAge: 86400,
      path: '/'
    })
  }, [cart])

  const decreaseCart = (index: number) => {
    let newArr = [...cart]
    newArr[index].quantidade = newArr[index].quantidade - 1
    setCart(newArr)
    if (newArr[index].quantidade === 0) {
      deleteItemOnCart(index)
    }
  }

  const incrementCart = (index: number) => {
    let newArr = [...cart]
    newArr[index].quantidade = newArr[index].quantidade + 1
    setCart(newArr)
  }

  const deleteItemOnCart = (index: number) => {
    let newArr = [...cart]
    newArr.splice(index, 1)
    setCart(newArr)
  }

  const totalCart = () => {
    const total = cart
      .map(item => item.preco * item.quantidade)
      .reduce((prev, curr) => prev + curr, 0)
      .toFixed(2)

    return parseFloat(total)
  }

  const totalPeso = () => {
    const peso = cart
      .map(item => item.peso * item.quantidade)
      .reduce((prev, curr) => prev + curr, 0)

    return peso
  }

  const totalQtd = () => {
    const itemQtdInCart = cart
      .map(item => item.quantidade)
      .reduce((prev, curr) => prev + curr, 0)

    return itemQtdInCart
  }

  const reaplyCupom = () => {
    if (cookies['cupom'] !== undefined) {
      setCartCupom(JSON.parse(cookies['cupom']))
    }
  }

  const handleApplyCupom = ({
    cupomName,
    cupom_id,
    desconto_tipo,
    desconto_valor,
    valido
  }: ICupomCartDTO) => {
    setCookie(
      undefined,
      'cupom',
      JSON.stringify({
        cupomName,
        cupom_id,
        desconto_tipo,
        desconto_valor,
        valido
      }),
      {
        maxAge: 3600,
        path: '/'
      }
    )
    setCartCupom({
      cupomName,
      cupom_id,
      desconto_tipo,
      desconto_valor,
      valido
    })
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
        totalPeso,
        totalCart,
        totalQtd,
        decreaseCart,
        incrementCart,
        deleteItemOnCart,
        cartCupom,
        setCartCupom,
        handleApplyCupom,
        reaplyCupom
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCartContext = () => useContext(CartContext)
