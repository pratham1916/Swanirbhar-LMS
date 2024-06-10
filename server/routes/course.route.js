const express = require("express");
const { auth } = require("../middleware/auth.middleware");
const { courseModel } = require("../model/course.model");
const { access } = require("../middleware/access.middleware");
const { userModel } = require("../model/user.model");
const courseRouter = express.Router();

//get All the courses(students,instructor)
courseRouter.get("/", auth, access("student", "instructor"), async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;

        const options = {
            page,
            limit,
            populate: [
                { path: 'instructor', select: 'fullname email' },
                { path: 'students', select: 'fullname email' }
            ]
        };

        const courses = await courseModel.paginate({}, options);

        res.status(200).json({
            status: "success",
            courses: courses.docs,
            totalData: courses.totalDocs,
            pages: courses.totalPages
        });

    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Error getting courses",
            error: error.message
        });
    }
});

//get only those courses which student is Enroll(student)
courseRouter.get("/myCourses", auth, access("student"), async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;

        const query = { students: { $in: [req.user._id] } };
        const options = {
            page,
            limit,
            populate: [
                { path: 'instructor', select: 'fullname' },
                { path: 'students', select: 'fullname email' },

            ]
        };

        const courses = await courseModel.paginate(query, options);

        res.status(200).json({
            status: "success",
            courses: courses.docs,
            totalData: courses.totalDocs,
            pages: courses.totalPages
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Error getting courses",
            error: error.message
        });
    }
});

// Get details of a specific course
courseRouter.get("/:id", auth, access("student", "instructor"), async (req, res) => {
    const courseId = req.params.id;
    try {
        const course = await courseModel.findById(courseId).populate('instructor').populate('students');
        if (!course) {
            return res.status(404).json({ status: "error", message: "Course not found" });
        }
        res.status(200).json({ status: "success", course });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Error getting course details", error });
    }
});

//Create the Course(instructor)
courseRouter.post("/", auth, access("instructor"), async (req, res) => {
    const { courseName, description, topics } = req.body;

    try {
        const instructorDetails = await userModel.findById(req.user._id);

        const courseDetails = new courseModel({
            courseName, description, instructor: instructorDetails, topics
        });
        const savedCourse = await courseDetails.save();
        res.status(201).json({ status: "success", message: "Course created successfully", course: savedCourse });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Error creating course", error });
    }
});

//Update the Course(instructor)
courseRouter.put("/:id", auth, access("instructor"), async (req, res) => {
    const courseId = req.params.id;
    const { courseName, description } = req.body;

    try {
        const updatedCourse = await courseModel.findByIdAndUpdate(courseId, {
            courseName, description
        }, { new: true });

        if (!updatedCourse) {
            return res.status(404).json({ status: "error", message: "Course not found" });
        }

        res.status(200).json({ status: "success", message: "Course updated successfully", course: updatedCourse });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Error updating course", error });
    }
});

//Update the Course topics(instructor)
courseRouter.put("/:courseId/topics/:topicId", auth, access("instructor"), async (req, res) => {
    const { courseId, topicId } = req.params;
    const { title, url } = req.body;

    try {
        const course = await courseModel.findById(courseId);

        if (!course) {
            return res.status(404).json({ status: "error", message: "Course not found" });
        }

        const topic = course.topics.id(topicId);
        if (!topic) {
            return res.status(404).json({ status: "error", message: "Topic not found" });
        }

        topic.title = title;
        topic.url = url;

        await course.save();

        res.status(200).json({ status: "success", message: "Topic updated successfully", course });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Error updating topic", error });
    }
});

// Add multiple topics to a course (instructor)
courseRouter.post("/:courseId/topics", auth, access("instructor"), async (req, res) => {
    const { courseId } = req.params;
    const { topics } = req.body;

    try {
        const course = await courseModel.findById(courseId);
        if (!course) {
            return res.status(404).json({ status: "error", message: "Course not found" });
        }
        topics.forEach(material => {
            course.topics.push(material);
        });

        await course.save();
        res.status(200).json({ status: "success", message: "Topics added successfully", course });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Internal server error" });
    }
});

//Enroll the Course(student)
courseRouter.put("/enroll/:id", auth, access("student"), async (req, res) => {
    const courseId = req.params.id;
    try {
        const courseDetails = await courseModel.findOne({ _id: courseId })
        if (!courseDetails) {
            return res.status(404).json({ status: "error", message: "Course Does not Present" });
        }

        if (courseDetails.students.includes(req.user._id)) {
            return res.status(400).json({ status: "error", message: "Already Enrolled in this Course" });
        }

        await courseModel.updateOne({ _id: courseId }, { $set: { students: [...courseDetails.students, req.user._id] } })

        res.status(200).json({ status: "success", message: "Course Enrolled successfully" });
    } catch (error) {
        return res.status(500).json({ status: "error", message: "Error updating course", error });
    }
});

//Delete the Course(instructor)
courseRouter.delete("/:id", auth, access("instructor"), async (req, res) => {
    try {
        await courseModel.findByIdAndDelete(req.params.id);
        res.status(200).json({ status: "success", message: "Course deleted successfully" });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Error deleting course", error });
    }
});

module.exports = {
    courseRouter
};
