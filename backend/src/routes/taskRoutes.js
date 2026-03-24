const express = require("express");

const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getTaskAnalytics,
} = require("../controllers/taskController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authMiddleware);

router.get("/", getTasks);
router.post("/", createTask);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);
router.get("/analytics/summary", getTaskAnalytics);

module.exports = router;
