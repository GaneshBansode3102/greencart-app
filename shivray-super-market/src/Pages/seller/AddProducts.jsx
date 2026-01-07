// import React, { useState } from 'react'
// import { assets, categories } from '../../assets/assets';
// import { useAppContext } from '../../context/AppContext';
// import toast from 'react-hot-toast';

// const AddProducts = () => {

//     const [files, setFiles] = useState([]);
//     const [name, setName] = useState("");
//     const [description, setDescription] = useState("");
//     const [category, setCategory] = useState("");
//     const [price, setPrice] = useState("");
//     const [offerPrice, setOfferPrice] = useState("");

//     const { axios } = useAppContext()

//     const onSubmitHandler = async (event) => {
//         try {
//             event.preventDefault();
//             const productdata = {
//                 name,
//                 description: description.split('\n'),
//                 category,
//                 price,
//                 offerPrice

//             }

//             const formData = new FormData();
//             formData.append('productData', JSON.stringify(productdata))

//             for (let i = 0; i < files.length; i++) {
//                 formData.append('images', files[i])
//             }
//             console.log("data",formData)


//             const { data } = await axios.post('/api/product/add', formData)
//             console.log("data",data)
//             if (data.success) {
//                 toast.success(data?.message);
//                 setName('')
//                 setDescription('')
//                 setCategory('')
//                 setPrice('')
//                 setOfferPrice('')
//                 setFiles([])
//             } else {
//                 toast.error(data?.message);

//             }

//         } catch (error) {
//             toast.error(error?.message);

//         }
//     };

//     return (
//         <div className="no-scrollbar flex-1 h-[95vh] overflow-y-scroll flex flex-col justify-between">
//             <form onSubmit={onSubmitHandler} className="md:p-10 p-4 space-y-5 max-w-lg">
//                 <div>
//                     <p className="text-base font-medium">Product Image</p>
//                     <div className="flex flex-wrap items-center gap-3 mt-2">
//                         {Array(4).fill('').map((_, index) => (
//                             <label key={index} htmlFor={`image${index}`}>
//                                 <input
//                                     onChange={(e) => {
//                                         const updateFiles = [...files];
//                                         updateFiles[index] = e.target.files[0]
//                                         setFiles(updateFiles)
//                                     }}

//                                     accept="image/*" type="file" id={`image${index}`} hidden />
//                                 <img src={files[index] ? URL.createObjectURL(files[index]) : assets.upload_area} alt="uploadArea" className='max-w-24 cursor-pointer' />
//                             </label>
//                         ))}
//                     </div>
//                 </div>
//                 <div className="flex flex-col gap-1 max-w-md">
//                     <label className="text-base font-medium" htmlFor="product-name">Product Name</label>
//                     <input onChange={(e) => setName(e.target.value)}
//                         value={name}
//                         id="product-name" type="text" placeholder="Type here" className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40" required />
//                 </div>
//                 <div className="flex flex-col gap-1 max-w-md">
//                     <label className="text-base font-medium" htmlFor="product-description">Product Description</label>
//                     <textarea
//                         value={description}
//                         onChange={(e) => setDescription(e.target.value)}
//                         id="product-description" rows={4} className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none" placeholder="Type here"></textarea>
//                 </div>
//                 <div className="w-full flex flex-col gap-1">
//                     <label className="text-base font-medium" htmlFor="category">Category</label>
//                     <select
//                         value={category}
//                         onChange={(e) => setCategory(e.target.value)}
//                         id="category" className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40">
//                         <option value="">Select Category</option>
//                         {categories.map((item, index) => (
//                             <option key={index} value={item.path}>{item.path}</option>
//                         ))}
//                     </select>
//                 </div>
//                 <div className="flex items-center gap-5 flex-wrap">
//                     <div className="flex-1 flex flex-col gap-1 w-32">
//                         <label className="text-base font-medium" htmlFor="product-price">Product Price</label>
//                         <input
//                             value={price}
//                             onChange={(e) => setPrice(e.target.value)}
//                             id="product-price" type="number" placeholder="0" className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40" required />
//                     </div>
//                     <div className="flex-1 flex flex-col gap-1 w-32">
//                         <label className="text-base font-medium" htmlFor="offer-price">Offer Price</label>
//                         <input
//                             value={offerPrice}
//                             onChange={(e) => setOfferPrice(e.target.value)}
//                             id="offer-price" type="number" placeholder="0" className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40" required />
//                     </div>
//                 </div>
//                 <button className="px-8 py-2.5 bg-primary text-white font-medium rounded cursor-pointer">ADD</button>
//             </form>
//         </div>
//     )
// }

