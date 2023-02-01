import React from 'react'

import ProdutoEditar from '../../components/AdminSection/MenusPages/Produtos/Editar'
import ConjuntosEditar from '../../components/AdminSection/MenusPages/Conjuntos/Editar'
import CategoriasEditar from '../../components/AdminSection/MenusPages/Categorias/Editar'
import ClientesEditar from '../../components/AdminSection/MenusPages/Clientes/Editar'
import SkusEditar from '../../components/AdminSection/MenusPages/Skus/Editar'
import EnderecosEditar from '../../components/AdminSection/MenusPages/Enderecos/Editar'
import CUponsEditar from '../../components/AdminSection/MenusPages/Cupons/Editar'
import FotosEditar from '../../components/AdminSection/MenusPages/Produtos/Editar/Foto/FotosEditar'
import MarcasEditar from '../../components/AdminSection/MenusPages/Marcas/Editar'
import FornecedoresEditar from '../../components/AdminSection/MenusPages/Fornecedores/Editar'

import AdminEditar from '../../components/AdminSection/MenusPages/Administradores/Editar'

import AdminBaseTemplate from '../Base/adminBase'
import VariacoesEditar from '../../components/AdminSection/MenusPages/Variacoes/Editar'
import OrderDetails from '../../components/AdminSection/MenusPages/Pedidos/OrderDetails'

const AdminAdicionarTemplate = ({
  pid,
  endereco,
  cliente,
  pedido,
  clienteCarteira,
  pedidoProduto,
  slug,
  cupom
}) => {
  switch (pid) {
    case 'fornecedores':
      return (
        <AdminBaseTemplate>
          <FornecedoresEditar />
        </AdminBaseTemplate>
      )

    case 'marcas':
      return (
        <AdminBaseTemplate>
          <MarcasEditar />
        </AdminBaseTemplate>
      )

    case 'administradores':
      return (
        <AdminBaseTemplate>
          <AdminEditar cliente={cliente} />
        </AdminBaseTemplate>
      )

    case 'descontos':
      return (
        <AdminBaseTemplate>
          <CUponsEditar cupom={cupom} />
        </AdminBaseTemplate>
      )

    case 'enderecos':
      return (
        <AdminBaseTemplate>
          <EnderecosEditar endereco={endereco} />
        </AdminBaseTemplate>
      )

    case 'produtos':
      return (
        <AdminBaseTemplate>
          <ProdutoEditar />
        </AdminBaseTemplate>
      )

    case 'produtos-fotos':
      return (
        <AdminBaseTemplate>
          <FotosEditar />
        </AdminBaseTemplate>
      )

    case 'conjuntos':
      return (
        <AdminBaseTemplate>
          <ConjuntosEditar />
        </AdminBaseTemplate>
      )

    case 'categorias':
      return (
        <AdminBaseTemplate>
          <CategoriasEditar />
        </AdminBaseTemplate>
      )

    case 'skus':
      return (
        <AdminBaseTemplate>
          <SkusEditar />
        </AdminBaseTemplate>
      )

    case 'variacoes':
      return (
        <AdminBaseTemplate>
          <VariacoesEditar />
        </AdminBaseTemplate>
      )

    case 'pedidos':
      return (
        <AdminBaseTemplate>
          <OrderDetails pedido={pedido} pedidoProduto={pedidoProduto} />
        </AdminBaseTemplate>
      )

    case 'clientes':
      return (
        <AdminBaseTemplate>
          <ClientesEditar cliente={cliente} clienteCarteira={clienteCarteira} />
        </AdminBaseTemplate>
      )

    default:
      return <AdminBaseTemplate>nao selecionou</AdminBaseTemplate>
  }
}

export default AdminAdicionarTemplate
