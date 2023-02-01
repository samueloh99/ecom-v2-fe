import React, { useEffect, useState } from 'react'

import { useRouter } from 'next/router'

import {
  Flex,
  Spinner,
  Button,
  useToast,
  VStack,
  Checkbox,
  Text,
  HStack,
  SimpleGrid
} from '@chakra-ui/react'

import { useCategorias } from '../../../../../../services/hooks/useCategorias'
import { useProdutos } from '../../../../../../services/hooks/useProdutos'
import { api } from '../../../../../../services/apiClient'
import { queryClient } from '../../../../../../services/queryClient'

type Categoria = {
  id: number
  nome: string
  pai_id: number
  slug: string
  ativo: number
  updated_at: Date
  checked: boolean
}

const SubCategorias = () => {
  const toast = useToast()
  const { back } = useRouter()

  const { query } = useRouter()
  const { data: dataCategorias } = useCategorias()
  const { data: dataProdutos } = useProdutos('', 1, 999999999)

  const [categories, setCategories] = useState<Categoria[]>()

  useEffect(() => {
    if (dataCategorias && dataProdutos) {
      const findCategoryByProduct = dataProdutos.produtos.find(
        item => item.id === parseInt(query['slug'] as string)
      )

      const subCategorias = dataProdutos.produtos.find(
        item => item.id === parseInt(query['slug'] as string)
      ).sub_categorias_ids

      const newMap = dataCategorias.map(item => {
        return {
          ...item,
          checked:
            findCategoryByProduct.categoria_id === item.id ||
            (subCategorias && subCategorias.includes(item.id))
              ? true
              : false
        }
      })

      setCategories(newMap)
    }
  }, [dataCategorias, dataProdutos])

  const handleSave = async () => {
    const findCategoryByProduct = dataProdutos.produtos.find(
      item => item.id === parseInt(query['slug'] as string)
    ).categoria_id

    const catToAdd = categories
      .filter(item => item.checked && item.id !== findCategoryByProduct)
      .map(item => item.id)

    await api
      .patch(`/produtos/sub_categorias/${query['slug']}`, {
        sub_categorias_ids: catToAdd
      })
      .then(res => {
        queryClient.invalidateQueries('produtos')
        back()
        return toast({
          title: 'Sucesso.',
          description: 'Categorias Salvas.',
          status: 'success',
          duration: 5000,
          isClosable: true
        })
      })
      .catch(err => {
        return toast({
          title: 'ERRO.',
          description: 'Não foi possível salvar.',
          status: 'error',
          duration: 5000,
          isClosable: true
        })
      })
  }

  const buildTree = (item: Categoria) => {
    const children = dataCategorias.filter(child => child.pai_id === item.id)

    const findCategoryByProduct =
      dataProdutos &&
      dataProdutos.produtos.find(
        item => item.id === parseInt(query['slug'] as string)
      ).categoria_id

    return (
      <VStack key={item.id} align="start">
        <HStack>
          <Checkbox
            disabled={item.id === findCategoryByProduct ? true : false}
            isChecked={item.checked}
            onChange={e => {
              let newArr = [...categories]
              const indexCat = categories.map(cat => cat.id).indexOf(item.id)

              newArr[indexCat].checked = e.target.checked
              setCategories(newArr)
            }}
          >
            {item.nome}
          </Checkbox>
          {item.id === findCategoryByProduct && (
            <Text>(Categoria Principal)</Text>
          )}
        </HStack>
        {children.length > 0 && children.map(buildTree)}
      </VStack>
    )
  }

  return categories ? (
    <Flex w="100%" direction="column">
      <SimpleGrid columns={2} spacing={10}>
        {categories.filter(item => !item.pai_id).map(item => buildTree(item))}
      </SimpleGrid>
      <Flex w="100%" mt="50px">
        <Button onClick={() => handleSave()} colorScheme="pink">
          Salvar
        </Button>
      </Flex>
    </Flex>
  ) : (
    <Flex w="100%" justify="center">
      <Spinner />
    </Flex>
  )
}

export default SubCategorias
