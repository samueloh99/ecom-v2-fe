import React, { useCallback, useEffect, useState } from 'react'

import fileSize from 'filesize'

import { uniqueId } from 'lodash'

import { Button, Flex, Stack, Text } from '@chakra-ui/react'

import Dropzone from 'react-dropzone'

import FileList from './FileList'

import { api } from '../../../../services/apiClient'

type FileState = {
  item: File
  id: string
  name: string
  readableSize: string
  preview: string
  progress: number
  uploaded: boolean
  error: boolean
  url: any
}

const PhotoBulk = () => {
  const [uploadedFiles, setUploadedFiles] = useState<FileState[]>([])
  const [signal, setSignal] = useState(false)

  useEffect(() => {
    if (signal) {
      uploadedFiles.forEach(processUpload)
    }
  }, [signal])

  const processUpload = async (toUpload: FileState) => {
    const data = new FormData()

    data.append('file', toUpload.item, toUpload.name)

    let newArr = [...uploadedFiles]

    const findIndex = newArr.map(item => item.id).indexOf(toUpload.id)

    await api
      .post('/skus/bulk_fotos', data, {
        onUploadProgress: e => {
          const totalE = e.total as number
          const loadedE = e.loaded as number
          const progress = Math.round((loadedE * 100) / totalE)

          newArr[findIndex].progress = progress

          setUploadedFiles(newArr)
        }
      })
      .then(res => {
        newArr[findIndex].uploaded = true
        newArr[findIndex].id = res.data._id
        newArr[findIndex].url = res.data.url

        setUploadedFiles(newArr)
      })
      .catch(err => {
        newArr[findIndex].error = true

        setUploadedFiles(newArr)
      })
  }

  const handleUpload = (files: File[]) => {
    const uploadedFilesProp = Object.keys(files).map(item => ({
      item: files[item] as File,
      id: uniqueId(),
      name: files[item].name as string,
      readableSize: fileSize(files[item].size as number),
      preview: URL.createObjectURL(files[item]),
      progress: 20,
      uploaded: false,
      error: false,
      url: null
    }))

    setUploadedFiles([...uploadedFiles, ...uploadedFilesProp])

    setSignal(true)

    uploadedFiles.forEach(processUpload)
  }

  const renderDragMessage = (isDragActive, isDragReject) => {
    if (!isDragActive) {
      return <Text>Arraste os arquivos aqui...</Text>
    }

    if (isDragReject) {
      return <Text color="#e57878">Arquivo não suportado.</Text>
    }

    return <Text color="#78e5d5">Solte os arquivos aqui</Text>
  }

  return (
    <Stack borderRadius={8} bg="gray.800" p="8" w="100%">
      <Flex>
        <Text>Fotos em massa</Text>
      </Flex>
      <Flex py="10px">
        <Dropzone accept={{ 'image/*': [] }} onDropAccepted={handleUpload}>
          {({ getRootProps, getInputProps, isDragActive, isDragReject }) => {
            return (
              <Flex
                alignItems="center"
                justifyContent="center"
                w="100%"
                {...getRootProps()}
                p="50px"
                border={`1px dashed ${isDragActive ? '#78e5d5' : '#ddd'}`}
                borderColor={isDragReject && '#e57878'}
                cursor="pointer"
                borderRadius="4px"
                transition="height 0.2s ease"
              >
                <input {...getInputProps()} />
                {renderDragMessage(isDragActive, isDragReject)}
              </Flex>
            )
          }}
        </Dropzone>
      </Flex>

      {uploadedFiles.length !== 0 && <FileList uploadedFiles={uploadedFiles} />}
    </Stack>
  )
}

export default PhotoBulk
