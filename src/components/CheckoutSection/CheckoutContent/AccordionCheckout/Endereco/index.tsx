import React, { useState } from 'react'

import { useRouter } from 'next/router'

import {
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  Icon,
  Text,
  Box,
  Flex,
  Button,
  VStack
} from '@chakra-ui/react'

import { RiNumber2, RiCheckFill } from 'react-icons/ri'

import AddressesOptions from './AddressesOptions'
import ShippingOptions from './ShippingOptions'
import Form from './Form'

import { useCheckoutContext } from '../../../../../contexts/CheckoutContext'
import { useEnderecos } from '../../../../../services/hooks/useEnderecos'
import { useAuthContext } from '../../../../../contexts/AuthContext'
import { cepMask } from '../../../../../../utils/masks'

const InfoEntrega = () => {
  const { push } = useRouter()
  const { data } = useEnderecos('mostrar=99999')

  const [addAdress, setAddAddress] = useState(false)

  const { userData } = useAuthContext()

  const { step, setStep, checkoutEntrega } = useCheckoutContext()

  const handleAddAddress = () => {
    setAddAddress(true)
  }

  const handleClickEditar = () => {
    setStep(1)

    return push('/checkout/endereco', undefined, { shallow: true })
  }

  return (
    <AccordionItem mb="10" border="none">
      <h2>
        <AccordionButton
          bg="white"
          p={10}
          _focus={{ border: 'none' }}
          _hover={{ bg: 'white' }}
          flexDirection="column"
          alignItems="start"
        >
          <Flex direction="row" w="100%" justifyContent="space-between">
            <Box
              display="flex"
              flexDirection="row"
              alignItems="center"
              textAlign="left"
              fontWeight="bold"
              fontSize={{ base: '17px', md: '20px' }}
              letterSpacing={{ base: '1px', md: '5px' }}
            >
              <Icon
                as={step > 1 ? RiCheckFill : RiNumber2}
                bg={step > 1 ? 'green' : 'black'}
                fontSize={{ base: 25, md: 30 }}
                color="white"
                borderRadius="100%"
                p={2}
                mr={3}
              />
              <Text>INFORMAÇÕES DE ENTREGA</Text>
            </Box>
            {step > 1 && (
              <Box
                textDecoration="underline"
                onClick={() => handleClickEditar()}
              >
                editar
              </Box>
            )}
          </Flex>

          {step > 1 && checkoutEntrega && (
            <VStack mt="50px" align="start" spacing={5} fontSize={13}>
              <VStack align="start">
                <Text fontWeight="bold">Frete:</Text>
                <Text>
                  Nome: {checkoutEntrega.checkoutDataEnderecoDTO.frete_nome}
                </Text>
                <Text>
                  Prazo: {checkoutEntrega.checkoutDataEnderecoDTO.frete_prazo}
                </Text>
                <Text>
                  Valor: R${' '}
                  {checkoutEntrega.checkoutDataEnderecoDTO.frete_valor}
                </Text>
              </VStack>

              <VStack align="start">
                <Text fontWeight="bold">Endereço:</Text>
                <Text>
                  CEP:{' '}
                  {cepMask(checkoutEntrega.checkoutDataEnderecoDTO.entrega_cep)}
                </Text>
                <Text>
                  {checkoutEntrega.checkoutDataEnderecoDTO.entrega_endereco},{' '}
                  {checkoutEntrega.checkoutDataEnderecoDTO.entrega_numero}
                </Text>
                <Text>
                  {checkoutEntrega.checkoutDataEnderecoDTO.entrega_complemento}
                </Text>
                <Text>
                  {checkoutEntrega.checkoutDataEnderecoDTO.entrega_bairro} -{' '}
                  {checkoutEntrega.checkoutDataEnderecoDTO.entrega_cidade}
                </Text>
                <Text>
                  {checkoutEntrega.checkoutDataEnderecoDTO.entrega_estado} -{' '}
                  {checkoutEntrega.checkoutDataEnderecoDTO.entrega_pais}
                </Text>
                <Text>
                  {checkoutEntrega.checkoutDataEnderecoDTO.entrega_lembrete}
                </Text>
                <Text>
                  {checkoutEntrega.checkoutDataEnderecoDTO.entrega_nome}
                </Text>
              </VStack>
            </VStack>
          )}
        </AccordionButton>
      </h2>
      <AccordionPanel bg="white" pb={4}>
        <Flex direction="column" mt={5}>
          {addAdress === false && (
            <Button
              bg="black"
              color="white"
              w="150px"
              h="auto"
              p={2}
              fontSize={12}
              onClick={() => handleAddAddress()}
            >
              Adicionar Endereço
            </Button>
          )}
          {addAdress === true && <Form setAddAddress={setAddAddress} />}
        </Flex>
        {data &&
          userData &&
          data.enderecos.filter(item => item.usuario_id === userData.id)
            .length > 0 && (
            <Flex>
              <AddressesOptions />
            </Flex>
          )}
        <ShippingOptions />
      </AccordionPanel>
    </AccordionItem>
  )
}

export default InfoEntrega
