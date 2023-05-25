const { Schema, model } = require("mongoose");

const characterSchema = new Schema(
    {
        img: { 
            type: String, 
            unique: true, 
            },
        name: { 
            type: String, 
            unique: true, 
            required: true 
            },
        anime: { type: Schema.Types.ObjectId, ref: "Animes", default: null},
        voicedBy: { type: String,
        required: true},
    },
    {
        timeseries: true,
        timestamps: true
    });

module.exports = model("Character", characterSchema);
