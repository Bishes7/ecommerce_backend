// controllers/paymentController.js
import axios from "axios";
import asyncHandler from "../middleware/asyncHandler.js";

import crypto from "crypto";
import Order from "../model/orderSchema.js";

const INITIATE_URL = "https://a.khalti.com/api/v2/epayment/initiate/";
const LOOKUP_URL = "https://a.khalti.com/api/v2/epayment/lookup/";

export const createKhaltiPayment = asyncHandler(async (req, res) => {
  const { amount, purchaseOrderId, purchaseOrderName } = req.body;
  const secretKey = process.env.KHALTI_SECRET_KEY;
  if (!secretKey)
    return res.status(500).json({ message: "Server configuration error" });

  const payload = {
    return_url: `${process.env.FRONTEND_URL}/payment-success`,
    website_url: process.env.FRONTEND_URL,
    amount: amount * 100,
    purchase_order_id: purchaseOrderId,
    purchase_order_name: purchaseOrderName,
  };

  const { data } = await axios.post(INITIATE_URL, payload, {
    headers: {
      Authorization: `Key ${secretKey}`,
      "Content-Type": "application/json",
    },
  });
  res.status(200).json(data);
});

export const verifyKhaltiPayment = asyncHandler(async (req, res) => {
  const { pidx } = req.body;
  const secretKey = process.env.KHALTI_SECRET_KEY;
  if (!secretKey)
    return res.status(500).json({ message: "Server configuration error" });

  const { data } = await axios.post(
    LOOKUP_URL,
    { pidx },
    {
      headers: {
        Authorization: `Key ${secretKey}`,
        "Content-Type": "application/json",
      },
    }
  );
  res.status(200).json(data);
});

// ESewa Controller

const RC_FORM_URL = "https://rc-epay.esewa.com.np/api/epay/main/v2/form"; // form post
const RC_STATUS_URL = "https://rc.esewa.com.np/api/epay/transaction/status/"; // status check

export const initiateEsewa = asyncHandler(async (req, res) => {
  const { amount, orderId } = req.body;

  // eSewa expects RUPEES, not paisa
  const total_amount = Number(amount);
  const transaction_uuid = `${orderId}-${Date.now()}`;
  const product_code = process.env.ESEWA_PRODUCT_CODE || "EPAYTEST";

  // Signed string and HMAC
  const signed_field_names = "total_amount,transaction_uuid,product_code";
  const message = `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${product_code}`;

  const signature = crypto
    .createHmac("sha256", process.env.ESEWA_SECRET || "8gBm/:&EnhH.1/q(")
    .update(message)
    .digest("base64");

  res.json({
    amount: total_amount,
    tax_amount: 0,
    total_amount,
    transaction_uuid,
    product_code,
    product_service_charge: 0,
    product_delivery_charge: 0,
    success_url: process.env.ESEWA_SUCCESS_URL,
    failure_url: process.env.ESEWA_FAILURE_URL,
    signed_field_names,
    signature,
    payment_url: RC_FORM_URL,
  });
});

// --------------------
// CHECK PAYMENT STATUS
// --------------------
export const checkEsewaStatus = asyncHandler(async (req, res) => {
  const { total_amount, transaction_uuid, orderId } = req.query;

  const product_code = process.env.ESEWA_PRODUCT_CODE || "EPAYTEST";
  const url = `${RC_STATUS_URL}?product_code=${product_code}&total_amount=${total_amount}&transaction_uuid=${transaction_uuid}`;

  const response = await fetch(url);
  const data = await response.json();

  if (data.status === "COMPLETE") {
    const order = await Order.findById(orderId);

    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: data.ref_id,
        status: data.status,
        total_amount,
      };
      await order.save();
    } else {
      console.log("No order found with this ID");
    }
  }

  res.json(data);
});
