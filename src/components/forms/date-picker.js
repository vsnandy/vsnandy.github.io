import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";

import calendar, { 
  isDate, isSameDay, isSameMonth,
  getDateISO, getNextMonth, getPreviousMonth,
  WEEK_DAYS, CALENDAR_MONTHS
} from "../../db/calendar";

const Calendar = (props) => {
  [selected, setSelected] = useState(resolveStateFromProps());
  [today, setToday] = useState(new Date());

  const resolveStateFromDate = (date) => {
    const isDateObject = isDate(date);
    const _date = isDateObject ? date : new Date();

    return {
      current: isDateObject ? date : null,
      month: +_date.getMonth() + 1,
      year: _date.getFullYear()
    };
  }

  const resolveStateFromProps = () => {
    return resolveStateFromDate(props.date);
  }

  const getCalendarDates = () => {
    const { current, month, year } = selected;
    const calendarMonth = month || +current.getMonth() + 1;
    const calendarYear = year || current.getFullYear();

    return calendar(calendarMonth, calendarYear);
  }

  // Render the month and year header with arrow controls
  // for navigating through months and years
  const renderMonthAndYear = () => {
    const { month, year } = selected;

    // Resolve the month name from the CALENDAR_MONTHS object map
    const monthname = Object.keys(CALENDAR_MONTHS)[
      Math.max(0, Math.min(month - 1, 11))
    ];

    return (
      <Container>
        <AiOutlineArrowLeft 
          onMouseDown={handlePrevious} 
          onMouseUp={clearPressureTimer} 
          size="1rem" 
          title="Previous Month" 
        />
        {monthname} {year}
        <AiOutlineArrowRight
          onMouseDown={handleNext}
          onMouseUp={clearPressureTimer}
          size="1rem"
          title="Next Month"
        />
      </Container>
    );
  }

  // Render the label for day of the week
  // This method is used as a map callback as seen in render()
  const renderDayLabel = (day, index) => {
    // Resolve the day of the week label from the WEEK_DAYS object map
    const daylabel = WEEK_DAYS[day].toUpperCase();

    return (
      <Container key={daylabel} index={index}>
        {daylabel}
      </Container>
    );
  }

  // Render a calendar date as returned from the calendar builder function
  // This method is used as a map callback as seen in render()
  const renderCalendarDate = (date, index) => {
    const { current, month, year, today } = {...selected, today};
    const _date = new Date(date.join("-"));

    // Check if calendar date is same day as today
    const isToday = isSameDay(_date, today);

    // Check if calendar date is same day as currently selected date
    const isCurrent = current && isSameDay(_date, current);

    // Check of calendar date is in the same month as the state month and year
    const inMonth = month && year && isSameMonth(_date, new Date([year, month, 1].join("-")));

    // The click handler
    const onClick = gotoDate(_date);

    const args = { index, inMonth, onClick, title: _date.toDateString() };

    // Conditionally render a component
    const DateComponent = isCurrent
      ? <HighlightedCalendarDate />
      : isToday
        ? <TodayCalendarDate />
        : <CalendarDate />;

    return (
      <DateComponent key={getDateISO(_date)} {...args}>
        {_date.getDate()}
      </DateComponent>
    );
  }

  const gotoDate = date => evt => {
    evt && evt.preventDefault();
    const { current } = selected;
    const { onDateChanged } = props;

    !(current && isSameDay(date, current)) &&
      setSelected(resolveStateFromDate(date), () => {
        typeof onDateChanged === "function" && onDateChanged(date);
      });
  }

  const gotoPreviousMonth = () => {
    const { month, year } = selected;
    setSelected(getPreviousMonth(month, year));
  }

  const gotoNextMonth = () => {
    const { month, year } = selected;
    setSelected(getNextMonth(month, year));
  }

  const gotoPreviousYear = () => {
    const { year } = selected;
    setSelected({ year: year - 1 });
  }

  const gotoNextYear = () => {
    const { year } = selected;
    setSelected({ year: year + 1 });
  }

  const handlePressure = fn => {
    if(typeof fn === "function") {
      fn();
      pressureTimeout = setTimeout(() => {
        pressureTimer = setInterval(fn, 100);
      }, 500);
    }
  }

  const clearPressureTimer = () => {
    pressureTimer && clearInterval(pressureTimer);
    pressureTimeout && clearTimeout(pressureTimeout);
  }

  const handlePrevious = evt => {
    evt && evt.preventDefault();
    const fn = evt.shiftKey ? gotoPreviousYear : gotoPreviousMonth;
    handlePressure(fn);
  }

  const handleNext = evt => {
    evt && evt.preventDefault();
    const fn = evt.shiftKey ? gotoNextYear : gotoNextMonth;
    handlePressure(fn);
  }

  return (
    <Container>
      {renderMonthAndYear()}
      <Container>
        {Object.keys(WEEK_DAYS).map(renderDayLabel)}
      </Container>
      <Container>
        {getCalendarDates().map(renderCalendarDate)}
      </Container>
    </Container>
  );
}

export default Calendar;