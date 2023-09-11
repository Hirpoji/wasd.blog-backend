import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import cors from "cors";
import {
  registerValidator,
  loginValidator,
  postValidator,
} from "./validations.js";
import checkAuth from "./utils/checkAuth.js";
import { login, register, getMe } from "./controllers/UserController.js";
import {
  create,
  createComment,
  getAll,
  getOne,
  getPostsByTag,
  getTags,
  getUserPosts,
  remove,
  update,
} from "./controllers/PostContoller.js";

import handleValidationsError from "./utils/handleValidationsError.js";

import dotenv from "dotenv";
dotenv.config();

const app = express();

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, "uploads");
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("DB OK"))
  .catch((err) => console.log(err));

const port = process.env.PORT || 5554;

app.use(express.json());

app.use(cors());

app.use("/uploads", express.static("uploads"));

app.post("/posts/:postId/comments", checkAuth, createComment);

app.get("/posts/tags", getTags);

app.post("/auth/login", loginValidator, handleValidationsError, login);

app.post("/auth/register", registerValidator, handleValidationsError, register);

app.get("/auth/me", checkAuth, getMe);

app.post("/posts", postValidator, handleValidationsError, checkAuth, create);

app.get("/posts", getAll);

app.get("/posts/:id", getOne);

app.delete("/posts/:id", checkAuth, remove);

app.get("/posts/tag/:tag", getPostsByTag);

app.patch(
  "/posts/:id",
  checkAuth,
  postValidator,
  handleValidationsError,
  update
);

app.post("/:userId/posts", checkAuth, getUserPosts);

app.post("/upload", upload.single("image"), (req, res) => {
  res.json({
    url: `uploads/${req.file.originalname}`,
  });
});

app.listen(port, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log("Server start on port " + port);
});
