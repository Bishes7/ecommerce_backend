import asyncHandler from "../middleware/asyncHandler.js";
import Order from "../model/orderSchema.js";
import User from "../model/userSchema.js";
import sendEmail from "../utils/sendEmail.js";

// @desc Create new order
// @route POST /api/orders
// @access Private
export const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    taxPrice,
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
      user: req.userInfo._id,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingAddress,
      totalPrice,
      shippingPrice,
    });

    const newOrder = await order.save();
    const user = await User.findById(req.userInfo._id);

    res.status(201).json(newOrder);
  }
});

// @desc Get logged in user orders
// @route GET /api/orders/myorders
// @access Private
export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.userInfo._id });
  res.status(200).json(orders);
});

// @desc Get order by id
// @route GET /api/orders/:id
// @access Private
export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (order) {
    res.status(200).json(order);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

// @desc Update order to paid
// @route PUT /api/orders/:id/pay
// @access Private
export const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();

    // Use payment method if provided or default to existing order method
    order.paymentMethod = req.body.paymentMethod || order.paymentMethod;

    // Handle different structures (PayPal, eSewa, etc.)
    const paymentData = req.body.paymentResult || req.body;

    order.paymentResult = {
      id: paymentData.id || "",
      status: paymentData.status || "",
      update_time: paymentData.update_time || "",
      email_address: paymentData.email_address || "",
    };

    const updatedOrder = await order.save();
    const user = await User.findById(req.userInfo._id);
    await sendEmail({
      to: user.email,
      subject: "Payment Confirmation- B&B Electronics",
      text: `Your order #${order._id} has been successfully paid`,
      html: `
        <h2>Payment Successful</h2>
        <p>Hi ${user.name},</p>
        <p>Your payment for <strong>Order #${order._id}</strong> was successful.</p>
        <p>Total Paid: Rs. ${order.totalPrice}</p>
        <p>Thank you for shopping with us!</p>
      `,
    });
    res.status(200).json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

// @desc Update order to delivered
// @route PUT /api/orders/:id/deliver
// @access Private/Admin
export const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();
    const user = await User.findById(req.userInfo._id);
    await sendEmail({
      to: user.email,
      subject: "Order Delivered - B&B Electronics",
      text: `Your order #${order._id} has been delivered successfully.`,
      html: `
        <h2>Order Delivered</h2>
        <p>Hi ${user.name},</p>
        <p>Your <strong>Order #${order._id}</strong> has been delivered successfully.</p>
        <p>Total Paid: Rs. ${order.totalPrice}</p>
        <p>We hope you enjoy your purchase. Thank you for shopping with us!</p>
      `,
    });

    res.status(200).json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

// @desc get all orders
// @route GET /api/orders
// @access Private/Admin
export const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate("user", "id name");
  res.status(200).json(orders);
});

// get orders stats
export const getOrderStats = asyncHandler(async (req, res) => {
  const stats = await Order.aggregate([
    {
      $group: {
        _id: {
          $dateToString: { format: "%d-%m-%Y", date: "$createdAt" },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);
  res.status(200).json(stats);
});

// get Order Status stats/ api/orders/status-stats
export const getOrderStatusStats = asyncHandler(async (req, res) => {
  const stats = await Order.aggregate([
    {
      $group: {
        _id: {
          $cond: [{ $eq: ["$isDelivered", true] }, "Delivered", "Pending"],
        },
        count: { $sum: 1 },
      },
    },
  ]);
  res.status(200).json(stats);
});

// get total revenue per day - /api/orders/revenue-stats
export const getRevenueStats = asyncHandler(async (req, res) => {
  const stats = await Order.aggregate([
    {
      $group: {
        _id: {
          $dateToString: { format: "%d-%m-%Y", date: "$createdAt" },
        },
        totalRevenue: { $sum: "$totalPrice" },
      },
    },
    { $sort: { _id: 1 } },
  ]);
  res.status(200).json(stats);
});
