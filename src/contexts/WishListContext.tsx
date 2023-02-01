import { createContext, ReactNode, useState, useContext } from 'react'

type WishListContextData = {
  wishlist: {}
  setWishList: (produto: {}) => void
}

type WishListProviderProps = {
  children: ReactNode
}

export const WishListContext = createContext({} as WishListContextData)

export function WishListProvider({ children }: WishListProviderProps) {
  const [wishlist, setWishList] = useState([])

  return (
    <WishListContext.Provider value={{ wishlist, setWishList }}>
      {children}
    </WishListContext.Provider>
  )
}

export const useWishListProvider = () => useContext(WishListContext)
