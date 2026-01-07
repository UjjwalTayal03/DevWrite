import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import connectDB from "./config/db.js"
import authRoutes from "./routes/authRoutes.js"
import testRoute from "./routes/testRoute.js"
import cookieParser from "cookie-parser"
import blogRoutes from "./routes/blogRoutes.js"


dotenv.config()

const app = express()

app.use(express.json())
app.use(cookieParser())

connectDB()

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use("/api/auth", authRoutes)
app.use("/api/test", testRoute)
app.use("/api/blogs", blogRoutes)



const PORT = process.env.PORT || 5000
app.listen(PORT, ()=>{
    console.log(`Server running on http://localhost:${PORT}`)
})