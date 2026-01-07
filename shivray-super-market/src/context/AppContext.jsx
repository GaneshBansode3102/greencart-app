import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dummyProducts } from "../assets/assets";
import toast from "react-hot-toast";
import axios from 'axios';

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

// Create Context
export const AppContext = createContext();

// Provider
export const AppContextProvider = ({ children }) => {
    const navigate = useNavigate();
    const currency = import.meta.env.VITE_CURRENCY

    const [user, setUser] = useState(true);
    const [isSeller, setIsSeller] = useState(false);
    const [showUserLogin, setshowUserLogin] = useState(false);
    const [products, setProducts] = useState([]);
    const [cartItems, setCartItems] = useState({});
    const [searchQuery, setsearchQuery] = useState({});


    // Fetch Seller stastus
    const fetchSeller = async () => {
        try {

            const { data } = await axios.get('/api/seller/is-auth');
            if (data.success) {
                setIsSeller(true)
            } else {
                setIsSeller(false)

            }
        } catch (error) {
            setIsSeller(false)

        }
    }



    // Fetch Seller Auth stastus User Data and cart items

    const fetchUser = async () => {
        try {

            const { data } = await axios.get('/api/user/is-auth');
            if (data.success) {
                setUser(data?.user)
                setCartItems(data?.user?.cartItems)
            } else {
                setUser(false)

            }
        } catch (error) {
            setUser(null)

        }
    }





    // fetch all produtcs
    const fetchProducts = async () => {
        try {
            const { data } = await axios.get("/api/product/list");
            if (data.success) {
                setProducts(data?.products)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)

        }
    }

    // Add  All  prodcuts
    const addToCart = (itemId) => {
        let cartData = structuredClone(cartItems);
        if (cartData[itemId]) {
            cartData[itemId] += 1;
        } else {
            cartData[itemId] = 1;
        }
        setCartItems(cartData);
        toast.success('Added To Cart')
    }

    // Update Cart Item  Qty
    const updateCartItem = (itemId, quantity) => {
        let cartData = structuredClone(cartItems);  // Deep copy prevents side effects
        cartData[itemId] = quantity;                 // Direct object update on copy
        setCartItems(cartData);                      // Triggers React re-render
        toast.success("Cart Updated");               // User feedback
    };



    // Remove Product from Cart
    const removeFromCart = (itemId) => {
        let cartData = structuredClone(cartItems);

        if (cartData[itemId]) {
            cartData[itemId] -= 1;

            if (cartData[itemId] === 0) {
                delete cartData[itemId];
            }
        }

        toast.success("Removed from Cart");
        setCartItems(cartData);
    };



    // get cart item count

    const getCartCount = () => {
        let totalCount = 0;
        for (const item in cartItems) {
            totalCount += cartItems[item]
        }
        return totalCount
    }

    // get Total cart Amout

    const getCartAmount = () => {
        let totalCount = 0;
        for (const items in cartItems) {
            let itemInfo = products.find((product) => product._id === items);
            if (cartItems[items] > 0) {
                totalCount += itemInfo.offerPrice * cartItems[items]
            }
        }
        return Math.floor(totalCount * 100) / 100;
    }


    useEffect(() => {
        fetchUser()
        fetchSeller()
        fetchProducts()

    }, [])



    // Update Database cart Items


    useEffect(() => {
        const updateCart = async () => {
            try {
                const { data } = await axios.post(
                    "/api/cart/update",
                    { cartItems },
                    { withCredentials: true } // ✅ important
                );

                if (!data.success) {
                    toast.error(data.message);
                }
            } catch (error) {
                toast.error(
                    error?.response?.data?.message || "Failed to update cart"
                );
            }
        };

        if (user && Object.keys(cartItems).length > 0) {
            updateCart();
        }
    }, [cartItems,]);


    const value = {
        navigate,
        user,
        setUser,
        isSeller,
        setIsSeller,
        showUserLogin,
        setshowUserLogin,
        products,
        currency,
        cartItems,
        addToCart,
        updateCartItem,
        removeFromCart,
        setsearchQuery,
        searchQuery,
        getCartAmount,
        getCartCount,
        axios,
        fetchProducts,
        setCartItems

    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

// Custom Hook
export const useAppContext = () => {
    return useContext(AppContext);
};
