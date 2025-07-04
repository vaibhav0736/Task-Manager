const Task=require("../models/Task");
const { rawListeners } = require("../models/User");


//desc get all tasks(Admin:all ,user:only assigned tasks)
//@route   get /api/tasks
//@acccess private

const getTasks=async(req,res) =>
{
    try {
        const {status}=req.query;
        let filter={};

        if(status)
        {
            filter.status=status;
        }

        let tasks;

        if(req.user.role==="admin")
        {
            tasks=await Task.find(filter)
            .populate(
                "assignedTo",
                "name email profileImageUrl"
            );
        }
        else
        {
            tasks=await Task.find({...filter,assignedTo: req.user._id}).populate(
                "assignedTo",
                "name email profileImageUrl"
            );

        }


        //add completed todochecklist count to each task
        tasks=await Promise.all(
            tasks.map(async (task) => {
                const completedCount=task.todoCheckList.filter(
                    (item) =>  item.completed
                ).length;
                return {...task._doc,completedTodoCount:completedCount};
     })
    );



    
const allTasks=await Task.countDocuments(
    req.user.role==="admin" ? {}:{assignedTo: req.user._id}
  
  );
  
  const pendingTasks=await Task.countDocuments({
    ...filter,
    status:"Pending",
    ...(req.user.role!=="admin" && {assignedTo:req.user._id}),
  });
  
  const inProgressTasks=await Task.countDocuments({
    ...filter,
    status:"In Progress",
    ...(req.user.role!=="admin" && {assignedTo:req.user._id}),
  });
  

  //staus summary counts
  const completedTasks=await Task.countDocuments({
    ...filter,
    status:"Completed",
    ...(req.user.role!=="admin" && {assignedTo:req.user._id}),
  });
  
  res.json({
    tasks,
    statusSummary: {
      all:allTasks,
      pendingTasks,
      inProgressTasks,
      completedTasks,
    },
  })
       
        
    } catch (error) 
    {
        res.status(500).json({message:"server error",error:error.message});
        
    }

}

//desc          get tasks by ID
//@route        get /api/tasks/:id
//@acccess      private

const getTasksById=async(req,res) =>
    {
        try {
            const task=await Task.findById(req.params.id).populate(
                "assignedTo",
                "name email profileImageUrl"
            );

            if(!task) return res.status(404).json({message:"Task not found"})

            res.json(task);

        } catch (error) 
        {
            res.status(500).json({message:"server error",error:error.message});
            
        }
    
    }

//desc     create a new task(admin only)
//@route   post /api/tasks/
//@acccess private(admin)

const createTask=async(req,res) =>
    {
        try {
            const
            {
                title,
                description,
                priority,
                dueDate,
                assignedTo,
                attachments,
                todoCheckList,
            }=req.body;

            //check is assignedTo is an array
            if(!Array.isArray(assignedTo))
            {
                return res.status(400).json({
                    message:"assigned must be an array of user IDS"
                });
            }

            const task=await Task.create({
                title,
                description,
                priority,
                dueDate,
                assignedTo,
                createdBy:req.user._id, //comes from auth middleware
                attachments,
                todoCheckList,
            });

            res.status(201).json({
                message:"Task created successfully",
                task,
            }); 
        } catch (error) 
        {
            res.status(500).json({message:"server error",error: error.message});
            
        }
    
    }
//desc     update task details
//@route   get /api/tasks/:id
//@acccess private

const updateTask=async(req,res) =>
    {
        try {
            const task=await Task.findById(req.params.id);

            if(!task)
            {
                return res.status(404).json({message:"task not found"});
            }

            //
            task.title=req.body.title || task.title;
            task.description=req.body.description || task.description;
            task.priority=req.body.priority || task.priority;
            task.dueDate=req.body.dueDate || task.dueDate;
            task.todoCheckList=req.body.todoCheckList || task.todoCheckList;
            task.attachments=req.body.attachments || task.attachments;


            if(req.body.assignedTo)
            {
                if(!Array.isArray(req.body.assignedTo))
                {
                    return res.status(400).json({message:"assignedTo must be an array of user IDS", });

                }

                task.assignedTo=req.body.assignedTo;
            }

            const updatedTask=await task.save();

            res.json({
                message:"Task updated successfully",
                task:updatedTask,
            });

            
        } catch (error) 
        {
            res.status(500).json({message:"server error",error:error.message});
            
        }
    
    }


