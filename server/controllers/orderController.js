import Product from "../models/Product.js";
import Order from "../models/Order.js";
import User  from "../models/User.js"
import stripe from "stripe"

// Place Order COD : POST /api/order/cod
export const placeOrderCOD = async (req, res) => {
    try {
        const { userId, items, address } = req.body;

        // 1️⃣ Validate input
        if (!userId || !address || !items || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid order data",
            });
        }

        // 2️⃣ Calculate total amount using products
        let amount = await items.reduce(async (accPromise, item) => {
            const acc = await accPromise;
            const product = await Product.findById(item.product);

            if (!product) {
                throw new Error("Product not found");
            }

            return acc + product.offerPrice * item.quantity;
        }, Promise.resolve(0));

        // 3️⃣ Add tax charge (2%)
        const tax = Math.round(amount * 0.02);
        amount += tax;

        // 4️⃣ Create order (Cash on Delivery)
        const order = await Order.create({
            userId,
            items,
            address,
            amount,
            paymentType: "COD",
            //   isPaid: false,
            //   status: "Order Placed",
        });

        // 5️⃣ Send response
        return res.status(201).json({
            success: true,
            message: "Order placed successfully",
            order,
        });

    } catch (error) {
        console.error("Place Order Error:", error.message);

        return res.status(500).json({
            success: false,
            message: error.message || "Failed to place order",
        });
    }
};


// Place Order Stripe : POST /api/order/stripe
export const placeOrderStripe = async (req, res) => {
    try {
        const { userId, items, address } = req.body;
        const { origin } = req.headers;

        // 1️⃣ Validate input
        if (!userId || !address || !items || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid order data",
            });
        }

        let productData = []

        // 2️⃣ Calculate total amount using products
        let amount = await items.reduce(async (accPromise, item) => {
            const acc = await accPromise;
            const product = await Product.findById(item.product);
            productData.push({
                name: product.name,
                price: product.offerPrice,
                quantity: item.quantity
            })

            if (!product) {
                throw new Error("Product not found");
            }

            return acc + product.offerPrice * item.quantity;
        }, Promise.resolve(0));

        // 3️⃣ Add tax charge (2%)
        const tax = Math.round(amount * 0.02);
        amount += tax;

        // 4️⃣ Create order (Cash on Delivery)
        const order = await Order.create({
            userId,
            items,
            address,
            amount,
            paymentType: "Online",
            //   isPaid: false,
            //   status: "Order Placed",
        });

        // stripe Gatway Intilizer

        const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY)

        // create  line item  for stripe

        const line_items = productData.map((item) => {
            return {
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: item.name,
                    },
                    unit_amount: Math.floor(item.price + item.price * 0.02) * 100

                },
                quantity: item.quantity
            }
        })

        // create session

        const session = await stripeInstance.checkout.sessions.create({
            line_items,
            mode: 'payment',
            success_url: `${origin}/loader?next=my-orders`,
            cancel_url: `${origin}/cart`,
            metadata: {
                orderId: order._id.toString(),
                userId,
            }
        })

        // 5️⃣ Send response
        return res.status(201).json({
            success: true,
            url: session.url

        });

    } catch (error) {
        console.error("Place Order Error:", error.message);

        return res.status(500).json({
            success: false,
            message: error.message || "Failed to place order",
        });
    }
};



// Stripe  webhook to verify     payment Action: /stripe
export const stripWebhooks = async (req, res) => {
    // stripe Gatway Intilizer

    const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY)

    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripeInstance.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );

    } catch (error) {

        res.status(400).send(`Webhook Error:${error.message}`)
    }

    // handle the event
    switch (event.type) {
        case "payment_intent_succeeded": {
            const paymentIntent = event.data.object;
            const paymentIntentId = paymentIntent.id;

            // Getting session metadata
            const sessions = await stripeInstance.checkout.sessions.list({
                payment_intent: paymentIntentId,
            });

            const { orderId, userId } = sessions.data[0].metadata;

            // mark Payment as paid

            await Order.findByIdAndUpdate(orderId, { isPaid: true })

            // clear user cart

            await User.findByIdAndUpdate(userId, { cartItems: {} })
            break;
        }

        case "payment_intent_failed": {
            const paymentIntent = event.data.object;
            const paymentIntentId = paymentIntent.id;

            // Getting session metadata
            const sessions = await stripeInstance.checkout.sessions.list({
                payment_intent: paymentIntentId,
            });

            const { orderId } = sessions.data[0].metadata;
            await Order.findByIdAndDelete(orderId)
            break;
        }

        default:
            console.error(`Unhandled event  type ${event.type}`)
            break;
    }
    res.json({ received: true });

}




// Get Orders by User ID : GET /api/order/user
// export const getUserOrders = async (req, res) => {
//     try {
//         const { userId } = req.body;

//         // 1️⃣ Validate userId
//         if (!userId) {
//             return res.status(400).json({
//                 success: false,
//                 message: "User ID is required",
//             });
//         }

//         // 2️⃣ Fetch orders
//         const orders = await Order.find({
//             userId,
//             $or: [
//                 { paymentType: "COD" },
//                 { isPaid: true }
//             ],
//         })
//             .populate("items.product")
//             .populate("address")
//             .sort({ createdAt: -1 });

//         // 3️⃣ Send response
//         return res.status(200).json({
//             success: true,
//             orders,
//         });

//     } catch (error) {
//         console.error("Get User Orders Error:", error.message);

//         return res.status(500).json({
//             success: false,
//             message: error.message || "Failed to fetch orders",
//         });
//     }
// };



export const getUserOrders = async (req, res) => {
    try {
        const userId = req.userId; // ✅ from auth middleware

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        const orders = await Order.find({
            userId,
            $or: [{ paymentType: "COD" }, { isPaid: true }],
        })
            .populate("items.product")
            .populate("address")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            orders,
        });

    } catch (error) {
        console.error("Get User Orders Error:", error.message);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


// Get Orders by User ID : GET /api/order/user
export const getAllOrders = async (req, res) => {
    try {


        // 1️⃣ Validate userId
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required",
            });
        }

        // 2️⃣ Fetch orders
        const orders = await Order.find({

            $or: [
                { paymentType: "COD" },
                { isPaid: true }
            ],
        })
            .populate("items.product address")
            .sort({ createdAt: -1 });

        // 3️⃣ Send response
        return res.status(200).json({
            success: true,
            orders,
        });

    } catch (error) {
        console.error("Get User Orders Error:", error.message);

        return res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch orders",
        });
    }
};
