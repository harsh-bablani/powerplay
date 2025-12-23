const express = require("express");
const router = express.Router();

const controller = require("../controllers/reservationController");

// These must be functions
router.post("/", controller.createReservation);
router.delete("/:reservationId", controller.cancelReservation);
router.get("/", controller.getEventSummary);

module.exports = router;   // 👈 VERY IMPORTANT
