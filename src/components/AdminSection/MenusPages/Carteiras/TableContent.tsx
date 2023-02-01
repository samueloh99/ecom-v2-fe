import React from 'react'

import {
  Flex,
  Th,
  Table,
  Thead,
  Tbody,
  PopoverTrigger as OrigPopoverTrigger,
  Td,
  Text,
  Spinner,
  Tr
} from '@chakra-ui/react'

import { useCarteiras } from '../../../../services/hooks/useCarteiras'

export const PopoverTrigger: React.FC<{ children: React.ReactNode }> =
  OrigPopoverTrigger

const TableContent = () => {
  const { data, isLoading } = useCarteiras()
  return isLoading ? (
    <Flex justifyContent="center">
      <Spinner />
    </Flex>
  ) : (
    <Flex direction="column">
      <Table colorScheme="whiteAlpha" width="100%" m="auto">
        <Thead>
          <Tr>
            <Th>Pedido</Th>
            <Th>Cliente</Th>
            <Th>Nome</Th>
            <Th>Valor</Th>
            <Th>Data</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data.map((item, index) => {
            const {
              movimentacao,
              usuario_id,
              valor_carteira,
              pedido_id,
              usuario_id_fk,
              created_at
            } = item
            let valor: number
            if (movimentacao === 'entrada') {
              valor = valor_carteira
            } else if (movimentacao === 'saida') {
              valor = -valor_carteira
            }
            return (
              <Tr key={index}>
                <Td>
                  <Text>{pedido_id === null ? '-' : pedido_id}</Text>
                </Td>
                <Td>{usuario_id}</Td>
                <Td>
                  <Text>{usuario_id_fk.nome_completo}</Text>
                </Td>
                <Td color={movimentacao === 'saida' && 'red'}>R${valor}</Td>
                <Td>
                  {new Date(created_at).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                  })}
                </Td>
              </Tr>
            )
          })}
        </Tbody>
      </Table>
    </Flex>
  )
}

export default TableContent
