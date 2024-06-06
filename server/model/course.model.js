const mongoose = require("mongoose");
const paginate = require("mongoose-paginate-v2");

const courseSchema = mongoose.Schema({
    title: { type: String },
    category:{ type: String},
    description: { type: String },
    instructor: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
    materials: [{
        title: { type: String },
        content: { type: String },
        url: { type: String }
    }]
},{ versionKey: false, timestamps: true });

courseSchema.plugin(paginate);
const courseModel = mongoose.model("course", courseSchema);

module.exports = {
    courseModel
};
