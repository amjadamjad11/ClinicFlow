const mongoose = require("mongoose");
// mongoose → connects our JavaScript objects with MongoDB documents.

// medicineSchema → defines the structure of one medicine inside a prescription.
const medicineSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    dosage: {
      type: String,
      required: true,
      trim: true,
    },

    frequency: {
      type: String,
      required: true,
      trim: true,
    },

    duration: {
      type: String,
      required: true,
      trim: true,
    },

    instructions: {
      type: String,
      trim: true,
    },
  },
  {
    _id: false,
  }
);
// _id: false → medicines don't need their own MongoDB IDs because they belong to one prescription.

// prescriptionSchema → defines the complete prescription document.
const prescriptionSchema = new mongoose.Schema(
  {
    consultation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Consultation",
      required: true,
      unique: true,
    },
    // consultation → connects this prescription to exactly one consultation.
    // unique → prevents multiple prescriptions for the same consultation.

    medicines: {
      type: [medicineSchema],
      required: true,
      validate: {
        validator: function (value) {
          return value.length > 0;
        },
        message: "At least one medicine is required",
      },
    },
    // medicines → stores one or more medicines inside the prescription.

    notes: {
      type: String,
      trim: true,
    },
    // notes → optional additional instructions for the prescription.
  },
  {
    timestamps: true,
  }
);
// timestamps → automatically creates createdAt and updatedAt.

// Prescription → creates the MongoDB model used by the controller.
const Prescription = mongoose.model("Prescription", prescriptionSchema);

module.exports = Prescription;
// Exports the model so controllers and other files can use it.