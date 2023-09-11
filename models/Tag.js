import mongoose from "mongoose";

const TagSchema = new mongoose.Schema({
  tag: {
    type: String,
    required: true,
  },
});

export default mongoose.model("Tag", TagSchema);
