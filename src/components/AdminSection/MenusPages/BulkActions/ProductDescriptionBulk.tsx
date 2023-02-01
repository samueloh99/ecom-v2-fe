import React, { ChangeEvent, useCallback } from 'react'

import { useRouter } from 'next/router'

import {
  Button,
  Flex,
  HStack,
  Icon,
  Input,
  Stack,
  Text
} from '@chakra-ui/react'

import { api } from '../../../../services/apiClient'
import { IoMdArrowRoundBack } from 'react-icons/io'

const ProductDescriptionBulk = () => {
  const { back } = useRouter()

  const handleAvatarChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const data = new FormData()
      data.append(`file`, e.target.files[0])

      api
        .post(`/produtos/bulk/descricao`, data)
        .then(res => {
          console.log(res)
        })
        .catch(err => console.log(err))
    }
  }, [])

  return (
    <Stack borderRadius={8} bg="gray.800" p="8" w="100%">
      <HStack>
        <Button
          as="a"
          size="sm"
          fontSize="sm"
          colorScheme="pink"
          onClick={() => back()}
          leftIcon={<Icon as={IoMdArrowRoundBack} />}
          mr="5"
        >
          Voltar
        </Button>
        <Text>Produtos em massa</Text>
      </HStack>
      <Flex py="100px">
        <Input
          type="file"
          borderColor="gray"
          w="400px"
          onChange={e => handleAvatarChange(e)}
        />
      </Flex>
    </Stack>
  )
}

export default ProductDescriptionBulk
