import mongoose, { Schema, Model, HydratedDocument, Types } from "mongoose";
import { Event } from "./event.model";

export interface BookingAttrs {
  eventId: Types.ObjectId;
  email: string;
}

export type BookingDocument = HydratedDocument<BookingAttrs>;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const bookingSchema = new Schema<BookingAttrs>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: (value: string) => emailRegex.test(value),
        message: "Invalid email format.",
      },
    },
  },
  { timestamps: true }
);

bookingSchema.index({ eventId: 1 });

bookingSchema.pre("save", async function (this: BookingDocument) {
  // Ensure the referenced event exists before saving the booking.
  if (this.isNew || this.isModified("eventId")) {
    const exists = await Event.exists({ _id: this.eventId });
    if (!exists) {
      throw new Error("Referenced event does not exist.");
    }
  }
});

export const Booking: Model<BookingAttrs> =
  (mongoose.models.Booking as Model<BookingAttrs>) ??
  mongoose.model<BookingAttrs>("Booking", bookingSchema);
