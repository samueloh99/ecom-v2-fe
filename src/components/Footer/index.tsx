import { useState } from 'react'
import NextLink from 'next/link'

import {
  Icon,
  Flex,
  Stack,
  Box,
  Text,
  Img,
  useToast,
  Input,
  Button
} from '@chakra-ui/react'

import { AiFillFacebook, AiFillInstagram } from 'react-icons/ai'

const Footer = () => {
  const toast = useToast()
  const [fields, setFields] = useState({
    nome: '',
    email: ''
  })

  const handleRegisterNews = () => {
    if (!fields.email.includes('@') && !fields.email.includes('.com')) {
      return toast({
        title: 'Preencha o email corretamente.',
        description: 'Email incorreto.',
        status: 'error',
        duration: 3000,
        isClosable: true
      })
    }
    toast({
      title: 'Você se cadastrou na newsletter.',
      description: 'Agora receba todas as novidades!',
      status: 'success',
      duration: 3000,
      isClosable: true
    })
    setFields({
      email: '',
      nome: ''
    })
  }
  return (
    <Flex
      w="100%"
      marginTop="auto"
      direction="column"
      justifyContent="center"
      alignItems="center"
      bg="black"
      color="white"
      fontSize="13px"
    >
      <Flex
        px={{ base: '1', lg: '10' }}
        py="5"
        bg="gray.900"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
        direction={{ base: 'column', lg: 'row' }}
      >
        <Stack
          w="40%"
          mb={{ base: '10', lg: '0' }}
          textAlign={{ base: 'center', lg: 'start' }}
        >
          <Text fontWeight="bold">NEWSLETTER</Text>
          <Text>Receba ofertas exclusivas no seu e-mail</Text>
        </Stack>
        <form>
          <Stack
            w="100%"
            direction={{ base: 'column', lg: 'row' }}
            spacing={{ base: 5, lg: 10 }}
          >
            <Input
              id="nome"
              value={fields.nome}
              onChange={e => setFields({ ...fields, nome: e.target.value })}
              placeholder="Qual seu nome ?"
            />
            <Input
              id="email"
              value={fields.email}
              onChange={e => setFields({ ...fields, email: e.target.value })}
              placeholder="Qual seu email ?"
            />
            <Button
              w="300px"
              bg="black"
              color="white"
              onClick={handleRegisterNews}
            >
              CADASTRAR
            </Button>
          </Stack>
        </form>
      </Flex>
      <Flex
        px={{ base: '1', lg: '10' }}
        py="5"
        w="100%"
        alignItems={{ base: 'center', lg: 'start' }}
        textAlign={{ base: 'center', lg: 'start' }}
        justifyContent="space-between"
        direction={{ base: 'column', lg: 'row' }}
      >
        <Box>
          <Text fontWeight="bold">INSTITUCIONAL</Text>
          <Stack py={2}>
            <Text>
              <NextLink href="/">Home</NextLink>
            </Text>
            <Text>
              <NextLink href="/pag/sobre">Sobre</NextLink>
            </Text>
            <Text>
              <NextLink href="/pag/cadastro">Dúvidas</NextLink>
            </Text>
            <Text>
              <NextLink href="/pag/trocas-e-devolucoes">
                Trocas & Devoluções
              </NextLink>
            </Text>
          </Stack>
        </Box>
        <Box my={{ base: '5', lg: '0' }}>
          <Text fontWeight="bold">MINHA CONTA</Text>
          <Stack py={2}>
            <Text>
              <NextLink href="/userinfo/pedidos">Meus Pedidos</NextLink>
            </Text>
            <Text>
              <NextLink href="/userinfo/cadastro">Meus Dados</NextLink>
            </Text>
            <Text>
              <NextLink href="/meusfavoritos">Lista de Favoritos</NextLink>
            </Text>
          </Stack>
        </Box>
        <Box mb={{ base: '10', lg: '0' }}>
          <Text fontWeight="bold">ATENDIMENTO</Text>
          <Stack py={2}>
            <Text>
              WhatsApp:
              <a
                href="https://api.whatsapp.com/send/?phone=5511911826504&text&type=phone_number&app_absent=0"
                target="_blank"
              >
                (11) 91182-6504
              </a>
            </Text>
            <Text>Email: contato@chaes.com.br</Text>
          </Stack>
          <Flex mt={{ base: '5', lg: '10' }} direction="column">
            <Text fontWeight="bold">LOCALIZAÇÃO (FÁBRICA)</Text>
            <Stack py={2}>
              <Text>Rua dos Italianos, 25</Text>
              <Text>Bom Retiro - São Paulo/SP</Text>
              <Text>CEP: 01131-000 - Brasil</Text>
            </Stack>
          </Flex>
        </Box>
        <Stack spacing={10}>
          <Stack>
            <Text fontWeight="bold">FORMAS DE PAGAMENTO</Text>
            <Img src="https://braavo-cache.nyc3.cdn.digitaloceanspaces.com/zen/0x0-2693599767.png" />
          </Stack>
          <Stack direction="column">
            <Text fontWeight="bold">SIGA-NOS</Text>
            <Stack
              display="flex"
              direction="row"
              justifyContent={{ base: 'center', lg: 'start' }}
            >
              <a href="https://www.instagram.com/chaes.style/" target="_blank">
                <Icon fontSize={25} as={AiFillInstagram} />
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=100085554567554"
                target="_blank"
              >
                <Icon fontSize={25} as={AiFillFacebook} />
              </a>
            </Stack>
          </Stack>
        </Stack>
      </Flex>
    </Flex>
  )
}

export default Footer
