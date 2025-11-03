import mongoose, { Document, Schema } from "mongoose";

export interface IRegistration extends Document {
  firstName: string;
  lastName: string;
  emailAddress: string;
  phoneNumber: string;
  organizationName: string;
  city: string;
  state: string;
  localGovt: string;
  zipCode?: number;
  others?: string;
  createdAt: Date;
  updatedAt: Date;
}

const RegistrationSchema: Schema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    emailAddress: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
    },
    organizationName: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    state: {
      type: String,
      required: true,
      trim: true,
    },
    localGovt: {
      type: String,
      required: true,
      trim: true,
    },
    zipCode: {
      type: Number,
      required: false,
    },
    others: {
      type: String,
      required: false,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IRegistration>(
  "Registration",
  RegistrationSchema
);
