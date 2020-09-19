import React from 'react';
import {
  format,
  startOfWeek,
  startOfMonth,
  endOfWeek,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addDays,
  isWithinInterval,
  differenceInCalendarDays,
} from 'date-fns';

import './Cells.scss';

const Cells = ({
  currentMonth,
  selectedDate,
  eventModal,
  toggleEventsListModal,
  events,
}) => {
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);
  const daysOnCalendarMonth = differenceInCalendarDays(endDate, startDate);

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
        <div
          className={`cell 
          ${daysOnCalendarMonth === 34 ? 'rows-5' : 'rows-6'} 
          ${isSameDay(day, selectedDate) ? 'selected' : ''}`}
          key={day}
          onClick={(e) => {
            eventModal(e, dayCopy, 'create');
          }}
        >
          <div className='cell-container'>
            <div
              className={`number ${
                !isSameMonth(day, monthStart) && 'disabled'
              }`}
              onClick={(e) => toggleEventsListModal(e, dayCopy)}
            >
              {formattedDate}
            </div>
            <div>
              {events
                .filter((event) =>
                  isWithinInterval(dayCopy, {
                    start: new Date(event.startDate),
                    end: new Date(event.endDate),
                  })
                )
                .sort((x, y) => (x.startDate > y.startDate ? 1 : -1))
                .map((event, index) => (
                  <div
                    onClick={(e) => {
                      eventModal(e, event, 'edit');
                    }}
                    key={index}
                    className={`event-info ${
                      !isSameMonth(dayCopy, monthStart) ? 'disabled' : ''
                    }`}
                  >
                    {event.title}
                  </div>
                ))}
            </div>
          </div>
        </div>
      );
      day = addDays(day, 1);
    }
    rows.push(
      <div className='cells__row' key={day}>
        {days}
      </div>
    );
    days = [];
  }
  return <>{rows}</>;
};

export default Cells;
