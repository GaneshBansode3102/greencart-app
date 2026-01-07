import React from 'react'
import { useAppContext } from '../context/AppContext'
import { useParams } from 'react-router-dom'
import { categories } from '../assets/assets'
import ProductCard from '../compoenets/ProductCard'

const ProductCategory = () => {

    const { products } = useAppContext()
    const { category } = useParams()

    const SearchCategory = categories.find((item) => item.path.toLowerCase() === category)

    const filterProducts = products.filter((product) => product.category.toLowerCase() === category)

    return (
        <div className='mt-16'>
            {SearchCategory && (
                <div className='flex flex-col items-end w-max'>
                    <p className='text-2xl fonSt-medium'>{SearchCategory.text.toUpperCase()}</p>
                    <div className='w-16 h-0.5 bg-primary rounded-full'></div>
                </div>
            )}

            {
                filterProducts.length > 0 ? (
                    <div className='grid grid-cols-1 place-items-center px-4 sm:grid-cols-3 md:grid-cols-2 gap-3
                                    md:gap-6 lg:grid-cols-5 mt-6'>
                        {filterProducts.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className='flex items-center justify-center h=[60vh]'>
                        <p className='text-2xl font-medium text-primary'>No Products Found in this  Category.</p>
                    </div>
                )
            }

        </div>
    )
}

export default ProductCategory
