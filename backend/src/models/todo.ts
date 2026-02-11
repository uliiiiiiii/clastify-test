import mongoose, { Document } from "mongoose";

export interface ITodo extends Document {
  title: string;
  completed: boolean;
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
  },
  { timestamps: true }
);

export default mongoose.model<ITodo>("Todo", todoSchema);