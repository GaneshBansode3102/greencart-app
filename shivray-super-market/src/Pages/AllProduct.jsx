// import React, { useEffect, useState } from 'react'
// import { useAppContext } from '../context/AppContext'
// import ProductCard from '../compoenets/ProductCard'

// const AllProduct = () => {
//     const { products, searchQuery } = useAppContext()
//     const [filteredProducts, setfilteredProducts] = useState([])

//     useEffect(() => {
//         if (searchQuery.length > 0) {
//             setfilteredProducts(products.filter(
//                 product => product.name.toLowerCase().includes(searchQuery.toLowerCase())
//             ))
//         } else {
//             setfilteredProducts(products)
//         }
//     }, [products, searchQuery])
//     return (
//         <div className='mt-16 flex flex-col'>
//             <div className='flex flex-col items-end w-max'>
//                 <p className='text-2xl font medium uppercase'>All products</p>
//                 <div className='w-16 h-0.5 bg-primary rounded-full'> </div>
//             </div>

//             <div>
//                 {filteredProducts.filter((prodcut) => product.inStock).map((product, index) => (<ProductCard key={index} product={product} />))}
//             </div>

//         </div>
//     )
// }

// export default AllProduct


import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import ProductCard from "../compoenets/ProductCard";
const AllProduct = () => {
    const { products, searchQuery } = useAppContext();
    const [filteredProducts, setFilteredProducts] = useState([]);

    useEffect(() => {
        if (searchQuery && searchQuery.length > 0) {
            setFilteredProducts(
                products.filter((product) =>
                    product.name.toLowerCase().includes(searchQuery.toLowerCase())
                )
            );
        } else {
            setFilteredProducts(products);
        }
    }, [products, searchQuery]);

    return (
        <div className="mt-16 flex flex-col">
            {/* Title */}

            <div className="flex flex-col items-center lg:items-start md:items-center mb-6">
                <p className="text-2xl font-medium uppercase text-center lg:text-right">
                    All Products
                </p>
                <div className="w-16 h-0.5 bg-primary rounded-full"></div>
            </div>


            {/* Product Grid */}
            <div className="grid grid-cols-1 place-items-center px-4 sm:grid-cols-3 md:grid-cols-2 gap-3
      md:gap-6 lg:grid-cols-5 mt-6">
                {filteredProducts
                    .filter((product) => product.inStock)
                    .map((product) => (
                        <ProductCard key={product._id} product={product} />
                    ))}
            </div>
        </div>
    );
};

export default AllProduct;
