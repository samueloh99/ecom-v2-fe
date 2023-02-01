import React from 'react'

import NextLink from 'next/link'

import { useRouter } from 'next/router'

import {
  Flex,
  Text,
  Stack,
  Button,
  Icon,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Spinner
} from '@chakra-ui/react'

import { IoMdArrowRoundBack } from 'react-icons/io'

import { useProdutoById } from '../../../../../services/hooks/useProdutoById'

import Cadastro from './Cadastro'
import Sku from './Sku'
import Desconto from './Desconto'
import Foto from './Foto'
import SubCategorias from './SubCategorias'
import Tags from './Tags'

const ProdutoEditar = () => {
  const { query } = useRouter()

  const { data: dataProduto, isSuccess: isSuccessProduto } = useProdutoById(
    parseInt(query['slug'][0])
  )

  return (
    <Flex
      flex="1"
      borderRadius={8}
      bg="gray.800"
      p="8"
      direction="column"
      w="1000px"
    >
      <Stack direction="row" alignItems="center" marginBottom={10}>
        <NextLink href="/admin/produtos">
          <Button colorScheme="pink">
            <Icon as={IoMdArrowRoundBack} />
            Voltar
          </Button>
        </NextLink>
        <Text fontWeight="bold">Produto: Editar</Text>
      </Stack>
      <Tabs>
        <TabList>
          <Tab>Cadastro</Tab>
          <Tab>Sub Categorias</Tab>
          <Tab>Tags</Tab>
          <Tab>Sku</Tab>
          <Tab>Descontos</Tab>
          <Tab>Fotos</Tab>
        </TabList>

        {isSuccessProduto ? (
          <TabPanels>
            <TabPanel>
              <Cadastro produto={dataProduto} />
            </TabPanel>
            <TabPanel>
              <SubCategorias />
            </TabPanel>
            <TabPanel>
              <Tags produto={dataProduto} />
            </TabPanel>
            <TabPanel>
              <Sku />
            </TabPanel>
            <TabPanel>
              <Desconto />
            </TabPanel>
            <TabPanel>
              <Foto produto={dataProduto} />
            </TabPanel>
          </TabPanels>
        ) : (
          <TabPanels>
            <TabPanel>
              <Flex w="100%" align="center" justify="center" h="70vh">
                <Spinner />
              </Flex>
            </TabPanel>
          </TabPanels>
        )}
      </Tabs>
    </Flex>
  )
}

export default ProdutoEditar
