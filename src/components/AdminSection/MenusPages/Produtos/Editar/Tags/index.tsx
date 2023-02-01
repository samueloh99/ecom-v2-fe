import React, { useEffect, useState } from 'react'

import { Flex, Button, VStack, Checkbox, useToast } from '@chakra-ui/react'
import { useMutation } from 'react-query'
import { api } from '../../../../../../services/apiClient'
import { queryClient } from '../../../../../../services/queryClient'

type IProps = {
  produto: {
    id: number
    referencia: string
    tags: number[]
  }
}

const Tags = ({ produto }: IProps) => {
  const toast = useToast()

  const [productTags, setProductTags] = useState([
    { id: 1, name: 'Bazar', checked: false },
    { id: 2, name: 'Exclusivo', checked: false },
    { id: 3, name: 'Festas', checked: false },
    { id: 4, name: 'Lancamentos', checked: false },
    { id: 5, name: 'News', checked: false },
    { id: 6, name: 'Pré-Venda', checked: false },
    { id: 7, name: 'Preco Especial', checked: false },
    { id: 8, name: 'Preview', checked: false },
    { id: 9, name: 'Promocao', checked: false },
    { id: 10, name: 'Sale', checked: false },
    { id: 11, name: 'Super Desconto', checked: false },
    { id: 12, name: 'Ultima Peca', checked: false },
    { id: 13, name: 'Prioridade', checked: false }
  ])

  const patchProdutoTags = useMutation(
    async (tagsToAdd: number[]) => {
      try {
        const response = await api.patch(
          `/produtos/editar/tags/${produto.id}`,
          {
            tags: tagsToAdd
          }
        )

        if (response.data) {
          toast({
            title: 'Sucesso.',
            description: 'Tags Adicionado com Sucesso.',
            status: 'success',
            duration: 5000,
            isClosable: true
          })

          return response.data
        }
      } catch (err) {
        toast({
          title: 'Erro ao Criar.',
          description: err.response.data.message,
          status: 'error',
          duration: 5000,
          isClosable: true
        })
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('produto_by_id')
      }
    }
  )

  useEffect(() => {
    if (produto.tags) {
      productTags.map((item, index) => {
        if (produto.tags.includes(item.id)) {
          let newArr = [...productTags]
          newArr[index].checked = true
          setProductTags(newArr)
        }
      })
    }
  }, [produto])

  const handleSave = async () => {
    const tagsToAdd = productTags
      .filter(item => item.checked)
      .map(item => item.id)

    if (tagsToAdd.length === 0) {
      return
    }

    await patchProdutoTags.mutateAsync(tagsToAdd)
  }

  const isDisabled = productTags.filter(item => item.checked).length === 0

  return (
    <Flex w="100%" direction="column">
      <VStack w="100%" align="start">
        {productTags.map((item, index) => {
          return (
            <Checkbox
              key={index}
              isChecked={item.checked}
              onChange={e => {
                let newArr = [...productTags]
                newArr[index].checked = e.target.checked
                setProductTags(newArr)
              }}
            >
              {item.name}
            </Checkbox>
          )
        })}
      </VStack>
      <Flex w="100%" mt="50px">
        <Button
          onClick={() => handleSave()}
          disabled={isDisabled}
          colorScheme="pink"
        >
          Salvar
        </Button>
      </Flex>
    </Flex>
  )
}

export default Tags
