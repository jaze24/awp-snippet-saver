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
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "Gotta have a username"],
      minLength: [3, "That's too short"],
    },
    password: {
      type: String,
      required: [true, "Gotta have a password"],
      minLength: [8, "That's too short"],
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
  {
    name: "User",
    schema: userSchema,
    collection: "users",
  },
];
