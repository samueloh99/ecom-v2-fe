import React from 'react'

import Conjuntos from '../../components/AdminSection/MenusPages/Conjuntos'
import Variacoes from '../../components/AdminSection/MenusPages/Variacoes'
import Produtos from '../../components/AdminSection/MenusPages/Produtos'
import Movimentacoes from '../../components/AdminSection/MenusPages/Movimentacoes'
import Skus from '../../components/AdminSection/MenusPages/Skus'
import Categorias from '../../components/AdminSection/MenusPages/Categorias'
import Marcas from '../../components/AdminSection/MenusPages/Marcas'
import Fornecedores from '../../components/AdminSection/MenusPages/Fornecedores'
import Clientes from '../../components/AdminSection/MenusPages/Clientes'
import Pagamentos from '../../components/AdminSection/MenusPages/Pagamentos'
import Logistica from '../../components/AdminSection/MenusPages/Logistica'
import Erp from '../../components/AdminSection/MenusPages/Erp'
import SEOSOCIAIS from '../../components/AdminSection/MenusPages/SEOSOCIAIS'
import Pedidos from '../../components/AdminSection/MenusPages/Pedidos'
import PedidosProdutos from '../../components/AdminSection/MenusPages/PedidosProdutos'
import Carteiras from '../../components/AdminSection/MenusPages/Carteiras'
import Newsletter from '../../components/AdminSection/MenusPages/Newsletter'
import Enderecos from '../../components/AdminSection/MenusPages/Enderecos'
import Cupons from '../../components/AdminSection/MenusPages/Cupons'

import AdminBaseTemplate from '../Base/adminBase'
import Administradores from '../../components/AdminSection/MenusPages/Administradores'
import PhotoBulk from '../../components/AdminSection/MenusPages/BulkActions/PhotoBulk'
import ProductBulk from '../../components/AdminSection/MenusPages/BulkActions/ProductBulk'
import ProductDescriptionBulk from '../../components/AdminSection/MenusPages/BulkActions/ProductDescriptionBulk'

const AdminTemplate = ({ slug }) => {
  switch (slug[0]) {
    case 'administradores':
      return (
        <AdminBaseTemplate>
          <Administradores />
        </AdminBaseTemplate>
      )

    case 'descontos':
      return (
        <AdminBaseTemplate>
          <Cupons />
        </AdminBaseTemplate>
      )
    case 'lista_newsletters':
      return (
        <AdminBaseTemplate>
          <Newsletter />
        </AdminBaseTemplate>
      )

    case 'enderecos':
      return (
        <AdminBaseTemplate>
          <Enderecos />
        </AdminBaseTemplate>
      )

    case 'produtos':
      return (
        <AdminBaseTemplate>
          <Produtos />
        </AdminBaseTemplate>
      )

    case 'skus':
      return (
        <AdminBaseTemplate>
          <Skus />
        </AdminBaseTemplate>
      )

    case 'conjuntos':
      return (
        <AdminBaseTemplate>
          <Conjuntos />
        </AdminBaseTemplate>
      )

    case 'estoques':
      return (
        <AdminBaseTemplate>
          <Movimentacoes />
        </AdminBaseTemplate>
      )

    case 'categorias':
      return (
        <AdminBaseTemplate>
          <Categorias />
        </AdminBaseTemplate>
      )

    case 'variacoes':
      return (
        <AdminBaseTemplate>
          <Variacoes />
        </AdminBaseTemplate>
      )

    case 'marcas':
      return (
        <AdminBaseTemplate>
          <Marcas />
        </AdminBaseTemplate>
      )

    case 'fornecedores':
      return (
        <AdminBaseTemplate>
          <Fornecedores />
        </AdminBaseTemplate>
      )

    case 'clientes':
      return (
        <AdminBaseTemplate>
          <Clientes />
        </AdminBaseTemplate>
      )
    case 'pagamentos':
      return (
        <AdminBaseTemplate>
          <Pagamentos />
        </AdminBaseTemplate>
      )

    case 'logistica':
      return (
        <AdminBaseTemplate>
          <Logistica />
        </AdminBaseTemplate>
      )

    case 'erp':
      return (
        <AdminBaseTemplate>
          <Erp />
        </AdminBaseTemplate>
      )

    case 'seosociais':
      return (
        <AdminBaseTemplate>
          <SEOSOCIAIS />
        </AdminBaseTemplate>
      )

    case 'pedidos':
      return (
        <AdminBaseTemplate>
          <Pedidos />
        </AdminBaseTemplate>
      )

    case 'pedido_produtos':
      return (
        <AdminBaseTemplate>
          <PedidosProdutos />
        </AdminBaseTemplate>
      )

    case 'carteiras':
      return (
        <AdminBaseTemplate>
          <Carteiras />
        </AdminBaseTemplate>
      )

    case 'fotos_bulk':
      return (
        <AdminBaseTemplate>
          <PhotoBulk />
        </AdminBaseTemplate>
      )

    case 'produtos_bulk':
      return (
        <AdminBaseTemplate>
          <ProductBulk />
        </AdminBaseTemplate>
      )

    case 'produtos_descricao_bulk':
      return (
        <AdminBaseTemplate>
          <ProductDescriptionBulk />
        </AdminBaseTemplate>
      )
    default:
      return <AdminBaseTemplate>nao selecionou</AdminBaseTemplate>
  }
}

export default AdminTemplate
