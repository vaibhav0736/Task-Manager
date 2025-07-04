const User = require("../models/User");
const Task=require("../models/Task");
const bcrypt = require("bcrypt");


// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password"); // exclude passwords
          
        const usersWithTaskCounts = await Promise.all(
            users.map(async (user) => {
              const pendingTasks = await Task.countDocuments({
                assignedTo: user._id,
                status: "Pending",
              });
      
              const inProgressTasks = await Task.countDocuments({
                assignedTo: user._id,
                status: "In Progress",
              });
      
              const completedTasks = await Task.countDocuments({
                assignedTo: user._id,
                status: "Completed",
              });
              return {
                ...user._doc, // Include all user fields
                pendingTasks,
                inProgressTasks,
                completedTasks,
              };
            })
        );


              res.status(200).json(usersWithTaskCounts);

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc    Delete a user (Admin only)
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        await user.deleteOne();
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = {
    getUsers,
    getUserById,
    deleteUser,
};