//desc     delete task 
//@route   get /api/tasks/:id
//@acccess private

const deleteTask=async(req,res) =>
    {
        try {

            const task=await Task.findById(req.params.id)

            if(!task) return res.status(404).json({message:"Task not found"});
            await task.deleteOne();
            res.json({message:"Task deleted Successfully"});
    


        } catch (error) 
        {
            res.status(500).json({message:"server error",error:error.message});
            
        }
    
    }


//desc     update task status
//@route   put /api/tasks/:id/status
//@acccess private

const updateTaskStatus=async(req,res) =>
    {
        try {

            const task=await Task.findById(req.params.id);
            if(!task) return res.status(404).json({message: "task not found"})

         const isAssigned=task.assignedTo.some(
            (userId)=>userId.toString() === req.user.id.toString());


          if(req.user.role!=="admin" && !AssignedTo)
           {
            return res.status(403).json({message:"not authorized"})           
           }

           task.status=req.body.status || task.status;

           if(task.status === "Completed")
           {
            task.todoCheckList.forEach((item) => (item.completed = true));
            task.progress=100;
           }
        await task.save();
        res.json({message: "Task Status updated",task});

        } catch (error) 
        {
            res.status(500).json({message:"server error",error:error.message});
            
        }
    
    }


//desc     update task checklist
//@route   put /api/tasks/:id/todo
//@acccess private


 const updateTaskChecklist = async (req, res) => {
            try {
                const { todoCheckList } = req.body;
                const task = await Task.findById(req.params.id);
        
                if (!task) {
                    return res.status(404).json({ message: "Task not found" });
                }
        
                const isAssigned = task.assignedTo.some(
                    (id) => id.toString() === req.user._id.toString()
                );
        
                if (!isAssigned && req.user.role !== "admin") {
                    return res.status(403).json({ message: "Not authorized to update checklist" });
                }
        
                task.todoCheckList = todoCheckList;
        
                // Update progress
                const completedCount = Array.isArray(task.todoCheckList)
                    ? task.todoCheckList.filter((item) => item.completed).length
                    : 0;
        
                const totalItems = task.todoCheckList.length || 0;
                task.progress = totalItems > 0
                    ? Math.round((completedCount / totalItems) * 100)
                    : 0;
        
                // Auto status update
                if (task.progress === 100) {
                    task.status = "Completed";
                } else if (task.progress > 0) {
                    task.status = "In Progress";
                } else {
                    task.status = "Pending";
                }
        
                await task.save();
        
                const updatedTask = await Task.findById(req.params.id).populate(
                    "assignedTo",
                    "name email profileImageUrl"
                );
        
                res.json({ message: "Task checklist updated", task: updatedTask });
        
            } catch (error) {
                res.status(500).json({ message: "Server error", error: error.message });
            }
    
    }

//desc     dashboard data(admin only)
//@route   PUT /api/tasks/dashboard-data
//@acccess private


