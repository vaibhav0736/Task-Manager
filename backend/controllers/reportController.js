const Task = require("../models/Task");
const User = require("../models/User");
const ExcelJS = require("exceljs"); // ✅ Corrected import

// ✅ Export all tasks as an Excel file
// @route GET /api/reports/export/tasks
// @access Private/Admin
const exportTasksReport = async (req, res) => {
  try {
    const tasks = await Task.find().populate("assignedTo", "name email");

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Task Report");

    worksheet.columns = [
      { header: "Task ID", key: "_id", width: 25 },
      { header: "Title", key: "title", width: 30 },
      { header: "Description", key: "description", width: 50 },
      { header: "Status", key: "status", width: 20 },
      { header: "Priority", key: "priority", width: 15 },
      { header: "Due Date", key: "dueDate", width: 20 },
      { header: "Assigned To", key: "assignedTo", width: 30 },
    ];

    tasks.forEach((task) => {
      const assignedTo = Array.isArray(task.assignedTo)
        ? task.assignedTo.map((u) => `${u.name} (${u.email})`).join(", ")
        : task.assignedTo?.name
        ? `${task.assignedTo.name} (${task.assignedTo.email})`
        : "Unassigned";

      worksheet.addRow({
        _id: task._id.toString(),
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate ? task.dueDate.toISOString().split("T")[0] : "N/A",
        assignedTo,
      });
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=tasks_report.xlsx");

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("Error exporting tasks:", error);
    res.status(500).json({ message: "Error exporting tasks", error: error.message });
  }
};

// ✅ Export user-task report as Excel file
// @route GET /api/reports/export/users
// @access Private/Admin
const exportUsersReport = async (req, res) => {
  try {
    const users = await User.find().select("name email _id").lean();
    const userTasks = await Task.find().populate("assignedTo", "name email _id");

    const userTaskMap = {};

    users.forEach((user) => {
      userTaskMap[user._id] = {
        name: user.name,
        email: user.email,
        taskCount: 0,
        pendingTasks: 0,
        inProgressTasks: 0,
        completedTasks: 0,
      };
    });

    userTasks.forEach((task) => {
      if (task.assignedTo && Array.isArray(task.assignedTo)) {
        task.assignedTo.forEach((assignedUser) => {
          const userId = assignedUser._id?.toString();
          if (userTaskMap[userId]) {
            userTaskMap[userId].taskCount += 1;
            if (task.status === "Pending") userTaskMap[userId].pendingTasks += 1;
            else if (task.status === "In Progress") userTaskMap[userId].inProgressTasks += 1;
            else if (task.status === "Completed") userTaskMap[userId].completedTasks += 1;
          }
        });
      } else if (task.assignedTo?._id) {
        const userId = task.assignedTo._id.toString();
        if (userTaskMap[userId]) {
          userTaskMap[userId].taskCount += 1;
          if (task.status === "Pending") userTaskMap[userId].pendingTasks += 1;
          else if (task.status === "In Progress") userTaskMap[userId].inProgressTasks += 1;
          else if (task.status === "Completed") userTaskMap[userId].completedTasks += 1;
        }
      }
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("User Task Report");

    worksheet.columns = [
      { header: "User Name", key: "name", width: 30 },
      { header: "Email", key: "email", width: 40 },
      { header: "Total Assigned Tasks", key: "taskCount", width: 20 },
      { header: "Pending Tasks", key: "pendingTasks", width: 20 },
      { header: "In Progress Tasks", key: "inProgressTasks", width: 20 },
      { header: "Completed Tasks", key: "completedTasks", width: 20 },
    ];

    Object.values(userTaskMap).forEach((user) => {
      worksheet.addRow(user);
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=users_report.xlsx");

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("Error exporting user report:", error);
    res.status(500).json({ message: "Error exporting user report", error: error.message });
  }
};

module.exports = {
  exportUsersReport,
  exportTasksReport,
};
