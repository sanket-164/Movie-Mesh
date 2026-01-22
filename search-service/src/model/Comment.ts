import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId
    },
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
    }
});

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;