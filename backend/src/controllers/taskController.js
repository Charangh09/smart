const mongoose = require("mongoose");

const Task = require("../models/Task");

const VALID_STATUS = ["Todo", "In Progress", "Done"];
const VALID_PRIORITY = ["Low", "Medium", "High"];

const parsePagination = (query) => {
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(query.limit) || 10));
  return { page, limit, skip: (page - 1) * limit };
};

const buildFilter = (query, userId) => {
  const filter = { userId };

  if (query.status && VALID_STATUS.includes(query.status)) {
    filter.status = query.status;
  }

  if (query.priority && VALID_PRIORITY.includes(query.priority)) {
    filter.priority = query.priority;
  }

  if (query.search) {
    const safeSearch = String(query.search).trim().slice(0, 80);
    if (safeSearch) {
      filter.title = { $regex: safeSearch, $options: "i" };
    }
  }

  return filter;
};

const buildSort = (sortBy = "createdAt", order = "desc") => {
  const safeSortBy = [
    "createdAt",
    "dueDate",
    "priority",
    "status",
    "title",
  ].includes(sortBy)
    ? sortBy
    : "createdAt";
  const safeOrder = order === "asc" ? 1 : -1;

  if (safeSortBy === "priority") {
    return { priority: safeOrder, createdAt: -1 };
  }

  return { [safeSortBy]: safeOrder };
};

const sanitizeTaskPayload = (payload, isCreate = false) => {
  const next = {};

  if (Object.prototype.hasOwnProperty.call(payload, "title") || isCreate) {
    const title = String(payload.title || "").trim();
    if (!title) {
      return { error: "Title is required" };
    }
    next.title = title;
  }

  if (Object.prototype.hasOwnProperty.call(payload, "description")) {
    next.description = String(payload.description || "").trim();
  }

  if (Object.prototype.hasOwnProperty.call(payload, "status")) {
    if (!VALID_STATUS.includes(payload.status)) {
      return { error: "Invalid status value" };
    }
    next.status = payload.status;
  }

  if (Object.prototype.hasOwnProperty.call(payload, "priority")) {
    if (!VALID_PRIORITY.includes(payload.priority)) {
      return { error: "Invalid priority value" };
    }
    next.priority = payload.priority;
  }

  if (Object.prototype.hasOwnProperty.call(payload, "dueDate")) {
    if (!payload.dueDate) {
      next.dueDate = null;
    } else {
      const dueDate = new Date(payload.dueDate);
      if (Number.isNaN(dueDate.getTime())) {
        return { error: "Invalid due date" };
      }
      next.dueDate = dueDate;
    }
  }

  return { value: next };
};

const getTasks = async (req, res, next) => {
  try {
    const { page, limit, skip } = parsePagination(req.query);
    const filter = buildFilter(req.query, req.user.id);
    const sortBy =
      typeof req.query.sortBy === "string" ? req.query.sortBy : "createdAt";
    const order =
      typeof req.query.order === "string" ? req.query.order : "desc";
    const sort = buildSort(sortBy, order);

    const [tasks, total] = await Promise.all([
      Task.find(filter).sort(sort).skip(skip).limit(limit),
      Task.countDocuments(filter),
    ]);

    return res.status(200).json({
      data: tasks,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return next(error);
  }
};

const createTask = async (req, res, next) => {
  try {
    const { value, error } = sanitizeTaskPayload(req.body, true);
    if (error) {
      return res.status(400).json({ message: error });
    }

    const task = await Task.create({
      ...value,
      userId: req.user.id,
    });

    return res.status(201).json(task);
  } catch (error) {
    return next(error);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const taskId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({ message: "Invalid task id" });
    }

    const { value, error } = sanitizeTaskPayload(req.body, false);
    if (error) {
      return res.status(400).json({ message: error });
    }

    if (Object.keys(value).length === 0) {
      return res
        .status(400)
        .json({ message: "No valid fields provided for update" });
    }

    const task = await Task.findOneAndUpdate(
      { _id: taskId, userId: req.user.id },
      value,
      { new: true, runValidators: true },
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    return res.status(200).json(task);
  } catch (error) {
    return next(error);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const taskId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({ message: "Invalid task id" });
    }

    const task = await Task.findOneAndDelete({
      _id: taskId,
      userId: req.user.id,
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    return res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    return next(error);
  }
};

const getTaskAnalytics = async (req, res, next) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const [summary, statusData, priorityData, completionTrendRaw] =
      await Promise.all([
        Task.aggregate([
          { $match: { userId } },
          {
            $group: {
              _id: null,
              total: { $sum: 1 },
              completed: {
                $sum: {
                  $cond: [{ $eq: ["$status", "Done"] }, 1, 0],
                },
              },
            },
          },
        ]),
        Task.aggregate([
          { $match: { userId } },
          { $group: { _id: "$status", count: { $sum: 1 } } },
        ]),
        Task.aggregate([
          { $match: { userId } },
          { $group: { _id: "$priority", count: { $sum: 1 } } },
        ]),
        Task.aggregate([
          {
            $match: {
              userId,
              status: "Done",
              updatedAt: { $gte: sevenDaysAgo },
            },
          },
          {
            $group: {
              _id: {
                $dateToString: { format: "%Y-%m-%d", date: "$updatedAt" },
              },
              completed: { $sum: 1 },
            },
          },
          { $sort: { _id: 1 } },
        ]),
      ]);

    const total = summary[0]?.total || 0;
    const completed = summary[0]?.completed || 0;
    const pending = Math.max(total - completed, 0);
    const completionPercentage = total
      ? Number(((completed / total) * 100).toFixed(2))
      : 0;

    const completionMap = Object.fromEntries(
      completionTrendRaw.map((item) => [item._id, item.completed]),
    );

    const completionTrend = Array.from({ length: 7 }).map((_, index) => {
      const date = new Date(sevenDaysAgo);
      date.setDate(sevenDaysAgo.getDate() + index);
      const key = date.toISOString().slice(0, 10);
      return {
        day: date.toLocaleDateString("en-US", { weekday: "short" }),
        completed: completionMap[key] || 0,
      };
    });

    return res.status(200).json({
      cards: {
        total,
        completed,
        pending,
        completionPercentage,
      },
      statusChart: statusData.map((item) => ({
        name: item._id,
        value: item.count,
      })),
      priorityChart: priorityData.map((item) => ({
        name: item._id,
        value: item.count,
      })),
      completionTrend,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getTaskAnalytics,
};
