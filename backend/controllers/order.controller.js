import Order from "../models/order.model.js";
import mongoose from "mongoose";

export const createOrder = async (req, res) => {
  const {
    orderItems,
    // shippingAddress,
    // paymentMethod,
    itemsPrice,
    // shippingPrice,
    totalPrice,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error("No order items");
  } else {
    const order = new Order({
      orderItems: orderItems.map((x) => ({
        ...x,
        product: x._id,
        _id: undefined,
      })),
      user: req.user._id,
      //   shippingAddress,
      //   paymentMethod,
      itemsPrice,
      //   shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();

    res.status(201).json(createdOrder);
  }
};

// @desc   Get  logged in user orders

export const getMyOrders = async (req, res) => {
  const pageSize = Number(req.query.pageSize) || 10; // Default page size
  const page = Number(req.query.pageNumber) || 1; // Default page number

  try {
    const orders = await Order.find({ user: req.user._id })
      .limit(pageSize)
      .skip(pageSize * (page - 1));
    res.status(200).json(orders);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch orders", error: error.message });
  }
};

// @desc   Get order by ID

export const getOrderById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid Order ID" });
  }

  try {
    const order = await Order.findById(id).populate("user", "name email");

    if (order) {
      res.status(200).json(order);
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc   Update order to paid

export const updateOrderToPaid = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order) {
    // // check the correct amount was paid
    // const paidCorrectAmount = order.totalPrice.toString() === value;
    // if (!paidCorrectAmount) throw new Error("Incorrect amount paid");

    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address,
    };

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
};

// @desc   Update to delivered
//
export const updateOrderToDelivered = async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();

    res.status(200).json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
};

// @desc   Get all orders

export const getOrders = async (req, res) => {
  const pageSize = 3;
  const page = Number(req.query.pageNumber) || 1;
  const count = await Order.countDocuments();

  const orders = await Order.find({}).populate("user", "id name");
  res.status(200).json({ orders, page, pages: Math.ceil(count / pageSize) });
};

// import Order from "../models/order.model.js";

// // @desc Create new order
// export const createOrder = async (req, res) => {
//   const { orderItems, itemsPrice, totalPrice } = req.body;

//   if (!orderItems || orderItems.length === 0) {
//     res.status(400);
//     throw new Error("No order items");
//   }

//   const order = new Order({
//     user: req.user._id,
//     orderItems,
//     itemsPrice,
//     totalPrice,
//   });

//   const createdOrder = await order.save();
//   res.status(201).json(createdOrder);
// };

// // @desc Get logged-in user orders
// export const getMyOrders = async (req, res) => {
//   const orders = await Order.find({ user: req.user._id });
//   res.status(200).json(orders);
// };

// // @desc Get order by ID
// export const getOrderById = async (req, res) => {
//   const order = await Order.findById(req.params.id).populate(
//     "user",
//     "name email"
//   );
//   if (order) res.json(order);
//   else {
//     res.status(404);
//     throw new Error("Order not found");
//   }
// };

// // @desc Update order to paid
// export const updateOrderToPaid = async (req, res) => {
//   const order = await Order.findById(req.params.id);
//   if (order) {
//     order.isPaid = true;
//     order.paidAt = Date.now();
//     order.paymentResult = {
//       id: req.body.id,
//       status: req.body.status,
//       update_time: req.body.update_time,
//       email_address: req.body.payer.email_address,
//     };
//     const updatedOrder = await order.save();
//     res.json(updatedOrder);
//   } else {
//     res.status(404);
//     throw new Error("Order not found");
//   }
// };

// // @desc Update order to delivered
// export const updateOrderToDelivered = async (req, res) => {
//   const order = await Order.findById(req.params.id);
//   if (order) {
//     order.isDelivered = true;
//     order.deliveredAt = Date.now();
//     const updatedOrder = await order.save();
//     res.json(updatedOrder);
//   } else {
//     res.status(404);
//     throw new Error("Order not found");
//   }
// };

// // @desc Get all orders (Admin only)
// export const getOrders = async (req, res) => {
//   const orders = await Order.find({}).populate("user", "id name");
//   res.json(orders);
// };
