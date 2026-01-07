// import React, { useEffect, useState } from 'react'
// import { useAppContext } from '../../context/AppContext'
// import { assets, dummyOrders } from '../../assets/assets'

// const Orders = () => {

//     const { currency } = useAppContext()

//     const [orders, setOrders] = useState([])

//     const fetchOrders = async () => {
//         setOrders(dummyOrders)
//     }


//     useEffect(() => {

//         fetchOrders();
//     }, [])
//     return (
//         <div className='no-scrollbar flex-1 h-[95vh] overflow-y-scroll'>
//             <div className="md:p-10 p-4 space-y-4">
//                 <h2 className="text-lg font-medium">Orders List</h2>
//                 {orders.map((order, index) => (
//                     <div key={index} className="flex flex-col md:grid md:items-center md:flex-row gap-5 justify-between p-5 max-w-4xl rounded-md border border-gray-300">
//                         <div className="flex gap-5 max-w-80">
//                             <img className="w-12 h-12 object-cover" src={assets.box_icon} alt="boxIcon" />
//                             <div>
//                                 {order.items.map((item, index) => (
//                                     <div key={index} className="flex flex-col">
//                                         <p className="font-medium">
//                                             {item.product.name}{" "}
//                                             <span className="text-primary">x {item.quantity}</span>
//                                         </p>
//                                     </div>
//                                 ))}
//                             </div >
//                         </div>

//                         <div className="text-sm md:text-base text-black/60">
//                             <p className='text-black/80'>
//                                 {order.address.firstName} {order.address.lastName}</p>

//                             <p>{order.address.street}, {order.address.city}</p >
//                             <p>{order.address.state}, {order.address.zipcode}</p>
//                             {order.address.country}
//                             <p></p>
//                             <p>{order.address.phone}</p>

//                         </div>

//                         <p className="font-medium text-lg my-auto">{currency}{order.amount}</p>

//                         <div className="flex flex-col text-sm md:text-base text-black/60">
//                             <p>Method: {order.paymentType}</p>
//                             <p>Date: {new Date(order.createdAt).toLocaleDateString}</p>
//                             <p>Payment: {order.isPaid ? "Paid" : "Pending"}</p>
//                         </div>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     )
// }

// export default Orders


import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { assets, dummyOrders } from "../../assets/assets";

const Orders = () => {
  const { currency,axios,user } = useAppContext();
  const [orders, setOrders] = useState([]);


  const fetchOrders = async () => {

    try {
      const { data } = await axios.get("/api/order/user", { withCredentials: true });

      if (data?.success) {
        setOrders(data.orders);


      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to load address"
      );
    }
  }

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  return (
    <div className="no-scrollbar flex-1 h-[95vh] overflow-y-auto">
      <div className="md:p-10 p-4 space-y-6">
        <h2 className="text-xl font-semibold">Orders List</h2>

        {orders.map((order, index) => (
          <div
            key={index}
            className="grid grid-cols-1 md:grid-cols-4 gap-5 p-5 rounded-md border border-gray-300 bg-white"
          >
            {/* Items */}
            <div className="flex gap-4">
              <img
                className="w-12 h-12 object-contain"
                src={assets.box_icon}
                alt="box"
              />
              <div className="space-y-1">
                {order.items.map((item, i) => (
                  <p key={i} className="text-sm font-medium">
                    {item.product.name}
                    <span className="text-primary ml-1">
                      x {item.quantity}
                    </span>
                  </p>
                ))}
              </div>
            </div>

            {/* Address */}
            <div className="text-sm text-gray-600 leading-5">
              <p className="font-medium text-gray-800">
                {order.address.firstName} {order.address.lastName}
              </p>
              <p>{order.address.street}</p>
              <p>
                {order.address.city}, {order.address.state}{" "}
                {order.address.zipcode}
              </p>
              <p>{order.address.country}</p>
              <p>{order.address.phone}</p>
            </div>

            {/* Amount */}
            <div className="flex items-center font-semibold text-lg">
              {currency}
              {order.amount}
            </div>

            {/* Payment Info */}
            <div className="text-sm text-gray-600 space-y-1">
              <p>
                <span className="font-medium">Method:</span>{" "}
                {order.paymentType}
              </p>
              <p>
                <span className="font-medium">Date:</span>{" "}
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
              <p>
                <span className="font-medium">Payment:</span>{" "}
                <span
                  className={
                    order.isPaid ? "text-green-600" : "text-red-500"
                  }
                >
                  {order.isPaid ? "Paid" : "Pending"}
                </span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
