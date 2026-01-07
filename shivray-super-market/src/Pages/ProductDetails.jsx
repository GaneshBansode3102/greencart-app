import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import ProductCard from "../compoenets/ProductCard";

const ProductDetails = () => {
    const { products, navigate, currency, addToCart } = useAppContext();
    const { id } = useParams();

    const [relatedProducts, setRelatedProducts] = useState([]);
    const [thumbnail, setThumbnail] = useState(null);

    const product = products.find((item) => item._id === id);

    /* Related Products */
    useEffect(() => {
        if (product && products.length > 0) {
            const filtered = products.filter(
                (item) =>
                    item.category === product.category && item._id !== product._id
            );
            setRelatedProducts(filtered.slice(0, 5));
        }
    }, [products, product]);

    /* Thumbnail */
    useEffect(() => {
        if (product?.image?.length) {
            setThumbnail(product.image[0]);
        }
    }, [product]);

    if (!product) return null;

    return (
        <div className="mt-12 px-4">
            {/* Breadcrumb */}
            <p className="text-sm text-gray-500">
                <Link to="/">Home</Link> /{" "}
                <Link to="/products">Products</Link> /{" "}
                <Link
                    to={`/products/${product.category.toLowerCase()}`}
                    className="capitalize"
                >
                    {product.category}
                </Link>{" "}
                / <span className="text-primary">{product.name}</span>
            </p>

            <div className="flex flex-col md:flex-row gap-10 mt-6">
                {/* Images */}
                <div className="flex gap-4">
                    <div className="flex flex-col gap-3">
                        {product.image.map((image, index) => (
                            <div
                                key={index}
                                onClick={() => setThumbnail(image)}
                                className="border border-gray-300 rounded cursor-pointer w-20 h-20 flex items-center justify-center"
                            >
                                <img src={image} alt="" className="max-h-full object-contain" />
                            </div>
                        ))}
                    </div>

                    <div className="border border-gray-300 rounded w-full max-w-sm flex items-center justify-center">
                        <img
                            src={thumbnail}
                            alt={product.name}
                            className="w-full object-contain"
                        />
                    </div>
                </div>

                {/* Details */}
                <div className="w-full md:w-1/2 text-sm">
                    <h1 className="text-3xl font-medium">{product.name}</h1>

                    <div className="flex items-center gap-1 mt-2">
                        {Array(5)
                            .fill("")
                            .map((_, i) => (
                                <img
                                    key={i}
                                    src={i < 4 ? assets.star_icon : assets.star_dull_icon}
                                    alt=""
                                    className="w-4"
                                />
                            ))}
                        <span className="ml-2 text-base">(4)</span>
                    </div>

                    <div className="mt-6">
                        <p className="text-gray-500 line-through">
                            MRP: {currency}
                            {product.price}
                        </p>
                        <p className="text-2xl font-medium text-primary">
                            Price: {currency}
                            {product.offerPrice}
                        </p>
                        <span className="text-gray-500 text-xs">
                            (inclusive of all taxes)
                        </span>
                    </div>

                    <p className="text-base font-medium mt-6">About Product</p>
                    <ul className="list-disc ml-5 text-gray-500">
                        {product.description.map((desc, index) => (
                            <li key={index}>{desc}</li>
                        ))}
                    </ul>

                    <div className="flex gap-4 mt-10">
                        <button
                            onClick={() => addToCart(product._id)}
                            className="w-full py-3 bg-gray-100 hover:bg-gray-200 font-medium"
                        >
                            Add to Cart
                        </button>

                        <button
                            onClick={() => {
                                addToCart(product._id);
                                navigate("/cart");
                            }}
                            className="w-full py-3.5 cursor-pointer font-medium bg-primary text-white hover:bg-primary-dull transition"
                        >
                            Buy Now
                        </button>
                    </div>
                </div>
            </div>
            <div className="flex flex-col items-center mt-20">
                <div className="flex flex-col items-center w-max">
                    <p className="text-3xl font-medium">Related Products</p>
                    <div className="w-20 h-0.5 bg-primary rounded-full mt-2"></div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-6 lg:grid-cols-5 mt-6 w-full">
                    {relatedProducts
                        .filter((product) => product.inStock)
                        .map((product, index) => (
                            <ProductCard key={index} product={product} />
                        ))}
                </div>

                <button
                    onClick={() => {
                        navigate("/products");
                        scrollTo(0, 0);
                    }}
                    className="mx-auto cursor-pointer px-12 my-16 py-2.5 border rounded text-primary hover:bg-primary/10 transition"
                >
                    See more
                </button>
            </div>

        </div>
    );
};

export default ProductDetails;
