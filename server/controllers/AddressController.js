
import Address from "../models/Address.js"

// Add Address : POST /api/address/add/

// export const addAddress = async (req, res) => {
//     try {
//         const { address, userId } = req.body;

//         // 1️⃣ Validate input
//         if (!address || !userId) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Address details and userId are required",
//             });
//         }

//         // 2️⃣ Create address
//         const newAddress = await Address.create({
//             ...address,
//             userId,
//         });

//         // 3️⃣ Send success response
//         return res.status(201).json({
//             success: true,
//             message: "Address added successfully",
//             address: newAddress,
//         });

//     } catch (error) {
//         console.error("Add Address Error:", error.message);

//         return res.status(500).json({
//             success: false,
//             message: error.message || "Failed to add address",
//         });
//     }
// };


// Add Address : POST /api/address/add
export const addAddress = async (req, res) => {
  try {
    const userId = req.userId; // ✅ from authUser middleware
    const { address } = req.body;

    if (!userId || !address) {
      return res.status(400).json({
        success: false,
        message: "Invalid request",
      });
    }

    await Address.create({
      ...address,
      userId,
    });

    return res.status(201).json({
      success: true,
      message: "Address added successfully",
    });

  } catch (error) {
    console.error("Add Address Error:", error.message);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to add address",
    });
  }
};






// Get Adress : /api/address/get 
export const getAddress = async (req, res) => {
  try {
    const userId = req.userId; // from auth middleware

    const addresses = await Address.find({ userId });

    return res.status(200).json({
      success: true,
      addresses,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
