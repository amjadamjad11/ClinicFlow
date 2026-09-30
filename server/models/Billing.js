const mongoose = require("mongoose");
// mongoose → connects our JavaScript application with MongoDB.

// billingSchema → defines the structure of a billing document.
const billingSchema = new mongoose.Schema(
  {
    consultation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Consultation",
      required: true,
      unique: true,
    },
    // consultation → connects the bill to one consultation.
    // unique → prevents multiple bills for the same consultation.

    consultationFee: {
      type: Number,
      required: true,
      min: 0,
    },
    // consultationFee → amount charged for the consultation.
    // min: 0 → prevents negative fees.

    medicineCharges: {
      type: Number,
      default: 0,
      min: 0,
    },
    // medicineCharges → total cost of medicines.
    // default: 0 → medicine charges are optional.

    otherCharges: {
      type: Number,
      default: 0,
      min: 0,
    },
    // otherCharges → additional charges such as procedures or services.

    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    // totalAmount → final bill amount calculated by the backend.

    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Cancelled"],
      default: "Pending",
    },
    // paymentStatus → tracks whether the bill has been paid.

    paymentMethod: {
      type: String,
      enum: ["Cash", "Card", "UPI", "Insurance"],
    },
    // paymentMethod → records how the payment was made.

    notes: {
      type: String,
      trim: true,
    },
    // notes → optional additional billing information.
  },
  {
    timestamps: true,
  }
);
// timestamps → automatically creates createdAt and updatedAt.

// Billing → creates the MongoDB model.
const Billing = mongoose.model("Billing", billingSchema);

module.exports = Billing;
// Exports the model so controllers can use it.