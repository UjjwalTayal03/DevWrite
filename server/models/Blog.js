import mongoose from "mongoose"

const blogSchema = new mongoose.Schema({
    title: {type: String, required: true},
    slug: {type: String, unique: true, lowercase: true},
    content: String,
    author: {type: mongoose.Schema.Types.ObjectId, ref : "User"},
    coverImage: String,
    status: {type: String, enum: ["draft", "published"], default: "draft"},
    tags: [String],
    likesCount : {type: Number, default: 0},
    views: {type: Number, default: 0},
},
{timestamps: true})

const Blog = new mongoose.model("Blog", blogSchema)

export default Blog