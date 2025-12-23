const { event, reservations } = require("../data/eventStore");
const { v4: uuidv4 } = require("uuid");

exports.createReservation = (req, res) => {
  const { partnerId, seats } = req.body;

  if (!seats || seats <= 0 || seats > 10) {
    return res.status(400).json({ error: "Seats must be between 1 and 10" });
  }

  if (event.availableSeats < seats) {
    return res.status(409).json({ error: "Not enough seats left" });
  }

  const reservationId = uuidv4();

  event.availableSeats -= seats;
  event.version += 1;

  reservations.set(reservationId, {
    reservationId,
    partnerId,
    seats,
    status: "confirmed"
  });

  res.status(201).json({
    reservationId,
    seats,
    status: "confirmed"
  });
};

exports.cancelReservation = (req, res) => {
  const { reservationId } = req.params;

  if (!reservations.has(reservationId)) {
    return res.status(404).json({ error: "Reservation not found" });
  }

  const reservation = reservations.get(reservationId);

  event.availableSeats += reservation.seats;
  event.version += 1;

  reservations.delete(reservationId);

  res.status(204).send();
};

exports.getEventSummary = (req, res) => {
  res.status(200).json({
    eventId: event.eventId,
    name: event.name,
    totalSeats: event.totalSeats,
    availableSeats: event.availableSeats,
    reservationCount: event.totalSeats - event.availableSeats,
    version: event.version
  });
};
