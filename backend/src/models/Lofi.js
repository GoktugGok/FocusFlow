import mongoose from "mongoose";

const LofiSchema = new mongoose.Schema({
  title: { type: String, required: true },
  artist: { type: String, required: true },
  category: { type: String, required: true }, 
  audioUrl: { type: String, required: true },
  videoUrl: { type: String },
  coverImg: { type: String }
});

export default mongoose.model("Lofi", LofiSchema);