import { mongoose } from "mongoose";

const { Schema } = mongoose;

const snippetSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Gotta have a title"],
      minLength: [3, "That's too short"],
    },
    programmingLanguage: {
      type: String,
      required: true,
      enum: ["HTML", "CSS", "JavaScript"],
    },
    code: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const models = [
  {
    name: "Snippet",
    schema: snippetSchema,
    collection: "snippets",
  },
];
