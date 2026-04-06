const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authenticate = require("../middlewares/authMiddleware");

// POST /api/auth/login
router.post("/login", authController.login);

// POST /api/auth/register
router.post("/register", authController.register);

// PUT /api/auth/change-password (authenticated)
router.put("/change-password", authenticate, authController.changePassword);

// PUT /api/auth/profile (authenticated)
router.put("/profile", authenticate, authController.updateProfile);

module.exports = router;
