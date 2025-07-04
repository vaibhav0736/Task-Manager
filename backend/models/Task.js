const mongoose =require('mongoose');


//Subschema for checklist items--
const todoSchema=new mongoose.Schema({
    text:{
        type:String,
        required:true,
    },
    completed:
    {
        type:Boolean,
        default:false,
    },
});

//Main task Schema--
const taskSchema=new mongoose.Schema({
    title: {
        type:String,
        required:true,

    },
    description:
    {
        type:String,
        required:true,
    },
    status:
    {
        type:String,
        enum:['Pending','In Progress','Completed'],
        default:'Pending',
    },
    priority:
    {
        type:String,
        required:true,
        enum:['Low','Medium','High'],
        default: "Medium",
    },
    dueDate:
    {
        type:Date,
        required:true,
    },
    assignedTo:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    }],
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    },
    attachments:
    [{
        type:String,
    }],
    progress:{
        type:Number,
        default:0,
    },
    todoCheckList:[todoSchema],




},
{timestamps: true}

);

module.exports=mongoose.model("Task",taskSchema);