const { model, Schema } = require('mongoose')

const animeSchema = new Schema(
    {
        img : { 
            type: String,  
            required: true 
            },
        title: { 
            type: String, 
            unique: true, 
            required: true 
            },
        rating : { 
            type: Number,  
            required: false 
            },
        genre : { 
            type: String, 
            required: true 
            },
        description : { 
            type: String, 
            required: true 
            },
        mainCharacter : {type: Schema.Types.ObjectId, ref: "Character", default: null},
        addedBy : { type: Schema.Types.ObjectId, ref: "User", default: null},
        ratedBy: [ { type: Schema.Types.ObjectId, ref: "User"} ],
        comments: [ { type: Schema.Types.ObjectId, ref: "Comment"} ]
    },
    {
        timestamps: true,
        timeseries: true
    }
)

module.exports = model("Anime", animeSchema)