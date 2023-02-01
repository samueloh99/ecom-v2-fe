import React, { useState } from 'react'

import { Flex, Th, Table, Thead, Tbody, Td, Tr } from '@chakra-ui/react'

import { Pagination } from '../../Pagination'

import { useMovimentacoes } from '../../../../services/hooks/useMovimentacoes'
import { useSkus } from '../../../../services/hooks/useSkus'

const TableContent = () => {
  const [page, setPage] = useState(1)

  const {
    data: dataMovimentacao,
    isSuccess: isSuccessMovimentacao,
    isLoading: isLoadingMovimentacao
  } = useMovimentacoes()
  const {
    data: dataSkus,
    isSuccess: isSuccessSksus,
    isLoading: isLoadingSkus
  } = useSkus()

  const ifSuccessAllData = isSuccessSksus && isSuccessMovimentacao

  const findSku = (id: number) => {
    const findSku = dataSkus.skus.find(item => item.id === id)

    return findSku
  }

  return (
    <Flex direction="column">
      <Table colorScheme="whiteAlpha" width="100%" m="auto">
        <Thead>
          <Tr>
            <Th>SKU ID</Th>
            <Th>Pedido</Th>
            <Th>Nome / Referência</Th>
            <Th>Variação 1</Th>
            <Th>Variação 2</Th>
            <Th>Lançamento</Th>
            <Th>Tipo</Th>
            <Th>Atualizado</Th>
          </Tr>
        </Thead>
        <Tbody>
          {ifSuccessAllData &&
            dataMovimentacao.movimentacoes.map((item, index) => {
              return (
                <Tr key={index}>
                  <Td>{item.sku_id}</Td>
                  <Td>-</Td>
                  <Td>
                    {findSku(item.sku_id).produto.nome +
                      `/` +
                      findSku(item.sku_id).referencia}
                  </Td>
                  <Td>{findSku(item.sku_id).var1fk.nome}</Td>
                  <Td>{findSku(item.sku_id).var2fk.nome}</Td>
                  <Td>{item.quantidade}</Td>
                  <Td>{item.lancamento}</Td>
                  <Td>{item.updated_at.toString()}</Td>
                </Tr>
              )
            })}
        </Tbody>
      </Table>
      <Pagination
        currentPage={page}
        onPageChange={setPage}
        totalCount={dataMovimentacao && dataMovimentacao.pag.encontrados}
        totalPerPage={dataMovimentacao && dataMovimentacao.pag.exibindo}
      />
    </Flex>
  )
}

export default TableContent
