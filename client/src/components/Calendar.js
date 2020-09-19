import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  format,
  startOfWeek,
  startOfMonth,
  endOfWeek,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addDays,
  addMonths,
  subMonths,
  getYear,
  isWithinInterval,
} from 'date-fns';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Row, Col, Button, Spinner } from 'react-bootstrap';
import { IoMdArrowDropleft, IoMdArrowDropright } from 'react-icons/io';
import { FcCalendar } from 'react-icons/fc';
import { MdAdd } from 'react-icons/md';

import './Calendar.scss';
import EventModal from './EventModal';
import EventsListModal from './EventsListModal';

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

  const renderHeader = () => {
    const monthFormat = 'MMMM';
    const month = format(currentMonth, monthFormat);
    return (
      <div className='text-center header'>
        <DatePicker
          selected={selectedDate}
          onChange={onChangeDate}
          showMonthDropdown
          showYearDropdown
          dropdownMode='select'
          withPortal
          fixedHeight
          customInput={
            <div className='grow'>
              <FcCalendar />
            </div>
          }
        />
        <Row className='header-row'>
          <Col className='text-right'>
            <IoMdArrowDropleft className='grow' onClick={prevMonth} />
          </Col>
          <Col>
            {month} {getYear(currentMonth)}
          </Col>
          <Col className='text-left'>
            <IoMdArrowDropright className='grow' onClick={nextMonth} />
          </Col>
        </Row>
        <Button
          variant='dark'
          onClick={() => {
            setSelectedDate(todaysDate);
          }}
        >
          Go To Today
        </Button>
      </div>
    );
  };

  const renderDays = () => {
    const daysOfWeek = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    const days = [];
    for (let day of daysOfWeek) {
      days.push(
        <Col className='text-center' key={day}>
          {day}
        </Col>
      );
    }
    return <Row className='days'>{days}</Row>;
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const dayFormat = 'd';
    const rows = [];

    let days = [];
    let day = startDate;
    let formattedDate = '';

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, dayFormat);
        const dayCopy = day;

        days.push(
          <Col
            className={`cell ${
              isSameDay(day, selectedDate)
                ? 'selected'
                : !isSameMonth(day, monthStart)
                ? 'disabled'
                : ''
            }`}
            key={day}
            // onClick={() => toggleEventsListModal(dayCopy)}
            onClick={(e) => {
              eventModal(e, dayCopy, 'create');
            }}
          >
            <div className='cell-container'>
              <div
                className='number'
                onClick={(e) => toggleEventsListModal(e, dayCopy)}
              >
                {formattedDate}
              </div>
              {isSameMonth(day, monthStart) ? (
                <div>
                  <div>
                    {events
                      .filter(
                        (event) =>
                          isWithinInterval(dayCopy, {
                            start: new Date(event.startDate),
                            end: new Date(event.endDate),
                          }) || isSameDay(dayCopy, new Date(event.startDate))
                      )
                      .sort((x, y) => (x.startDate > y.startDate ? 1 : -1))
                      .map((event, index) => (
                        <div
                          onClick={(e) => {
                            eventModal(e, event, 'edit');
                          }}
                          key={index}
                          className='event-info'
                        >
                          {event.title}
                        </div>
                      ))}
                  </div>
                  {/* <div className='btn-position'>
                    <Button
                      className='btn-circle'
                      variant=''
                      onClick={(e) => {
                        eventModal(e, dayCopy, 'create');
                      }}
                    >
                      <MdAdd />
                    </Button>
                  </div> */}
                </div>
              ) : (
                ''
              )}
            </div>
          </Col>
        );
        day = addDays(day, 1);
      }
      rows.push(<Row key={day}>{days}</Row>);
      days = [];
    }
    return <div className='body'>{rows}</div>;
  };

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

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const onChangeDate = (date) => {
    setSelectedDate(date);
    setCurrentMonth(date);
  };

  const todaysDate = () => {
    let now = new Date();
    setSelectedDate(now);
    setCurrentMonth(now);
  };

  const toggleEventsListModal = (e, date) => {
    e && e.stopPropagation();
    setShowEventsListModal(!showEventsListModal);
    setEventDay(date);
  };

  if (isLoading) {
    return (
      <Spinner className='spinner' animation='border' role='status'>
        <span className='sr-only'>Loading...</span>
      </Spinner>
    );
  }

  return (
    <div className='calendar shadow-sm'>
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

      {renderHeader()}
      {renderDays()}
      {renderCells()}
    </div>
  );
};

export default Calendar;
