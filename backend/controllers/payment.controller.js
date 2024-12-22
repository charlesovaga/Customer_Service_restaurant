// import Coupon from "../models/coupon.model.js";
// import Order from "../models/order.model.js";
// import { stripe } from "../lib/stripe.js";

// export const createCheckoutSession = async (req, res) => {
//   try {
//     const { products, couponCode } = req.body;

//     if (!Array.isArray(products) || products.length === 0) {
//       return res.status(400).json({ error: "Invalid or empty products array" });
//     }

//     let totalAmount = 0;

//     const lineItems = products.map((product) => {
//       const amount = Math.round(product.price * 100); // stripe wants u to send in the format of cents
//       totalAmount += amount * product.quantity;

//       return {
//         price_data: {
//           currency: "usd",
//           product_data: {
//             name: product.name,
//             images: [product.image],
//           },
//           unit_amount: amount,
//         },
//         quantity: product.quantity || 1,
//       };
//     });

//     let coupon = null;
//     if (couponCode) {
//       coupon = await Coupon.findOne({
//         code: couponCode,
//         userId: req.user._id,
//         isActive: true,
//       });
//       if (coupon) {
//         totalAmount -= Math.round(
//           (totalAmount * coupon.discountPercentage) / 100
//         );
//       }
//     }

//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ["card"],
//       line_items: lineItems,
//       mode: "payment",
//       success_url: `${process.env.CLIENT_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
//       cancel_url: `${process.env.CLIENT_URL}/purchase-cancel`,
//       discounts: coupon
//         ? [
//             {
//               coupon: await createStripeCoupon(coupon.discountPercentage),
//             },
//           ]
//         : [],
//       metadata: {
//         userId: req.user._id.toString(),
//         couponCode: couponCode || "",
//         products: JSON.stringify(
//           products.map((p) => ({
//             id: p._id,
//             quantity: p.quantity,
//             price: p.price,
//           }))
//         ),
//       },
//     });

//     if (totalAmount >= 20000) {
//       await createNewCoupon(req.user._id);
//     }
//     res.status(200).json({ id: session.id, totalAmount: totalAmount / 100 });
//   } catch (error) {
//     console.error("Error processing checkout:", error);
//     res
//       .status(500)
//       .json({ message: "Error processing checkout", error: error.message });
//   }
// };

// export const checkoutSuccess = async (req, res) => {
//   try {
//     const { sessionId } = req.body;
//     const session = await stripe.checkout.sessions.retrieve(sessionId);

//     if (session.payment_status === "paid") {
//       if (session.metadata.couponCode) {
//         await Coupon.findOneAndUpdate(
//           {
//             code: session.metadata.couponCode,
//             userId: session.metadata.userId,
//           },
//           {
//             isActive: false,
//           }
//         );
//       }

//       // create a new Order
//       const products = JSON.parse(session.metadata.products);
//       const newOrder = new Order({
//         user: session.metadata.userId,
//         products: products.map((product) => ({
//           product: product.id,
//           quantity: product.quantity,
//           price: product.price,
//         })),
//         totalAmount: session.amount_total / 100, // convert from cents to dollars,
//         stripeSessionId: sessionId,
//       });

//       await newOrder.save();

//       res.status(200).json({
//         success: true,
//         message:
//           "Payment successful, order created, and coupon deactivated if used.",
//         orderId: newOrder._id,
//       });
//     }
//   } catch (error) {
//     console.error("Error processing successful checkout:", error);
//     res.status(500).json({
//       message: "Error processing successful checkout",
//       error: error.message,
//     });
//   }
// };

// async function createStripeCoupon(discountPercentage) {
//   const coupon = await stripe.coupons.create({
//     percent_off: discountPercentage,
//     duration: "once",
//   });

//   return coupon.id;
// }

// async function createNewCoupon(userId) {
//   await Coupon.findOneAndDelete({ userId });

