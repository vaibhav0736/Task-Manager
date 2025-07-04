const express=require("express");
const { protect ,adminOnly} = require("../middleware/authMiddlewares");
const {exportTasksReport}=require("../controllers/reportController")
const {exportUsersReport}=require("../controllers/reportController")

const router=express.Router();

router.get("/export/tasks",protect,adminOnly,exportTasksReport);//exports all tasks as excel/pdf
router.get("/export/users",protect,adminOnly,exportUsersReport);//export user-task report

module.exports=router