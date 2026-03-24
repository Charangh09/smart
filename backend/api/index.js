const app = require("../src/app");
const connectDB = require("../src/config/db");

let dbReadyPromise;

const ensureDbConnection = () => {
  if (!dbReadyPromise) {
    dbReadyPromise = connectDB();
  }
  return dbReadyPromise;
};

module.exports = async (req, res) => {
  try {
    await ensureDbConnection();
    return app(req, res);
  } catch (error) {
    return res.status(500).json({
      message: "Database connection failed",
      details: error.message,
    });
  }
};
