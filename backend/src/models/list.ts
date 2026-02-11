import mongoose, { Document } from "mongoose";

export interface IList extends Document {
  name: string;
}

const listSchema = new mongoose.Schema<IList>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IList>("List", listSchema);

