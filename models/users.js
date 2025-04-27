import mongoose from "mongoose"

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  picture: {
    type: String,
    required: false,
    default: "noProfilePicture",
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("user", UserSchema);