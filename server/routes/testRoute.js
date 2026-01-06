import express from "express";
import auth from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/me", auth, (req, res) => {
  res.status(200).json({
    message: "Protected route accessed",
    user: req.user
  });
});

export default router;
