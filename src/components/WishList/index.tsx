import React from 'react'

import { Flex, Spinner } from '@chakra-ui/react'

import { useFavoritos } from '../../services/hooks/useFavoritos'
import { useAuthContext } from '../../contexts/AuthContext'
import Header from './Header'
import ProductList from './ProductList'
import EmptyWishList from './EmptyWishList'

const WishList = () => {
  const { data } = useFavoritos()

  const { userData } = useAuthContext()

  const productsQty =
    userData &&
    data &&
    data.filter(item => item.usuario_id === userData.id).length

  const productsFilterByUser =
    userData &&
    data &&
    data
      .filter(item => item.usuario_id === userData.id)
      .map(item => {
        return {
          favorito_id: item.id,
          sku_id: item.sku_id,
          produto_id: item.sku_id_fk.produto_id,
          referencia: item.sku_id_fk.produto.referencia,
          sku_referencia: item.sku_id_fk.referencia,
          nome: item.sku_id_fk.produto.nome,
          preco: item.sku_id_fk.preco_venda,
          var1: {
            nome: item.sku_id_fk.var1fk.nome,
            foto: item.sku_id_fk.var1fk.foto
          },
          var2: item.sku_id_fk.var2fk.nome,
          foto1: item.sku_id_fk.foto1,
          estoque: item.sku_id_fk.estoque,
          peso: item.sku_id_fk.peso,
          ncm: item.sku_id_fk.produto.ncm
        }
      })

  return (
    <Flex maxWidth="100%" w="100%" direction="column">
      {!productsFilterByUser ? (
        <Spinner m="auto" mt="100px" />
      ) : productsQty !== 0 ? (
        <Flex direction="column" w="100%" pb="50px">
          <Header productsQty={productsQty} />
          <ProductList favoritos={productsFilterByUser} />
        </Flex>
      ) : (
        <EmptyWishList />
      )}
    </Flex>
  )
}

export default WishList
