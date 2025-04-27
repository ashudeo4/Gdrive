import createError from "http-errors";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;
import connectDB from "./config/database.js"
import usersRouter from "./routes/users.js"
import uploadRouter from "./routes/file.js"
import authRouter from "./routes/auth.js"
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(express.static("client/build"));
connectDB();

app.use("/api/auth", authRouter)
app.use("/api/users", usersRouter)
app.use("/api/file", uploadRouter)

if (process.env.NODE_ENV === "production") {
  // Handle any other routes by serving index.html
  app.use(/(.*)/, (req, res) => {
    console.log("set");
    console.log(path.resolve(__dirname, "client", "dist", "index.html"));
    
    res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"));
  });
}

app.use(function (req, res, next) {
    next(createError(404));
});

app.listen(port, () => {
    console.log(`✅ Server is running at http://localhost:${port}`);
  }).on('error', (err) => {
    console.error('❌ Server failed to start:', err);
  });