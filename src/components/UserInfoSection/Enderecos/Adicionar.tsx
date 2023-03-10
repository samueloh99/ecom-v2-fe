import React, { useState } from 'react'

import {
  Text,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  Link,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  HStack,
  VStack,
  Input,
  Button
} from '@chakra-ui/react'

import { useAuthContext } from '../../../contexts/AuthContext'
import { cepMask } from '../../../../utils/masks'
import { useFreteGratisContext } from '../../../contexts/FreteGratisContext'
import { api } from '../../../services/apiClient'
import { queryClient } from '../../../services/queryClient'

export const UserInfoAddEndereco = ({ isOpen, onClose }) => {
  const { userData } = useAuthContext()

  const { cepResultAutoComplete } = useFreteGratisContext()

  const [cep, setCep] = useState('')

  const [fields, setFields] = useState({
    endereco: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
    destinatario: '',
    lembrete: ''
  })

  const [validations, setValidations] = useState({
    invalidate: true,
    cepValidator: false,
    blankFields: false
  })

  const searchCep = async (value: string) => {
    if (cep.length !== 7) {
      return false
    }

    setValidations({
      invalidate: true,
      cepValidator: false,
      blankFields: false
    })

    const viaCepResult = await cepResultAutoComplete(value.replace('-', ''))
    if (viaCepResult.erro !== 'true') {
      setFields({
        ...fields,
        bairro: viaCepResult.bairro,
        endereco: viaCepResult.logradouro,
        cidade: viaCepResult.localidade,
        estado: viaCepResult.uf
      })
    } else {
      setFields({
        ...fields,
        bairro: '',
        endereco: '',
        cidade: '',
        estado: ''
      })
      console.log('ERRO NA BUSCA DO CEP')
      return setValidations({
        ...validations,
        cepValidator: true
      })
    }
  }

  const onSubmit = async () => {
    const newObj = {
      ...fields,
      cep: cep,
      usuario_id: userData.id,
      pais: 'BR'
    }

    if (
      fields.destinatario.length < 1 ||
      fields.numero.length < 1 ||
      fields.complemento.length < 1 ||
      cep.length < 1 ||
      fields.cidade.length < 1 ||
      fields.estado.length < 1 ||
      fields.bairro.length < 1
    ) {
      return setValidations({ ...validations, blankFields: true })
    }

    await api.post('/enderecos', newObj).then(res => {
      if (res.status === 200) {
        setValidations({ ...validations, invalidate: true })
        queryClient.invalidateQueries('enderecos')
        onClose()
      } else {
        setValidations({ ...validations, invalidate: false })
      }
    })
  }
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Adicionar Endere??o</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {validations.invalidate === false && (
            <Flex>
              <Text fontSize={15} color="red">
                Endere??o n??o adicionado
              </Text>
            </Flex>
          )}

          {validations.blankFields === true && (
            <Flex>
              <Text fontSize={15} color="red">
                Preencha os Campos.
              </Text>
            </Flex>
          )}
          <Flex direction="column">
            <VStack alignItems="start">
              <Text>CEP*</Text>
              <Input
                id="cep"
                maxLength={9}
                value={cep}
                onChange={e => (
                  setCep(cepMask(e.target.value)),
                  e.target.value.length === 8 && searchCep(e.target.value)
                )}
              />
              {validations.cepValidator === true ? (
                <Text fontSize={10} color="red">
                  CEP Inv??lido
                </Text>
              ) : (
                <></>
              )}
              <Link
                href="https://buscacepinter.correios.com.br/app/endereco/index.php"
                target="_blank"
                textDecoration="underline"
              >
                N??o sei meu CEP
              </Link>
            </VStack>
            <VStack mt="5px" alignItems="start">
              <Text>Endere??o*</Text>
              <Input
                id="endereco"
                value={fields.endereco}
                onChange={e =>
                  setFields({ ...fields, endereco: e.target.value })
                }
              />
            </VStack>

            <HStack alignItems="start">
              <Flex direction="column">
                <Text>N??mero*</Text>
                <Input
                  id="numero"
                  value={fields.numero}
                  onChange={e =>
                    setFields({ ...fields, numero: e.target.value })
                  }
                />
              </Flex>
              <Flex direction="column">
                <Text>Complemento*</Text>
                <Input
                  id="complemento"
                  value={fields.complemento}
                  onChange={e =>
                    setFields({ ...fields, complemento: e.target.value })
                  }
                />
              </Flex>
            </HStack>

            <VStack alignItems="start">
              <Text>Bairro*</Text>
              <Input
                id="bairro"
                value={fields.bairro}
                onChange={e => setFields({ ...fields, bairro: e.target.value })}
              />
            </VStack>

            <HStack alignItems="start">
              <Flex direction="column">
                <Text>Cidade*</Text>
                <Input
                  id="cidade"
                  value={fields.cidade}
                  onChange={e =>
                    setFields({ ...fields, cidade: e.target.value })
                  }
                />
              </Flex>
              <Flex direction="column">
                <Text>Estado*</Text>
                <Input
                  id="estado"
                  value={fields.estado}
                  onChange={e =>
                    setFields({ ...fields, estado: e.target.value })
                  }
                />
              </Flex>
            </HStack>

            <VStack alignItems="start">
              <Text>Destinat??rio*</Text>
              <Input
                id="destinatario"
                value={fields.destinatario}
                onChange={e =>
                  setFields({ ...fields, destinatario: e.target.value })
                }
              />
            </VStack>

            <VStack alignItems="start">
              <Text>Lembrete</Text>
              <Input
                id="lembrete"
                value={fields.lembrete}
                onChange={e =>
                  setFields({ ...fields, lembrete: e.target.value })
                }
              />
            </VStack>
          </Flex>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Fechar
          </Button>
          <Button bg="black" color="white" onClick={() => onSubmit()}>
            Adicionar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default UserInfoAddEndereco
