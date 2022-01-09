import React, { Fragment } from "react";
import "semantic-ui-css/semantic.min.css";

import useCalendar from "../api/useCalendar";
import styles from "../../styles/Calendar.module.css";

export default function Calendar() {
  const {
    calendarRows,
    selectedDate,
    todayFormatted,
    daysShort,
    monthNames,
    getNextMonth,
    getPrevMonth,
  } = useCalendar();

  const dateClickHandler = (date) => {
    console.log(date);
  };

  return (
    <Fragment>
      <div className="ui center aligned container">
        <p>
          Selected Month:{" "}
          {`${
            monthNames[selectedDate.getMonth()]
          } - ${selectedDate.getFullYear()}`}
        </p>
        <table className="ui grey inverted celled padded striped table">
          <thead>
            <tr>
              {daysShort.map((day) => (
                <th key={day}>{day}</th>
              ))}
            </tr>
          </thead>
          <tbody className="ui grey inverted celled padded striped table">
            {Object.values(calendarRows).map((cols) => {
              return (
                <tr key={cols[0].date} className={styles.tr}>
                  {cols.map((col) =>
                    col.date === todayFormatted ? (
                      <td
                        key={col.date}
                        className={styles.td}
                        onClick={() => dateClickHandler(col.date)}
                      >
                        {col.value}
                      </td>
                    ) : (
                      <td
                        key={col.date}
                        className={styles.td}
                        onClick={() => dateClickHandler(col.date)}
                      >
                        {col.value}
                      </td>
                    )
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className={styles.button_div}>
          <button
            className="ui icon left labeled grey button"
            onClick={getPrevMonth}
          >
            Prev
            <i aria-hidden="true" class="left arrow icon"></i>
          </button>
          <button
            className="ui icon right labeled grey button"
            onClick={getNextMonth}
          >
            <i aria-hidden="true" class="right arrow icon"></i>
            Next
          </button>
        </div>
      </div>
    </Fragment>
  );
}
