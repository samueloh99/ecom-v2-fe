import React, { useEffect, useState } from 'react'

import { CircularProgressbar } from 'react-circular-progressbar'

import { MdError, MdLink, MdCheckCircle } from 'react-icons/md'

import {
  Flex,
  Icon,
  Img,
  Text,
  HStack,
  VStack,
  Wrap,
  Progress
} from '@chakra-ui/react'
import Link from 'next/link'

type FileListDTO = {
  uploadedFiles: {
    item: File
    id: string
    name: string
    readableSize: string
    preview: string
    progress: number
    uploaded: boolean
    error: boolean
    url: any
  }[]
}

const FileList = ({ uploadedFiles }: FileListDTO) => {
  const [progressBar, setProgressBar] = useState(0)

  useEffect(() => {
    const progressBarValue = Math.round(
      uploadedFiles.map(item => item.progress).reduce((a, b) => a + b) /
        uploadedFiles.length
    )
    setProgressBar(progressBarValue)
  }, [uploadedFiles])

  return (
    <Flex direction="column">
      <Text>Total de {Object.keys(uploadedFiles).length} fotos.</Text>
      {uploadedFiles && (
        <Flex my="10px" direction="column">
          {progressBar === 100 && <Text color="green">Upload Completo.</Text>}
          <Progress
            value={progressBar}
            colorScheme={progressBar === 100 && 'green'}
          />
        </Flex>
      )}
      <Wrap mt="10px" w="100%">
        {Object.keys(uploadedFiles).map((item, index) => {
          return (
            <HStack
              key={index}
              p="10px"
              borderRadius="5px"
              bg="gray.600"
              maxW="500px"
              align="start"
              color="white"
            >
              <HStack alignItems="start" w="250px">
                <Img
                  w="60px"
                  h="100%"
                  borderRadius={5}
                  src={uploadedFiles[item].preview}
                />
                <VStack direction="column" w="100%" h="100%" alignItems="start">
                  <Text fontSize={14}>{uploadedFiles[item].name}</Text>
                  <Text fontSize={12} color="999">
                    {uploadedFiles[item].readableSize}
                  </Text>
                </VStack>
              </HStack>
              <HStack w="auto" h="100%" justify="center" align="center">
                {!uploadedFiles[item].uploaded && !uploadedFiles[item].error && (
                  <CircularProgressbar
                    value={uploadedFiles[item].progress}
                    strokeWidth={10}
                    styles={{
                      root: { width: 25 },
                      path: { stroke: '#7159c1' }
                    }}
                  />
                )}

                {uploadedFiles[item].url && (
                  <Link href="#" target="_blank">
                    <Icon
                      cursor="pointer"
                      as={MdLink}
                      mr={8}
                      fontSize={25}
                      color="white"
                    />
                  </Link>
                )}
                {uploadedFiles[item].uploaded && (
                  <Icon as={MdCheckCircle} fontSize={25} color="#78e5d5" />
                )}
                {uploadedFiles[item].error && (
                  <Icon as={MdError} fontSize={25} color="#e57878" />
                )}
              </HStack>
            </HStack>
          )
        })}
      </Wrap>
    </Flex>
  )
}

export default FileList