// export default AddProducts



import React, { useState } from 'react';
import { assets, categories } from '../../assets/assets';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const AddProducts = () => {
    const [files, setFiles] = useState([]);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [price, setPrice] = useState("");
    const [offerPrice, setOfferPrice] = useState("");
    const [loading, setLoading] = useState(false);

    const { axios } = useAppContext();

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        if (loading) return;

        try {
            setLoading(true);

            const productData = {
                name,
                description: description.split("\n"),
                category,
                price,
                offerPrice,
            };

            const formData = new FormData();
            formData.append("productData", JSON.stringify(productData));

            files.forEach((file) => {
                if (file) {
                    formData.append("images", file);
                }
            });

            const { data } = await axios.post("/api/product/add", formData, {
                withCredentials: true,
            });

            if (data.success) {
                toast.success(data.message || "Product added successfully");
                setName("");
                setDescription("");
                setCategory("");
                setPrice("");
                setOfferPrice("");
                setFiles([]);
            } else {
                toast.error(data.message || "Failed to add product");
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="no-scrollbar flex-1 h-[95vh] overflow-y-scroll flex flex-col justify-between">
            <form onSubmit={onSubmitHandler} className="md:p-10 p-4 space-y-5 max-w-lg">

                {/* Images */}
                <div>
                    <p className="text-base font-medium">Product Image</p>
                    <div className="flex flex-wrap items-center gap-3 mt-2">
                        {Array(4).fill("").map((_, index) => (
                            <label key={index} htmlFor={`image${index}`}>
                                <input
                                    type="file"
                                    id={`image${index}`}
                                    hidden
                                    accept="image/*"
                                    disabled={loading}
                                    onChange={(e) => {
                                        const updatedFiles = [...files];
                                        updatedFiles[index] = e.target.files[0];
                                        setFiles(updatedFiles);
                                    }}
                                />
                                <img
                                    src={
                                        files[index]
                                            ? URL.createObjectURL(files[index])
                                            : assets.upload_area
                                    }
                                    alt="upload"
                                    className="max-w-24 cursor-pointer"
                                />
                            </label>
                        ))}
                    </div>
                </div>

                {/* Product Name */}
                <div className="flex flex-col gap-1 max-w-md">
                    <label className="text-base font-medium">Product Name</label>
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={loading}
                        type="text"
                        required
                        className="outline-none py-2 px-3 rounded border border-gray-500/40"
                    />
                </div>

                {/* Description */}
                <div className="flex flex-col gap-1 max-w-md">
                    <label className="text-base font-medium">Product Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        disabled={loading}
                        rows={4}
                        className="outline-none py-2 px-3 rounded border border-gray-500/40 resize-none"
                    />
                </div>

                {/* Category */}
                <div className="flex flex-col gap-1">
                    <label className="text-base font-medium">Category</label>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        disabled={loading}
                        className="outline-none py-2 px-3 rounded border border-gray-500/40"
                    >
                        <option value="">Select Category</option>
                        {categories.map((item, index) => (
                            <option key={index} value={item.path}>
                                {item.path}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Price */}
                <div className="flex gap-4">
                    <div className="flex flex-col gap-1 w-32">
                        <label className="text-base font-medium">Price</label>
                        <input
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            disabled={loading}
                            required
                            className="outline-none py-2 px-3 rounded border border-gray-500/40"
                        />
                    </div>

                    <div className="flex flex-col gap-1 w-32">
                        <label className="text-base font-medium">Offer Price</label>
                        <input
                            type="number"
                            value={offerPrice}
                            onChange={(e) => setOfferPrice(e.target.value)}
                            disabled={loading}
                            required
                            className="outline-none py-2 px-3 rounded border border-gray-500/40"
                        />
                    </div>
                </div>

                {/* Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className={`px-8 py-2.5 rounded text-white font-medium flex items-center justify-center gap-2
                    ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-primary hover:bg-primary-dull"}`}
                >
                    {loading ? (
                        <>
                            <svg
                                className="animate-spin h-5 w-5 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                />
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                />
                            </svg>
                            Adding...
                        </>
                    ) : (
                        "ADD"
                    )}
                </button>

            </form>
        </div>
    );
};

export default AddProducts;
