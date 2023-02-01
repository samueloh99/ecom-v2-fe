import { Flex, useBreakpointValue } from '@chakra-ui/react'

import Head from 'next/head'

import BaseTemplate from '../Base'

import Carousel from '../../components/HomePage/CarouselSlider'

import Section1 from '../../components/HomePage/Section1'
import Section2 from '../../components/HomePage/Section2'
import Section3 from '../../components/HomePage/Section3'
import Section4 from '../../components/HomePage/Section4'

const Slides = [
  // {
  //   src: 'https://chaes-upload-photos.s3.sa-east-1.amazonaws.com/others/homepage_mainbanner_desktop-1.gif',
  //   href: '/categoria/13'
  // },
  {
    src: 'https://chaes-upload-photos.s3.sa-east-1.amazonaws.com/others/homepage_mainbanner_desktop-2.jpg',
    href: '/'
  },
  {
    src: 'https://chaes-upload-photos.s3.sa-east-1.amazonaws.com/others/homepage_mainbanner_desktop-3.jpg',
    href: '/'
  }
]

const SliderMobile = [
  // {
  //   src: 'https://chaes-upload-photos.s3.sa-east-1.amazonaws.com/others/homepage_mainbanner_mobile-1.gif',
  //   href: '/categoria/13'
  // },
  {
    src: 'https://chaes-upload-photos.s3.sa-east-1.amazonaws.com/others/homepage_mainbanner_mobile-2.jpg',
    href: '/'
  },
  {
    src: 'https://chaes-upload-photos.s3.sa-east-1.amazonaws.com/others/homepage_mainbanner_mobile-3.jpg',
    href: '/'
  }
]

export const HomeTemplate = ({ carousel1, carousel2 }) => {
  const isMobile = useBreakpointValue({
    base: true,
    md: false
  })

  const homeBanners = isMobile ? SliderMobile : Slides

  return (
    <BaseTemplate>
      <Head>
        <title>Home</title>
        <meta property="og:title" content="My new title" key="title" />
      </Head>
      <Flex direction="column" h="100%">
        <Carousel images={homeBanners} />
        <Section1 />
        <Section2 produtos={carousel1} />
        <Section3 />
        <Section4 produtos={carousel2} />
      </Flex>
    </BaseTemplate>
  )
}

export default HomeTemplate
