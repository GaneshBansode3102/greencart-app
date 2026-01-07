import React from "react";
import ProductCard from "./ProductCard";
import { useAppContext } from "../context/AppContext";

const BestSeller = () => {
  const { products } = useAppContext();

  // Guard condition
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className="mt-16">
      <p className="text-2xl md:text-3xl font-medium mb-4">
        Best Seller
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {products
          .filter((product) => product.inStock)
          .slice(0, 5)
          .map((product, index) => (
            <ProductCard key={product._id || index} product={product} />
          ))}
      </div>
    </div>
  );
};

export default BestSeller;
