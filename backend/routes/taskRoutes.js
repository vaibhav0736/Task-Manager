const express=require('express');
const { protect,adminOnly }=require("../middleware/authMiddlewares");
const {getDashboardData,getUserDashboardData,getTasksById,getTasks,createTask,updateTask,updateTaskChecklist,updateTaskStatus,deleteTask}=require("../controllers/taskController")

const router=express.Router();

router.get("/dashboard-data",protect,getDashboardData);
router.get("/user-dashboard-data",protect,getUserDashboardData);
router.get("/",protect,getTasks);
router.get("/:id",protect,getTasksById);
router.post("/",protect,adminOnly,createTask);
router.put('/:id',protect,updateTask);
router.delete('/:id',protect,adminOnly,deleteTask);
router.put('/:id/status',protect,updateTaskStatus);
router.put("/:id/todo",protect,updateTaskChecklist);

module.exports=router;

// {
//     "_id": "67f7655fd82628cf0c4ed146",
//     "name": "Abhay1",
//     "email": "abhay1@example.com",
//     "role": "admin",
//     "profileImageUrl": "",
//     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3Zjc2NTVmZDgyNjI4Y2YwYzRlZDE0NiIsImlhdCI6MTc0NDI2NjU5MSwiZXhwIjoxNzQ0ODcxMzkxfQ.8-VNMhb46voXXjim7yrO-UcYMVVp4tDhMt_Yoxtckqw"
// }