import express from "express";
const router = express.Router();
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
const client = new OAuth2Client(process.env.GoogleClientID);
import bcrypt from "bcryptjs";
import User from "../models/users.js";
import { BadRequest } from "../utils/errors.js";
import auth from "../middlewares/auth.js";
import "dotenv/config";


router.get("/", auth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-questionsCompleted");
    return res.json(user);
  } catch (err) {
    next(err);
  }
});

//login using google
router.post("/google", async (req, res, next) => {  
    
  try {
    const { token } = req.body;
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GoogleClientID,
    });
    const { email , name} = ticket.getPayload();
    
    try {
      const user = await User.findOne({ email });
      if (!user) {
        throw new BadRequest("You are not signed up");
      }
      const payload = { user: { id: user._id } };
      const token = await jwt.sign(payload, process.env.JWTSECRET, {
        expiresIn: 36000,
      });
      return res.status(200).json({ token, email, name });
    } catch (err) {
      next(err);
    }
  } catch (err) {
    next(err);
  }
});

//login
router.post("/", async (req, res, next) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      throw new BadRequest("You are not signed up");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new BadRequest("Password is wrong");
    }
    const payload = { user: { id: user._id } };
    const token = await jwt.sign(payload, process.env.JWTSECRET, {
      expiresIn: 36000,
    });
    return res.status(200).json({ token });
  } catch (err) {
    next(err);
  }
});
export default router;