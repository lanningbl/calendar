import React from 'react';
import DatePicker from 'react-datepicker';
import { format, getYear, subMonths, addMonths } from 'date-fns';
import { IoMdArrowDropleft, IoMdArrowDropright } from 'react-icons/io';
import { FcCalendar } from 'react-icons/fc';

import './Header.scss';

function Header({
  currentMonth,
  setCurrentMonth,
  selectedDate,
  setSelectedDate,
}) {
  const monthFormat = 'MMMM';
  const month = format(currentMonth, monthFormat);

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const todaysDate = () => {
    let now = new Date();
    setSelectedDate(now);
    setCurrentMonth(now);
  };

  const onChangeDate = (date) => {
    setSelectedDate(date);
    setCurrentMonth(date);
  };

  return (
    <div className='header'>
      <DatePicker
        selected={selectedDate}
        onChange={onChangeDate}
        showMonthDropdown
        showYearDropdown
        dropdownMode='select'
        withPortal
        fixedHeight
        customInput={
          <div className='header__icon'>
            <FcCalendar />
          </div>
        }
      />
      <div className='header__date-month'>
        <IoMdArrowDropleft className='grow' onClick={prevMonth} />
        {`${month} ${getYear(currentMonth)}`}
        <IoMdArrowDropright className='grow' onClick={nextMonth} />
      </div>
      <div
        className='header__btn'
        onClick={() => {
          setSelectedDate(todaysDate);
        }}
      >
        Today
      </div>
    </div>
  );
}

export default Header;
