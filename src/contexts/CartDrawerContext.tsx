import { useDisclosure, UseDisclosureReturn } from '@chakra-ui/react'
import { createContext, ReactNode, useContext } from 'react'

interface CartDrawerContext {
  children: ReactNode
}

type CartDrawerContextData = UseDisclosureReturn

const CartDrawerContext = createContext({} as CartDrawerContextData)

export function CartDrawerProvider({ children }: CartDrawerContext) {
  const discloure = useDisclosure()

  return (
    <CartDrawerContext.Provider value={discloure}>
      {children}
    </CartDrawerContext.Provider>
  )
}

export const useCartDrawer = () => useContext(CartDrawerContext)
