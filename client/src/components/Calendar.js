import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSpinner } from 'react-icons/fa';

import './Calendar.scss';
import EventModal from './EventModal';
import EventsListModal from './EventsListModal';
import Header from './Header';
import DaysOfWeek from './DaysOfWeek';
import Cells from './Cells';

const Calendar = (props) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [eventDay, setEventDay] = useState({});
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showEventsListModal, setShowEventsListModal] = useState(false);
  const [eventToEdit, setEventToEdit] = useState({});
  const [editMode, setEditMode] = useState(false);

  const fetchEvents = async () => {
    try {
      const response = await axios.get('/events');
      setEvents(response.data);
      setIsLoading(false);
      console.log('Fetching events...');
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const eventModal = (e, event, type) => {
    e.stopPropagation();
    if (type === 'create') {
      setEventDay(event);
      setEventToEdit({});
      setEditMode(false);
    } else if (type === 'edit') {
      setEventDay();
      setEventToEdit(event);
      setEditMode(true);
    }
    setShowEventModal(true);
  };

  const toggleEventModal = () => {
    setShowEventModal(!showEventModal);
  };

  const toggleEventsListModal = (e, date) => {
    e && e.stopPropagation();
    setShowEventsListModal(!showEventsListModal);
    setEventDay(date);
  };

  return (
    <div className='calendar'>
      {showEventsListModal && (
        <EventsListModal
          toggleModal={toggleEventsListModal}
          events={events}
          day={eventDay}
          fetchEvents={fetchEvents}
        />
      )}
      {showEventModal && (
        <EventModal
          toggleModal={toggleEventModal}
          event={eventToEdit}
          day={eventDay}
          editMode={editMode}
          fetchEvents={fetchEvents}
        />
      )}
      <Header
        currentMonth={currentMonth}
        setCurrentMonth={setCurrentMonth}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />
      <DaysOfWeek />
      {isLoading ? (
        <FaSpinner className='spin' />
      ) : (
        <Cells
          currentMonth={currentMonth}
          selectedDate={selectedDate}
          eventModal={eventModal}
          toggleEventsListModal={toggleEventsListModal}
          events={events}
        />
      )}
    </div>
  );
};

export default Calendar;
