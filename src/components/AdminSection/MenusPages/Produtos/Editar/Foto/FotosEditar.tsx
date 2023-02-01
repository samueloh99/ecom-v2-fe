import React, { ChangeEvent, useCallback, useState } from 'react'

import { useRouter } from 'next/router'

import {
  Flex,
  Stack,
  Img,
  Text,
  Input,
  Icon,
  useToast,
  Button
} from '@chakra-ui/react'

import { IoMdArrowRoundBack } from 'react-icons/io'
import { api } from '../../../../../../services/apiClient'
import { useSkus } from '../../../../../../services/hooks/useSkus'
import { queryClient } from '../../../../../../services/queryClient'

const FotosEditar = () => {
  const toast = useToast()
  const { query, back } = useRouter()

  const { data, isSuccess } = useSkus('', 1, 999999)

  const [fotos, setFotos] = useState({
    foto1: '',
    foto2: '',
    foto3: '',
    foto4: '',
    foto5: '',
    foto6: ''
  })

  const handleAvatarChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>, numeracao: string) => {
      if (e.target.files) {
        const data = new FormData()
        data.append(`foto${numeracao}`, e.target.files[0])

        api
          .patch(`/skus/produto_foto/adicionar/${query.slug[1]}`, data)
          .then(() => {
            toast({
              title: 'Foto adicionado.',
              description: 'Foto salvo.',
              status: 'success',
              duration: 4000,
              isClosable: true
            })
            queryClient.invalidateQueries('skus')
          })
          .catch(err => console.log(err))
      }
    },
    []
  )

  const skus =
    isSuccess && data.skus.find(item => item.id === parseInt(query['slug'][1]))

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
        <Button colorScheme="pink" onClick={() => back()}>
          <Icon as={IoMdArrowRoundBack} />
          Voltar
        </Button>
        <Text fontWeight="bold">Produto: Editar</Text>
      </Stack>

      <Flex m="10px 0px 20px 0px">
        <Text>
          Cor: <strong>{skus && skus.var1fk.nome}</strong>
        </Text>
      </Flex>
      <Stack w="100%" direction="column">
        <Text>Foto 1</Text>
        <Input
          type="file"
          w="400px"
          value={fotos.foto1}
          onChange={e => handleAvatarChange(e, '1')}
        />
        {skus.foto1 && <Img w="100px" src={skus.foto1} />}
      </Stack>

      <Stack w="100%" direction="column">
        <Text>Foto 2</Text>
        <Input
          type="file"
          w="400px"
          value={fotos.foto2}
          onChange={e => handleAvatarChange(e, '2')}
        />
        {skus.foto2 && <Img w="100px" src={skus.foto2} />}
      </Stack>

      <Stack w="100%" direction="column">
        <Text>Foto 3</Text>
        <Input
          type="file"
          w="400px"
          value={fotos.foto3}
          onChange={e => handleAvatarChange(e, '3')}
        />
        {skus.foto3 && <Img w="100px" src={skus.foto3} />}
      </Stack>

      <Stack w="100%" direction="column">
        <Text>Foto 4</Text>
        <Input
          type="file"
          w="400px"
          value={fotos.foto4}
          onChange={e => handleAvatarChange(e, '4')}
        />
        {skus.foto4 && <Img w="100px" src={skus.foto4} />}
      </Stack>

      <Stack w="100%" direction="column">
        <Text>Foto 5</Text>
        <Input
          type="file"
          w="400px"
          value={fotos.foto5}
          onChange={e => handleAvatarChange(e, '5')}
        />
        {skus.foto5 && <Img w="100px" src={skus.foto5} />}
      </Stack>

      <Stack w="100%" direction="column">
        <Text>Foto 6</Text>
        <Input
          type="file"
          w="400px"
          value={fotos.foto6}
          onChange={e => handleAvatarChange(e, '6')}
        />
        {skus.foto6 && <Img w="100px" src={skus.foto6} />}
      </Stack>
    </Flex>
  )
}

export default FotosEditar
