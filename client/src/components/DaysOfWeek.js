import React from 'react';
import './DaysOfWeek.scss';

function DaysOfWeek() {
  const daysOfWeek = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

  return (
    <div className='day-of-week'>
      {daysOfWeek.map((day) => {
        return (
          <div className='day-of-week__cell' key={day}>
            <div className='day-of-week__day'>{day}</div>
          </div>
        );
      })}
    </div>
  );
}

export default DaysOfWeek;
