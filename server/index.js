const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { connection } = require("./config/db.config");
const { userRouter } = require("./routes/user.route");
const { courseRouter } = require("./routes/course.route");
const { assignmentRouter } = require("./routes/assignment.route");
const aiRouter = require("./routes/openAI.route");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/user", userRouter);
app.use("/courses", courseRouter);
app.use("/assignment",assignmentRouter)
app.use("/",aiRouter)

app.listen(process.env.PORT, async () => {
    try {
        await connection;
        console.log("DB Connected Successfully");
        console.log(`Server is Running on Port ${process.env.PORT}`);
    } catch (error) {
        console.log(error);
    }
});
