import mongoose, { Schema, Model, HydratedDocument } from "mongoose";

export interface EventAttrs {
  title: string;
  slug?: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  mode: string;
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
}

export type EventDocument = HydratedDocument<EventAttrs>;

const nonEmptyString = (value: string): boolean =>
  typeof value === "string" && value.trim().length > 0;

const nonEmptyStringArray = (value: string[]): boolean =>
  Array.isArray(value) &&
  value.length > 0 &&
  value.every((item) => typeof item === "string" && item.trim().length > 0);

const slugify = (value: string): string =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const normalizeDate = (value: string): string => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    throw new Error("Invalid date format.");
  }
  // Store as ISO 8601 date (YYYY-MM-DD).
  return parsed.toISOString().split("T")[0];
};

const normalizeTime = (value: string): string => {
  const trimmed = value.trim();
  const match24 = trimmed.match(/^([01]\d|2[0-3]):([0-5]\d)$/);
  const match12 = trimmed.match(/^([1-9]|1[0-2]):([0-5]\d)\s*([AP]M)$/i);

  let hours: number;
  let minutes: number;

  if (match24) {
    hours = Number(match24[1]);
    minutes = Number(match24[2]);
  } else if (match12) {
    hours = Number(match12[1]) % 12;
    minutes = Number(match12[2]);
    if (match12[3].toUpperCase() === "PM") {
      hours += 12;
    }
  } else {
    throw new Error("Invalid time format.");
  }

  // Store as 24-hour HH:mm.
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
};

const eventSchema = new Schema<EventAttrs>(
  {
    title: { type: String, required: true, trim: true, validate: nonEmptyString },
    slug: { type: String, trim: true },
    description: {
      type: String,
      required: true,
      trim: true,
      validate: nonEmptyString,
    },
    overview: {
      type: String,
      required: true,
      trim: true,
      validate: nonEmptyString,
    },
    image: { type: String, required: true, trim: true, validate: nonEmptyString },
    venue: { type: String, required: true, trim: true, validate: nonEmptyString },
    location: {
      type: String,
      required: true,
      trim: true,
      validate: nonEmptyString,
    },
    date: { type: String, required: true, trim: true, validate: nonEmptyString },
    time: { type: String, required: true, trim: true, validate: nonEmptyString },
    mode: { type: String, required: true, trim: true, validate: nonEmptyString },
    audience: {
      type: String,
      required: true,
      trim: true,
      validate: nonEmptyString,
    },
    agenda: {
      type: [String],
      required: true,
      validate: nonEmptyStringArray,
    },
    organizer: {
      type: String,
      required: true,
      trim: true,
      validate: nonEmptyString,
    },
    tags: {
      type: [String],
      required: true,
      validate: nonEmptyStringArray,
    },
  },
  { timestamps: true }
);

eventSchema.index({ slug: 1 }, { unique: true });

eventSchema.pre("save", function (this: EventDocument) {
  // Generate a URL-friendly slug only when the title changes.
  if (this.isModified("title") || !this.slug) {
    this.slug = slugify(this.title);
  }

  // Normalize date/time before persisting.
  this.date = normalizeDate(this.date);
  this.time = normalizeTime(this.time);
});

export const Event: Model<EventAttrs> =
  (mongoose.models.Event as Model<EventAttrs>) ??
  mongoose.model<EventAttrs>("Event", eventSchema);
