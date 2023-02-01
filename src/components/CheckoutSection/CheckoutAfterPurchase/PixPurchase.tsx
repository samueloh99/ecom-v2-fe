import React, { useState } from 'react'

import {
  Flex,
  Text,
  Button,
  Img,
  Popover,
  PopoverTrigger as OrigPopoverTrigger,
  PopoverContent,
  PopoverArrow
} from '@chakra-ui/react'

import { useCheckoutContext } from '../../../contexts/CheckoutContext'

export const PopoverTrigger: React.FC<{ children: React.ReactNode }> =
  OrigPopoverTrigger

const PixPurchase = () => {
  const { checkoutOrderPixPagarme, checkoutPedido } = useCheckoutContext()

  const [open, setOpen] = useState(false)

  const expiresAt = new Date(
    checkoutOrderPixPagarme.charges[0].last_transaction.expires_at
  ).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })

  const openPopover = () => {
    setOpen(true)

    setTimeout(function () {
      setOpen(false)
      navigator.clipboard.writeText(
        checkoutOrderPixPagarme.charges[0].last_transaction.qr_code
      )
    }, 1000)
  }

  return (
    <Flex
      mt="10px"
      w="100%"
      p="20px 10px 20px 10px"
      direction="column"
      border="1px solid #ccc"
      borderRadius={5}
    >
      <Text fontWeight="bold" fontSize="20px">
        Use o QR Code do Pix para pagar
      </Text>
      <Text>
        Abra o App em que vai fazer a transferência, escaneie a imagem ou cole o
        código do QR Code.
      </Text>
      <Text mt="10px" fontWeight="bold">
        Valor: R${checkoutPedido.pedido_geral}
      </Text>

      <Flex
        m="50px 0px 50px 0px"
        direction="column"
        w="100%"
        alignItems="center"
      >
        <Flex
          backgroundColor="black"
          color="white"
          borderRadius={5}
          height="50px"
          width="150px"
          overflow="hidden"
          alignItems="center"
          justifyContent="space-between"
          p="0px 5px 0px 5px"
          w="auto"
        >
          <Text
            onClick={() => {
              navigator.clipboard.writeText(
                checkoutOrderPixPagarme.charges[0].last_transaction.qr_code
              )
            }}
            fontSize="10px"
          >
            {checkoutOrderPixPagarme.charges[0].last_transaction.qr_code}
          </Text>
          <Popover isOpen={open}>
            <PopoverTrigger>
              <Button
                bg="transparent"
                _focus={{
                  boxShadow: 'red',
                  outline: 'none',
                  outlineOffset: 'none'
                }}
                _hover={{ background: 'transparent' }}
                onClick={() => openPopover()}
              >
                copiar
              </Button>
            </PopoverTrigger>
            <PopoverContent
              _focus={{
                boxShadow: 'red',
                outline: 'none',
                outlineOffset: 'none'
              }}
              bg="black"
              color="white"
              w="100px"
              textAlign="center"
              fontSize="13px"
            >
              <PopoverArrow bg="black" />
              copiado
            </PopoverContent>
          </Popover>
        </Flex>
        <Img
          w="300px"
          src={checkoutOrderPixPagarme.charges[0].last_transaction.qr_code_url}
        />
      </Flex>

      <Text fontWeight="bold">O QR Code é válido somente até {expiresAt}</Text>
    </Flex>
  )
}

export default PixPurchase
