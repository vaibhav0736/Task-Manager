export const BASE_URL="http://localhost:8000";

export const API_PATHS={
    AUTH:{
        REGISTER:"/api/auth/register",//REGSITER A NEW USER
        LOGIN:"/api/auth/login",//AUTHENTICATE USER AND RETURN JWT TOKEN
        GET_PROFILE:"/api/auth/profile",//GET LOGGED IN USER DETAILS
    },

    USERS:{
        GET_ALL_USERS:"/api/users",//GET ALL USERS(ADMIN ONLY)
        GET_USER_BY_ID:(userId)=>`/api/users/${userId}`,//get user by id
        CREATE_USER:"/api/users",//create a new users(admin only)
        UPDATE_USER:(userId)=>`/api/users/${userId}`,//Update user details
        DELETE_USER:(userId)=>`/api/users/${userId}`,//DELETE A useR

    },
    TASKS:{
        GET_DASHBOARD_DATA:"/api/tasks/dashboard-data",//get dashboard data
        GET_USER_DASHBOARD_DATA:"/api/tasks/user-dashboard-data",//get user dashboard data
        GET_ALL_TASKS:"/api/tasks",//get all tasks(Admin:all,User:only assigned)
        GET_TASK_BY_ID:(taskId)=>`/api/tasks/${taskId}`,//get tasks by id
        CREATE_TASK:"/api/tasks",//create a new task
        UPDATE_TASK:(taskId)=>`/api/tasks/${taskId}`,//update a task details
        DELETE_TASK:(taskId)=>`/api/tasks/${taskId}`,//delete a new task(admin only)

        UPDATE_TASK_STATUS:(taskId)=>`/api/tasks/${taskId}/status`,//update tasks status of a task
        UPDATE_TODO_CHECKLIST:(taskId)=>`/api/tasks/${taskId}/todo`,//update todo checklist
    },

    REPORTS:{
        EXPORT_TASKS:"/api/reports/export/tasks",//donwload all taks as an excel
        EXPORT_USERS:"/api/reports/export/users",//download user-task report
    },

    IMAGE:{
        UPLOAD_IMAGE:"api/auth/upload-image",
    },
};