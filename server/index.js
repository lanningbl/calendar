const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');
const app = express();
require('./database');

app.use(bodyParser.json());
app.use(cors());

const eventsRouter = require('./routes/events');
app.use('/events', eventsRouter);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build'));
  });
}

app.use(morgan('tiny'));

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
