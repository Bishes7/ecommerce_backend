// controllers/paymentController.js
import axios from "axios";
import asyncHandler from "../middleware/asyncHandler.js";

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
import crypto from "crypto";
const RC_FORM_URL = "https://rc-epay.esewa.com.np/api/epay/main/v2/form"; // form post
const RC_STATUS_URL = "https://rc.esewa.com.np/api/epay/transaction/status/"; // status check

export const initiateEsewa = asyncHandler(async (req, res) => {
  const { amount, orderId } = req.body;

  const total_amount = Number(amount);
  const transaction_uuid = `${orderId}-${Date.now()}`;
  const product_code = process.env.ESEWA_PRODUCT_CODE || "EPAYTEST";

  // Correct format for signing
  const signed_field_names = "total_amount,transaction_uuid,product_code";
  const message = `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${product_code}`;

  const signature = crypto
    .createHmac("sha256", process.env.ESEWA_SECRET || "8gBm/:&EnhH.1/q(")
    .update(message)
    .digest("base64");

  const payload = {
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
  };

  res.json(payload);

  console.log("Esewa sign message:", message);
  console.log("Esewa signature:", signature);
});

export const checkEsewaStatus = asyncHandler(async (req, res) => {
  const { total_amount, transaction_uuid } = req.query;
  const product_code = process.env.ESEWA_PRODUCT_CODE || "EPAYTEST";

  const url = `${RC_STATUS_URL}?product_code=${product_code}&total_amount=${total_amount}&transaction_uuid=${transaction_uuid}`;

  const r = await fetch(url);
  const data = await r.json();
  res.json(data); // {status: "COMPLETE" | "PENDING" | ... , ref_id: "..." }
});