// You're an admin, and you want to see:
// How many tasks are there in total?
// How many are pending, completed, overdue?
// How tasks are distributed by status (for charts/graphs etc.)
const getDashboardData = async (req, res) => {
    try {
        // Fetch statistics
        const totalTasks = await Task.countDocuments();
        const pendingTasks = await Task.countDocuments({ status: "Pending" });
        const completedTasks = await Task.countDocuments({ status: "Completed" });
        const overdueTasks = await Task.countDocuments({
            status: { $ne: "Completed" }, // Not equal to Completed
            dueDate: { $lt: new Date() }, // Due date is in the past
        });

        // Task distribution by status
        const taskStatuses = ["Pending", "InProgress", "Completed"];
        const taskDistributionRaw = await Task.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 },
                },
            },
        ]);

        const taskDistribution = taskStatuses.reduce((acc, status) => {
            const formattedKey = status.replace(/\s+/g, ""); // remove spaces from key
            acc[formattedKey] =
                taskDistributionRaw.find((item) => item._id === status)?.count || 0;
            return acc;
        }, {});
        taskDistribution["All"] = totalTasks; // Add total count to distribution

        // Task priority levels
        const taskPriorities = ["Low", "Medium", "High"];
        const taskPriorityLevelsRaw = await Task.aggregate([
            {
                $group: {
                    _id: "$priority",
                    count: { $sum: 1 },
                },
            },
        ]);

        const taskPriorityLevels = taskPriorities.reduce((acc, priority) => {
            acc[priority] =
                taskPriorityLevelsRaw.find((item) => item._id === priority)?.count || 0;
            return acc;
        }, {});

        // Fetch recent 10 tasks
        const recentTasks = await Task.find()
            .sort({ createdAt: -1 }) // Sort by newest first
            .limit(10)
            .select("title status priority dueDate createdAt");

        // Send response
        res.status(200).json({
            statistics: {
                totalTasks,
                pendingTasks,
                completedTasks,
                overdueTasks,
            },
            charts: {
                taskDistribution,
                taskPriorityLevels,
            },
            recentTasks,
        });
    } catch (error) {
        res.status(500).json({ message: "server error", error: error.message });
    }
};



//desc     update task details(user specific)
//@route   put /api/tasks/user-dashboard-data
//@acccess private

const getUserDashboardData=async(req,res) =>
    {
        try {

            const userId=req.user._id;  //only fetch for logged in user

            const totalTasks=await Task.countDocuments({assignedTo:userId});
            const pendingTasks=await Task.countDocuments({assignedTo:userId,status:"Pending"});
            const completedTasks=await Task.countDocuments({assignedTo:userId,status:"Completed"});
            const overdueTasks=await Task.countDocuments({
                assignedTo:userId,
                status: { $ne: "Completed"},
                dueDate: { $lt : new Date()},
            });


            //Task distribution by status
            const taskStatuses=["Pending","In Progress","Completed"];
            const taskDistributionRaw=await Task.aggregate([
               { $match: { assignedTo: userId}},
                {$group: {_id: "$status",count:{$sum:1}}},

                
            ]);


            const taskDistribution=taskStatuses.reduce((acc,status) => {
                const formattedKey=status.replace(/\s+/g, "");
                acc[formattedKey]=
                taskDistributionRaw.find((item) => item._id === status)?.count || 0;
                return acc;

            },{});
            taskDistribution["All"]=totalTasks;


            //task distribution by priority
            const taskPriorities=["Low","Medium","High"];
              const taskPriorityLevelsRaw=await Task.aggregate([
                { $match: {assignedTo:userId}},
                {$group: {_id:"$priority",count:{$sum:1}}},
              ])


            const taskPriorityLevels=taskPriorities.reduce((acc,priority) => {
                acc[priority]=taskPriorityLevelsRaw.find((item) => item._id === priority)?.count || 0;
                return acc;

            },{});

            //fetch recent 10 transaction
            const recentTasks=await Task.find({assignedTo:userId})
            .sort({createdAt:-1})
            .limit(10)
            .select("title status priority dueDate createdAt");


            res.status(200).json({
                statistics: {
                    totalTasks,
                    pendingTasks,
                    completedTasks,
                    overdueTasks,
                },
                charts: {
                    taskDistribution,
                    taskPriorityLevels,
                },
                recentTasks,
            });



        } catch (error) 
        {
            res.status(500).json({message:"server error",error:error.message});
            
        }
    
    }

    module.exports={
        getTasks,
        getTasksById,
        createTask,
        updateTask,
        deleteTask,
        updateTaskChecklist,
        updateTaskStatus,
        getDashboardData,
        getUserDashboardData,
    };
