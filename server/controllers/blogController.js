import Blog from "../models/Blog.js";

export const createBlog = async (req, res) => {
    try {
        const blog = await Blog.create({
            ...req.body,
            author: req.user._id
        })

        res.status(201).json(blog)
    } catch (error) {
        res.status(500).json({message: "Failed to create blog"})
    }
}


export const editBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id)

        if(!blog)
            return res.status(401).json({message: "Not found"})

        if(!blog.author.equals(req.user._id)){
            return res.status(403).json({message: "Not allowed"})
        }

        Object.assign(blog, req.body)
        await blog.save()

        res.json(blog)
    } catch (error) {
        res.status(500).json({message: "Failed to update blog"})
    }
}


export const deleteBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id)

        if(!blog)
            return res.status(404).json({message: "Not found"})

        if(!blog.author.equals(req.user._id))
            return res.status(403).json({message: "Not allowed"})

        await blog.deleteOne()

        res.json({message: "Deleted successfully"})
    } catch (error) {
        res.status(500).json({message: "Failed to delete Blog"})
    }
}


export const getBySlug = async (req, res) => {
    try {
        const blog = await Blog.findOne({slug}).populate("author", "name")

        if(!blog)
            return res.status(404).json({json: "Not found"})

        if(blog.status == "draft" && (!req.user || !blog.author._id.equals(req.user._id)))
            return res.status(403).json({message:"Private draft"})

        blog.views++;
        await blog.save()

        return res.json(blog)
    } catch (error) {
        res.status(500).json({message: "Failed to fetch blog"})
    }
} 


export const getBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find({status: "published"})
        .sort({createdAt: -1})
        .populate("author", "name")

        res.json(blogs)
    } catch (error) {
        res.status(500).json({message: "Failed to fetch blogs"})
    }
}

