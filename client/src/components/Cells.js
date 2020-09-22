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
  const dayPositionsUsed = {};

  let days = [];
  let day = startDate;
  let formattedDate = '';

  const eventDaysOfWeek = (day, eventEndDate, dayOfWeek) => {
    let daysLeft = differenceInCalendarDays(new Date(eventEndDate), day) + 1;

    if (daysLeft >= 7 && dayOfWeek === 0) {
      return 'w7of7';
    } else if (daysLeft >= 6 && dayOfWeek <= 1) {
      return 'w6of7';
    } else if (daysLeft >= 5 && dayOfWeek <= 2) {
      return 'w5of7';
    } else if (daysLeft >= 4 && dayOfWeek <= 3) {
      return 'w4of7';
    } else if (daysLeft >= 3 && dayOfWeek <= 4) {
      return 'w3of7';
    } else if (daysLeft >= 2 && dayOfWeek <= 5) {
      return 'w2of7';
    } else if (daysLeft >= 1 && dayOfWeek <= 6) {
      return 'w1of7';
    }
  };

  const eventSlot = (startDate, endDate, dayOfWeek) => {
    let daysLeft = differenceInCalendarDays(endDate, startDate) + 1;
    let daysToCheck = 0;
    if (daysLeft >= 7 && dayOfWeek === 0) {
      daysToCheck = 7;
    } else if (daysLeft >= 6 && dayOfWeek <= 1) {
      daysToCheck = 6;
    } else if (daysLeft >= 5 && dayOfWeek <= 2) {
      daysToCheck = 5;
    } else if (daysLeft >= 4 && dayOfWeek <= 3) {
      daysToCheck = 4;
    } else if (daysLeft >= 3 && dayOfWeek <= 4) {
      daysToCheck = 3;
    } else if (daysLeft >= 2 && dayOfWeek <= 5) {
      daysToCheck = 2;
    } else if (daysLeft >= 1 && dayOfWeek <= 6) {
      daysToCheck = 1;
    }

    let day = startDate;
    for (let j = 1; j < 8; j++) {
      let isIncluded = false;
      for (let k = daysToCheck; k > 0; k--) {
        if (dayPositionsUsed[day] && dayPositionsUsed[day].includes(j)) {
          isIncluded = true;
          k = daysToCheck;
          j++;
        } else {
          day = addDays(day, 1);
        }
        if (k === 1 && !isIncluded) {
          day = startDate;
          for (let l = daysToCheck; l > 0; l--) {
            if (dayPositionsUsed[day]) {
              dayPositionsUsed[day].push(j);
            } else {
              dayPositionsUsed[day] = [j];
            }
            day = addDays(day, 1);
          }
          return;
        }
        isIncluded = false;
      }
      day = startDate;
    }
  };

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
            <div className='number-container'>
              <div
                className={`number ${
                  !isSameMonth(day, monthStart) && 'disabled'
                }`}
                onClick={(e) => toggleEventsListModal(e, dayCopy)}
              >
                {formattedDate}
              </div>
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
                  <div key={index}>
                    {isSameDay(dayCopy, new Date(event.startDate)) ||
                    i === 0 ? (
                      <div
                        onClick={(e) => {
                          eventModal(e, event, 'edit');
                        }}
                        key={index}
                        className={`event-info ${eventDaysOfWeek(
                          dayCopy,
                          event.endDate,
                          i
                        )} ${
                          !isSameMonth(dayCopy, monthStart) ? 'disabled' : ''
                        }`}
                      >
                        {(isSameDay(dayCopy, new Date(event.startDate)) ||
                          i === 0) &&
                          event.title}
                        {eventSlot(dayCopy, new Date(event.endDate), i)}
                      </div>
                    ) : (
                      <div>
                        {dayPositionsUsed[dayCopy].includes(1) && (
                          <div className='push-down' />
                        )}
                      </div>
                    )}
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

  return (
    <>
      {rows}
      {/* {console.log(dayPositionsUsed)} */}
    </>
  );
};

export default Cells;