//   const newCoupon = new Coupon({
//     code: "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase(),
//     discountPercentage: 10,
//     expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
//     userId: userId,
//   });

//   await newCoupon.save();

//   return newCoupon;
// }

import Coupon from "../models/coupon.model.js";
import Order from "../models/order.model.js";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY; // Paystack Secret Key
const CLIENT_URL = process.env.CLIENT_URL;

// Initialize Paystack payment session
export const createCheckoutSession = async (req, res) => {
  try {
    const { products, couponCode } = req.body;

    // Validate products array
    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: "Invalid or empty products array" });
    }

    let totalAmount = 0;

    // Calculate total amount based on products
    products.forEach((product) => {
      totalAmount += product.price * product.quantity;
    });

    // Apply coupon discount if available
    let coupon = null;
    if (couponCode) {
      coupon = await Coupon.findOne({
        code: couponCode,
        userId: req.user._id,
        isActive: true,
      });

      if (coupon) {
        totalAmount -= (totalAmount * coupon.discountPercentage) / 100;
      }
    }

    // Convert total amount to kobo (Paystack format)
    const totalAmountInKobo = Math.round(totalAmount * 100);

    // Generate a unique transaction reference
    const reference = uuidv4();

    // Prepare metadata to store user and product information
    const metadata = {
      userId: req.user._id.toString(),
      couponCode: couponCode || "",
      products: products.map((p) => ({
        id: p._id,
        quantity: p.quantity,
        price: p.price,
      })),
    };

    // Initialize transaction with Paystack
    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email: req.user.email,
        amount: totalAmountInKobo,
        reference,
        callback_url: `${CLIENT_URL}/purchase-success?reference=${reference}`,
        metadata,
      },
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (totalAmount >= 5000) {
      await createNewCoupon(req.user._id);
    }

    // Respond with Paystack checkout URL
    res.status(200).json({
      authorization_url: response.data.data.authorization_url,
      reference,
      totalAmount,
    });
  } catch (error) {
    console.error("Error initializing Paystack checkout:", error);
    res.status(500).json({
      message: "Error processing checkout",
      error: error.response?.data || error.message,
    });
  }
};

// Verify payment success and create order
export const checkoutSuccess = async (req, res) => {
  try {
    const { reference } = req.query;
    // console.log("request query:", req.query);

    if (!reference) {
      console.error("Missing reference in request query:", req.query);
      return res.status(400).json({ error: "Payment reference is required" });
    }

    // Verify the transaction with Paystack
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const paymentData = response.data?.data;

    if (paymentData.status === "success") {
      const metadata = paymentData.metadata;

      // Deactivate the coupon if used
      if (metadata.couponCode) {
        await Coupon.findOneAndUpdate(
          { code: metadata.couponCode, userId: metadata.userId },
          { isActive: false }
        );
      }

      // Create a new order in the database
      const newOrder = new Order({
        user: metadata.userId,
        products: metadata.products.map((product) => ({
          product: product.id,
          quantity: product.quantity,
          price: product.price,
        })),
        totalAmount: paymentData.amount / 100, // Convert back to Naira
        reference,
      });

      await newOrder.save();

      res.status(200).json({
        success: true,
        message: "Payment successful, order created.",
        orderId: newOrder._id,
      });
    } else {
      res
        .status(400)
        .json({ success: false, error: "Payment verification failed" });
    }
  } catch (error) {
    console.error("Error verifying Paystack payment:", error);
    res.status(500).json({
      message: "Error verifying payment",
      error: error.response?.data || error.message,
    });
  }
};

// Utility function to create a new coupon for a user
async function createNewCoupon(userId) {
  // Delete any existing coupon for the user
  await Coupon.findOneAndDelete({ userId });

  // Generate a new coupon
  const newCoupon = new Coupon({
    code: "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase(),
    discountPercentage: 10,
    expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Expires in 30 days
    userId: userId,
  });

  await newCoupon.save();

  return newCoupon;
}
