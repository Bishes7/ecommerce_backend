import axios from "axios";
import asyncHandler from "../middleware/asyncHandler.js";

// @desc Create Khalti Payment
// @route POST /api/payments/khalti
// @access Private
export const createKhaltiPayment = asyncHandler(async (req, res) => {
  const { amount, purchaseOrderId, purchaseOrderName } = req.body;

  const payload = {
    return_url: "http://localhost:5173/payment-success", // frontend URL
    website_url: "http://localhost:5173",
    amount: amount * 100, // convert to paisa
    purchase_order_id: purchaseOrderId,
    purchase_order_name: purchaseOrderName,
  };

  const config = {
    headers: {
      Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
  };

  try {
    const { data } = await axios.post(
      "https://a.khalti.com/api/v2/epayment/initiate/",
      payload,
      config
    );
    res.status(200).json(data);
  } catch (error) {
    res.status(400);
    throw new Error(error.response?.data?.detail || "Khalti payment failed");
  }
});

// @desc Verify Khalti Payment
// @route POST /api/payments/khalti/verify
// @access Private
export const verifyKhaltiPayment = asyncHandler(async (req, res) => {
  const { pidx } = req.body;

  const config = {
    headers: {
      Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
    },
  };

  try {
    const { data } = await axios.post(
      "https://a.khalti.com/api/v2/epayment/lookup/",
      { pidx },
      config
    );
    res.status(200).json(data);
  } catch (error) {
    res.status(400);
    throw new Error(
      error.response?.data?.detail || "Khalti verification failed"
    );
  }
});
