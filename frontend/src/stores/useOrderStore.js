import { create } from "zustand";
import axios from "../lib/axios";

export const useOrderStore = create((set, get) => ({
  orders: [],
  orderDetails: null,
  myOrders: [],
  isLoading: false,
  error: null,

  // Create an order
  createOrder: async (order) => {
    try {
      set({ isLoading: true, error: null });
      const { data } = await axios.post("/orders/create-order", order);
      set({ orders: [...get().orders, data], isLoading: false });
      return data;
    } catch (err) {
      set({
        error: err.response?.data?.message || err.message,
        isLoading: false,
      });
    }
  },

  // Get order details
  getOrderById: async (orderId) => {
    try {
      set({ isLoading: true, error: null });
      const { data } = await axios.get(`/orders/getOrderById/`, orderId);
      set({ orderDetails: data, isLoading: false });
    } catch (err) {
      set({
        error: err.response?.data?.message || err.message,
        isLoading: false,
      });
    }
  },

  // Pay for an order
  updateOrderToPaid: async (orderId, details) => {
    try {
      set({ isLoading: true, error: null });
      const { data } = await axios.put(`orders/updateOrderToPaid/`, {
        orderId,
        details,
      });
      const updatedOrders = get().orders.map((order) =>
        order._id === orderId ? data : order
      );
      set({ orders: updatedOrders, isLoading: false });
      return data;
    } catch (err) {
      set({
        error: err.response?.data?.message || err.message,
        isLoading: false,
      });
    }
  },

  //   // Get PayPal client ID
  //   getPaypalClientId: async () => {
  //     try {
  //       set({ isLoading: true, error: null });
  //       const { data } = await axios.get(PAYPAL_URL);
  //       set({ paypalClientId: data, isLoading: false });
  //     } catch (err) {
  //       set({ error: err.response?.data?.message || err.message, isLoading: false });
  //     }
  //   },

  // Get orders for the logged-in user
  getMyOrders: async () => {
    try {
      set({ isLoading: true, error: null });
      const { data } = await axios.get("/orders/getMyOrders");
      set({ myOrders: data, isLoading: false });
    } catch (err) {
      set({
        error: err.response?.data?.message || err.message,
        isLoading: false,
      });
    }
  },

  // Get all orders
  getOrders: async () => {
    try {
      set({ isLoading: true, error: null });
      const { data } = await axios.get("/orders/admin-orders");
      set({ orders: data, isLoading: false });
    } catch (err) {
      set({
        error: err.response?.data?.message || err.message,
        isLoading: false,
      });
    }
  },

  // Mark an order as delivered
  updateOrderToDelivered: async (orderId) => {
    try {
      set({ isLoading: true, error: null });
      const { data } = await axios.put(
        "/orders/updateOrderToDelivered",
        orderId
      );
      const updatedOrders = get().orders.map((order) =>
        order._id === orderId ? data : order
      );
      set({ orders: updatedOrders, isLoading: false });
      return data;
    } catch (err) {
      set({
        error: err.response?.data?.message || err.message,
        isLoading: false,
      });
    }
  },
}));

// import { create } from "zustand";
// import axios from "../lib/axios";

// export const useOrderStore = create((set, get) => ({
//   orders: [],
//   orderDetails: null,
//   isLoading: false,
//   error: null,
//   currentPage: 1,
//   totalPages: 0,

//   // Fetch orders (with pagination)
//   fetchOrders: async (page = 1) => {
//     try {
//       set({ isLoading: true, error: null });
//       const { data } = await axios.get(`/orders?pageNumber=${page}`);
//       set({
//         orders: data.orders,
//         currentPage: data.page,
//         totalPages: data.pages,
//         isLoading: false,
//       });
//     } catch (err) {
//       set({
//         error: err.response?.data?.message || err.message,
//         isLoading: false,
//       });
//     }
//   },

//   // Fetch order details by ID
//   fetchOrderDetails: async (orderId) => {
//     try {
//       set({ isLoading: true, error: null });
//       const { data } = await axios.get(`/orders/${orderId}`);
//       set({ orderDetails: data, isLoading: false });
//     } catch (err) {
//       set({
//         error: err.response?.data?.message || err.message,
//         isLoading: false,
//       });
//     }
//   },

//   // Update an order to "Paid"
//   markOrderAsPaid: async (orderId, paymentDetails) => {
//     try {
//       set({ isLoading: true, error: null });
//       const { data } = await axios.put(`/orders/${orderId}/pay`, paymentDetails);
//       const updatedOrders = get().orders.map((order) =>
//         order._id === orderId ? data : order
//       );
//       set({ orders: updatedOrders, isLoading: false });
//     } catch (err) {
//       set({
//         error: err.response?.data?.message || err.message,
//         isLoading: false,
//       });
//     }
//   },

//   // Update an order to "Delivered"
//   markOrderAsDelivered: async (orderId) => {
//     try {
//       set({ isLoading: true, error: null });
//       const { data } = await axios.put(`/orders/${orderId}/deliver`);
//       const updatedOrders = get().orders.map((order) =>
//         order._id === orderId ? data : order
//       );
//       set({ orders: updatedOrders, isLoading: false });
//     } catch (err) {
//       set({
//         error: err.response?.data?.message || err.message,
//         isLoading: false,
//       });
//     }
//   },
// }));

// import { create } from "zustand";
// import axios from "../lib/axios";

// export const useOrderStore = create((set) => ({
//   orders: [],
//   orderDetails: null,
//   isLoading: false,
//   error: null,

//   createOrder: async (orderData) => {
//     try {
//       set({ isLoading: true, error: null });
//       const { data } = await axios.post("/orders", orderData);
//       set((state) => ({ orders: [...state.orders, data], isLoading: false }));
//     } catch (err) {
//       set({
//         error: err.response?.data?.message || err.message,
//         isLoading: false,
//       });
//     }
//   },

//   fetchOrders: async () => {
//     try {
//       set({ isLoading: true, error: null });
//       const { data } = await axios.get("/orders");
//       set({ orders: data, isLoading: false });
//     } catch (err) {
//       set({
//         error: err.response?.data?.message || err.message,
//         isLoading: false,
//       });
//     }
//   },

//   fetchOrderDetails: async (id) => {
//     try {
//       set({ isLoading: true, error: null });
//       const { data } = await axios.get(`/orders/${id}`);
//       set({ orderDetails: data, isLoading: false });
//     } catch (err) {
//       set({
//         error: err.response?.data?.message || err.message,
//         isLoading: false,
//       });
//     }
//   },
// }));
