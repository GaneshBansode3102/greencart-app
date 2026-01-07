// Add  Product : api/product/add

import { v2 as cloudinary } from "cloudinary";
import Product from "../models/Product.js";


// export const addProduct = async (req, res) => {
//     try {
//         let productData = JSON.parse(req.body.productData)
//         const images = req.files

//         let imagesUrl = await Promise.all(
//             images.map(async (item) => {
//                 let result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' });
//                 return result.secure_url
//             })
//         )

//         await Product.create({ ...productData, image: imagesUrl })

//         res.josn({ success: true, message: "Product Added" })

//     } catch (error) {

//         console.error("Auth Error:", error.message);
//         return res.status(401).json({
//             success: false,
//             message: "SucccesFully",
//         });

//     }

// }



// export const addProduct = async (req, res) => {
//   try {
//     const productData = JSON.parse(req.body.productData);
//     const images = req.files;

//     if (!productData || images.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: "Product data or images missing",
//       });
//     }

//     const imageUrls = await Promise.all(
//       images.map(async (file) => {
//         const result = await cloudinary.uploader.upload(file.path);
//         return result.secure_url;
//       })
//     );

//     await Product.create({
//       ...productData,
//       image: imageUrls,
//     });

//     return res.json({
//       success: true,
//       message: "Product added successfully",
//     });

//   } catch (error) {
//     console.error("Add Product Error:", error);
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };



// export const addProduct = async (req, res) => {
//   try {
//     console.log("BODY:", req.body);
//     console.log("FILES:", req.files);

//     if (!req.body.productData) {
//       return res.status(400).json({
//         success: false,
//         message: "productData missing",
//       });
//     }

//     if (!req.files || req.files.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: "Images missing",
//       });
//     }

//     const productData = JSON.parse(req.body.productData);

//     const imageUrls = await Promise.all(
//       req.files.map(async (file) => {
//         const result = await cloudinary.uploader.upload(file.path);
//         return result.secure_url;
//       })
//     );

//     await Product.create({
//       ...productData,
//       image: imageUrls,
//     });

//     return res.json({
//       success: true,
//       message: "Product added successfully",
//     });

//   } catch (error) {
//     console.error("ADD PRODUCT ERROR:", error);
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };


export const addProduct = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILES:", req.files);

    const productData = JSON.parse(req.body.productData);

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Product images are required",
      });
    }

    const imageUrls = await Promise.all(
      req.files.map(async (file) => {
        const result = await cloudinary.uploader.upload(file.path);
        return result.secure_url;
      })
    );

    await Product.create({
      ...productData,
      image: imageUrls,
    });

    return res.json({
      success: true,
      message: "Product added successfully",
    });

  } catch (error) {
    console.error("ADD PRODUCT ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// Get Products : GET /api/product/list
export const productList = async (req, res) => {
  try {
    // Fetch all products from DB
    const products = await Product.find({});

    // Send success response
    return res.status(200).json({
      success: true,
      products,
    });

  } catch (error) {
    console.error("Get Product Error:", error.message);

    // Send error response
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch products",
    });
  }
};


// Get single Product : GET /api/product/:id
export const productById = async (req, res) => {
  try {
    const { id } = req.params;

    // 1️⃣ Check ID
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    // 2️⃣ Find product
    const product = await Product.findById(id);

    // 3️⃣ If product not found
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // 4️⃣ Success response
    return res.status(200).json({
      success: true,
      product,
    });

  } catch (error) {
    console.error("Get Product By ID Error:", error.message);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch product",
    });
  }
};




// Change Product stock : PATCH /api/product/stock
export const changeStock = async (req, res) => {
  try {
    const { id, inStock } = req.body;

    // 1️⃣ Validate input
    if (!id || typeof inStock !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "Product ID and inStock status are required",
      });
    }

    // 2️⃣ Update stock
    const product = await Product.findByIdAndUpdate(
      id,
      { inStock },
      { new: true }
    );

    // 3️⃣ If product not found
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // 4️⃣ Success response
    return res.status(200).json({
      success: true,
      message: "Product stock updated successfully",
      product,
    });

  } catch (error) {
    console.error("Change Stock Error:", error.message);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update stock",
    });
  }
};
