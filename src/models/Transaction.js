// src/models/Transaction.js
const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
    },
    sessionId: { type: String, index: true },
    paymentReference: { type: String, index: true },
    nameEnquiryReference: String,

    client: { type: String },
    account: { type: String }, 
    virtualAccount: { type: String },

    creditAccountName: String,
    creditAccountNumber: String,
    debitAccountName: String,
    debitAccountNumber: String,

    amount: { type: Number, required: true },
    fees: { type: Number, default: 0 },
    vat: { type: Number, default: 0 },
    stampDuty: { type: Number, default: 0 },

    provider: String,
    providerChannel: String,
    providerChannelCode: String,
    destinationInstitutionCode: String,

    status: { type: String,default: "Pending" },
    responseCode: String,
    responseMessage: String,

    isReversed: { type: Boolean, default: false },
    reversalReference: String,

    narration: String,
    transactionLocation: String,

    approvedAt: Date,
    declinedAt: Date,

    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", TransactionSchema);
