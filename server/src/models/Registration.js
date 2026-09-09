import mongoose from "mongoose";

const teamMemberSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
  },
  rollNo: {
    type: String,
    trim: true,
  },
});

const registrationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    rollNo: {
      type: String,
      required: [true, "Roll number is required"],
      trim: true,
    },
    department: {
      type: String,
      required: [true, "Department is required"],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email address is required"],
      trim: true,
      lowercase: true,
    },
    selectedEvents: {
      type: [String],
      required: [true, "At least one event must be selected"],
    },
    isTeamRegistration: {
      type: Boolean,
      default: false,
    },
    teamName: {
      type: String,
      trim: true,
      default: "",
    },
    teamMembers: [teamMemberSchema],
  },
  {
    timestamps: true,
  }
);

export const Registration = mongoose.model("Registration", registrationSchema);
