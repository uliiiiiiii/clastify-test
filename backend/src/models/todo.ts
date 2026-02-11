import mongoose, { Document } from "mongoose";

export interface ITodo extends Document {
  title: string;
  completed: boolean;
  list?: mongoose.Types.ObjectId;
}

const todoSchema = new mongoose.Schema<ITodo>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    list: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "List",
      required: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model<ITodo>("Todo", todoSchema);