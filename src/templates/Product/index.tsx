import BaseTemplate from '../Base'

import ProductPageSection from '../../components/ProductPageSection'
// import ProductPageSkeleton from '../../components/SkeletonPages/ProductPage/ProductPageSkeleton'

const ProductTemplate = ({ product }) => {
  // if (isFallback) {
  //   return (
  //     <BaseTemplate>
  //       <ProductPageSkeleton />
  //     </BaseTemplate>
  //   )
  // }
  return (
    <BaseTemplate>
      <ProductPageSection product={product} />
    </BaseTemplate>
  )
}

export default ProductTemplate
