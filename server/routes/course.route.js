const express = require("express");
const { auth } = require("../middleware/auth.middleware");
const { courseModel } = require("../model/course.model");
const { access } = require("../middleware/access.middleware");
const courseRouter = express.Router();


courseRouter.get("/",auth,async(req,res)=>{
    try {
        const courses = await courseModel.find();
        res.status(201).json({status:"success", courses });
    } catch (error) {
        res.status(500).json({status:"error", message: "Error Getting courses", error });
    }
})

courseRouter.post("/", auth, access("instructor"), async (req, res) => {
    const { title, description, materials } = req.body;

    try {
        const courseDetails = new courseModel({
            title, description, instructor: req.user._id, materials
        });
        const savedCourse = await courseDetails.save();
        res.status(201).json({status:"success", message: "Course created successfully", course: savedCourse });
    } catch (error) {
        res.status(500).json({ status:"error", message: "Error creating course", error });
    }
});

courseRouter.delete("/:id", auth, access("instructor"), async (req, res) => {
    try {
        const course = await courseModel.findByIdAndDelete(req.params.id);
        res.status(200).json({ status: "success", message: "Course deleted successfully" });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Error deleting course", error });
    }
});

courseRouter.put("/:id", auth, access("instructor"), async (req, res) => {
    const courseId = req.params.id;
    const { title, description, materials } = req.body;

    try {
        const updatedCourse = await courseModel.findByIdAndUpdate(courseId, {
            title, description, materials
        }, { new: true });
        
        res.status(200).json({ status: "success", message: "Course updated successfully", course: updatedCourse });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Error updating course", error });
    }
});

module.exports = {
    courseRouter
};
