require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB=require("./config/db");

const authRoutes=require("./routes/authRoutes");
const userRoutes=require("./routes/userRoutes");
const taskRoutes=require("./routes/taskRoutes");
const reportRoutes=require("./routes/reportRoutes");
const app= express();

//middleware to handle cors requests
 app.use(
    cors({
        origin: process.env.CLIENT_URL,
        methods:[ "GET", "POST", "PUT", "DELETE"],
      allowedHeaders: ["Content-Type", "Authorization"],
       credentials: true,
    })
  );

  app.options('*', cors());
  //connect to db
  connectDB();
  app.use(express.json());

  //Routes

 app.use("/api/auth",authRoutes);
 app.use("/api/users",userRoutes);
 app.use("/api/tasks",taskRoutes);
 app.use("/api/reports",reportRoutes);

 //serve uploads folder

 app.use("/uploads",express.static(path.join(__dirname,"uploads")))


  //start server
  const PORT=process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));