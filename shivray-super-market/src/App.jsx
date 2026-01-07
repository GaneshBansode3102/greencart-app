import React from 'react'
import Navbar from './compoenets/Navbar'
import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './Pages/home'
import { Toaster } from 'react-hot-toast'
import Footer from './compoenets/Footer'
import { useAppContext } from './context/AppContext'
import Login from './compoenets/Login'
import AllProduct from './Pages/AllProduct'
import ProductCategory from './Pages/ProductCategory'
import ProductDetails from './Pages/ProductDetails'
import Cart from './Pages/Cart'
import AddAddress from './Pages/AddAddress'
import MyOrders from './Pages/MyOrders'
import SellerLogin from './compoenets/seller/sellerLogin'
import SellerLayout from './Pages/seller/sellerLayout'
import AddProducts from './Pages/seller/AddProducts'
import ProductList from './Pages/seller/ProductList'
import Orders from './Pages/seller/orders'
import Loading from './compoenets/loading'

const App = () => {
  const isSellerPath = useLocation().pathname.includes("seller")
  // const { showUserLogin } = useAppContext()
  const { showUserLogin, isSeller } = useAppContext()
  return (
    <div className='text-default min-h-screen text-gray-700 bg-white'>

      {isSellerPath ? null : <Navbar />}
      {showUserLogin ? <Login /> : null}
      <Toaster />

      <div className={`${isSellerPath ? "" : "px-6 md:px-16 lg:px-24 xl:px-32"}`}>
        <Routes>

          <Route path="/" element={<Home />} />
          <Route path="/products" element={<AllProduct />} />
          <Route path="/products/:category" element={<ProductCategory />} />
          <Route path="/products/:category/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/add-address" element={<AddAddress />} />
          <Route path="/MyOrders" element={<MyOrders />} />
          <Route path="/loader" element={<Loading />} />

          <Route path="/Seller" element={isSeller ? <SellerLayout /> : <SellerLogin />} >
            <Route index element={isSeller ? <AddProducts /> : null} />
            <Route path="product-list" element={<ProductList />} />
            <Route path="orders" element={<Orders />} />
          </Route >
        </Routes>
      </div>
      {!isSellerPath && <Footer />}
    </div>
  )
}

export default App
