import {
  createContext,
  ReactNode,
  useState,
  useEffect,
  useContext
} from 'react'

import * as fbq from '../../lib/fpixel'
interface IVariantesProductSkuDTO {
  idSku: number
  preco: number
  preco_desconto: number
  sku_referencia: string
  var1: string
  var2: string
  estoque: number
  fotos: string[]
  peso: number
}

interface IProductSkuDTO {
  altura: string
  ativo: number
  categoria_id: number
  categoria: {
    nome: string
  }
  comprimento: string
  created_at: string
  descricao: null
  fornecedor_id: null
  id: number
  largura: string
  marca_id: number
  ncm: string
  nome: string
  referencia: string
  slug: string
  tipo_produto_id: number
  updated_at: string
  variantes: IVariantesProductSkuDTO[]
}

type ProductPageInfoContextData = {
  product: IProductSkuDTO
  var1: string
  var2: string
  setVar1: (variacao1: string) => void
  setVar2: (variacao2: string) => void
  setProduct: (produto: IProductSkuDTO) => void
}

type ProductPageInfoProviderProps = {
  children: ReactNode
}

export const ProductPageInfoContext = createContext(
  {} as ProductPageInfoContextData
)

export function ProductPageInfoProvider({
  children
}: ProductPageInfoProviderProps) {
  const [product, setProduct] = useState<IProductSkuDTO>()

  const [var1, setVar1] = useState('')
  const [var2, setVar2] = useState('')

  useEffect(() => {
    if (product) {
      setVar1(product.variantes[0].var1)
      setVar2(product.variantes.find(item => item.var2 === 'P').var2)

      fbq.event('ViewContent', {
        content_type: 'product',
        content_ids: product.id,
        content_name: product.nome,
        content_category: product.categoria.nome
      })
    }
  }, [product])

  return (
    <ProductPageInfoContext.Provider
      value={{ product, setProduct, var1, setVar1, var2, setVar2 }}
    >
      {children}
    </ProductPageInfoContext.Provider>
  )
}

export const useProductPageInfo = () => useContext(ProductPageInfoContext)
