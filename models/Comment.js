const { Schema, model } = require("mongoose");

const commentSchema = new Schema(
    {
        title: { 
            type: String, 
            unique: true, 
            required: true 
            },
        comment: { 
            type: String, 
            required: true 
            },
        addedBy : { type: Schema.Types.ObjectId, ref: "User", default: null}
    },
    {
        timeseries: true,
        timestamps: true
    });

module.exports = model("Comment", commentSchema);