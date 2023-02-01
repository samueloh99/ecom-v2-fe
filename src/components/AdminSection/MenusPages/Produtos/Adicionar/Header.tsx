import React from 'react'

import NextLink from 'next/link'

import {
  Flex,
  Stack,
  Text,
  Button,
  Icon,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel
} from '@chakra-ui/react'

import { IoMdArrowRoundBack } from 'react-icons/io'

const Header = ({ children }) => {
  return (
    <Flex direction="column">
      <Stack direction="row" alignItems="center" spacing={5}>
        <NextLink href="/admin/produtos">
          <Button colorScheme="pink">
            <Icon as={IoMdArrowRoundBack} />
            Voltar
          </Button>
        </NextLink>
        <Text>Produtos:Adicionar</Text>
      </Stack>
      <Tabs mt="10" w="50%">
        <TabList justifyContent="space-between">
          <Tab>Cadastro</Tab>
          <Tab isDisabled>Sku</Tab>
          <Tab isDisabled>Descontos</Tab>
          <Tab isDisabled>Fotos</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>{children}</TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
  )
}

export default Header
