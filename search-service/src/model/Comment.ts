import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String
    },
    movie_id: {
        type: mongoose.Schema.Types.ObjectId,
    },
    text: {
        type: String
    },
    date: {
        type: Date
    },
    user_id: {
        type: Number
    }
}, {
    timestamps: true
});

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;