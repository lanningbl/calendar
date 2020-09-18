const router = require('express').Router();

const Event = require('../models/event.model');

router.route('/').get((req, res) => {
  Event.find()
    .then((event) => res.json(event))
    .catch((err) => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
  const title = req.body.title;
  const location = req.body.location;
  const startDate = req.body.startDate;
  const endDate = req.body.endDate;
  const isTimeSet = req.body.isTimeSet;

  const newEvent = new Event({
    title,
    location,
    startDate,
    endDate,
    isTimeSet,
  });

  newEvent
    .save()
    .then(() => res.json('Event added!'))
    .catch((err) => res.status(400).json('Error: ' + err));
});

router.route('/:id').get((req, res) => {
  Event.findById(req.params.id)
    .then((event) => res.json(event))
    .catch((err) => res.status(400).json('Error: ' + err));
});

router.route('/:id').delete((req, res) => {
  Event.findByIdAndDelete(req.params.id)
    .then(() => res.json('Event deleted.'))
    .catch((err) => res.status(400).json('Error: ' + err));
});

router.route('/update/:id').post((req, res) => {
  Event.findById(req.params.id)
    .then((event) => {
      event.title = req.body.title;
      event.location = req.body.location;
      event.startDate = req.body.startDate;
      event.endDate = req.body.endDate;
      event.isTimeSet = req.body.isTimeSet;

      event
        .save()
        .then(() => res.json('Event updated!'))
        .catch((err) => res.status(400).json('Error: ' + err));
    })
    .catch((err) => res.status(400).json('Error: ' + err));
});

module.exports = router;
