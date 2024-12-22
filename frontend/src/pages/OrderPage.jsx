// // import { useParams } from "react-router-dom";
// // import { FaTimes } from "react-icons/fa";
// // import Message from "../../components/Message";
// // import Loader from "../../components/Loader";
// // import Paginate from "../../components/Paginate";

// import { useOrderStore } from "../stores/useOrderStore";

// const OrderPage = () => {
// //   const { pageNumber } = useParams();
// const { order, getOrders, isLoading, error } = useOrderStore();

// //   //   const { data, isLoading, error } = useGetOrdersQuery({
// //   //     pageNumber,
// //   //   });

//   return (
//     <div className="container mx-auto px-4 py-6">
//       <h1 className="text-2xl font-bold mb-6 text-gray-800">Orders</h1>
//       {isLoading ? (
//         <LoadingSpinner />
//       ) : error ? (
//         <Message variant="danger">
//           {error?.data?.message || error.error}
//         </Message>
//       ) : (
//         <>
//           <div className="overflow-x-auto">
//             <table className="w-full table-auto border-collapse border border-gray-300 text-sm">
//               <thead>
//                 <tr className="bg-gray-200">
//                   <th className="border border-gray-300 px-4 py-2">ID</th>
//                   <th className="border border-gray-300 px-4 py-2">USER</th>
//                   <th className="border border-gray-300 px-4 py-2">DATE</th>
//                   <th className="border border-gray-300 px-4 py-2">TOTAL</th>
//                   <th className="border border-gray-300 px-4 py-2">PAID</th>
//                   <th className="border border-gray-300 px-4 py-2">
//                     DELIVERED
//                   </th>
//                   <th className="border border-gray-300 px-4 py-2"></th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {data.orders.map((order) => (
//                   <tr key={order._id} className="odd:bg-white even:bg-gray-100">
//                     <td className="border border-gray-300 px-4 py-2">
//                       {order._id}
//                     </td>
//                     <td className="border border-gray-300 px-4 py-2">
//                       {order.user && order.user.name}
//                     </td>
//                     <td className="border border-gray-300 px-4 py-2">
//                       {order.createdAt.substring(0, 10)}
//                     </td>
//                     <td className="border border-gray-300 px-4 py-2">
//                       ₦{order.totalPrice}
//                     </td>
//                     <td className="border border-gray-300 px-4 py-2">
//                       {order.isPaid ? (
//                         order.paidAt.substring(0, 10)
//                       ) : (
//                         <FaTimes className="text-red-500" />
//                       )}
//                     </td>
//                     <td className="border border-gray-300 px-4 py-2">
//                       {order.isDelivered ? (
//                         order.deliveredAt.substring(0, 10)
//                       ) : (
//                         <FaTimes className="text-red-500" />
//                       )}
//                     </td>
//                     <td className="border border-gray-300 px-4 py-2">
//                       <a
//                         href={`/order/${order._id}`}
//                         className="inline-block px-3 py-1 text-sm text-white bg-blue-500 rounded hover:bg-blue-600"
//                       >
//                         Details
//                       </a>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//           {/* <Paginate pages={data.pages} page={data.page} isAdmin={true} /> */}
//         </>
//       )}
//     </div>
//   );
// };

// export default OrderPage;

// // import { useOrderStore } from "../stores/useOrderStore";
// // import { useEffect } from "react";
// // import LoadingSpinner from "../components/LoadingSpinner";
// // import Message from "../components/Message";

// // const OrderPage = () => {
// //   const { orders, getOrders, isLoading, error } = useOrderStore();

// //   useEffect(() => {
// //     getOrders();
// //   }, [getOrders]);

// //   return (
// //     <div>
// //       <h1>Orders</h1>
// //       {isLoading ? (
// //         <LoadingSpinner />
// //       ) : error ? (
// //         <Message variant="danger">{error}</Message>
// //       ) : (
// //         <table>
// //           <thead>
// //             <tr>
// //               <th>ID</th>
// //               <th>User</th>
// //               <th>Total</th>
// //               <th>Paid</th>
// //               <th>Delivered</th>
// //             </tr>
// //           </thead>
// //           <tbody>
// //             {orders.map((order) => (
// //               <tr key={order._id}>
// //                 <td>{order._id}</td>
// //                 <td>{order.user.name}</td>
// //                 <td>₦{order.totalPrice}</td>
// //                 <td>{order.isPaid ? "Yes" : "No"}</td>
// //                 <td>{order.isDelivered ? "Yes" : "No"}</td>
// //               </tr>
// //             ))}
// //           </tbody>
// //         </table>
// //       )}
// //     </div>
// //   );
// // };

// // export default OrderPage;

import React from "react";

function OrderPage() {
  return <div>OrderPage</div>;
}

export default OrderPage;
