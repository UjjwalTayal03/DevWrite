import { createBlog, deleteBlog, editBlog,getBlogs, getBySlug } from "../controllers/blogController.js";
import express from "express"
import auth from "../middleware/authMiddleware.js"

const router = express.Router()

router.post("/", auth, createBlog)

router.put("/:id", auth, editBlog)

router.delete("/:id", auth, deleteBlog)

router.get("/:slug", auth, getBySlug)

router.get("/", getBlogs)

export default router