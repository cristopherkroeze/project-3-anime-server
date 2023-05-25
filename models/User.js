const { Schema, model } = require("mongoose");

const userSchema = new Schema(
    {
        img : { 
            type: String,
            default: "https://i.pinimg.com/736x/99/fd/e6/99fde65b336d554e117883d1aa76f0f0.jpg"  
            },
        email: { 
            type: String, 
            unique: true, 
            required: true 
            },
        userName: { 
            type: String, 
            unique: true, 
            required: true 
            },
        password: { 
            type: String, 
            required: true 
            },
        name: { 
            type: String, 
            required: true 
            },
        favoriteAnimes: [ { type: Schema.Types.ObjectId, ref: "Anime"} ],
        favoriteGenre: { 
            type: String  
            },
        role: {
            type: String,
            default: "User"
        }
    },
    {
        timeseries: true,
        timestamps: true
    });

module.exports = model("User", userSchema);
