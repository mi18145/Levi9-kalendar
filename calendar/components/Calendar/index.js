import { React, Fragment, useState, useEffect } from "react";
import { useRouter } from "next/router";
import Form from "../Form";
import "semantic-ui-css/semantic.min.css";
import styles from "./Calendar.module.css";

export default function Calendar(props) {
  //start of useCalendar
  const daysShort = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const today = new Date();
  const todayFormatted = `${today.getDate()}-${
    today.getMonth() + 1
  }-${today.getFullYear()}`;
  const daysInWeek = [1, 2, 3, 4, 5, 6, 0];
  const [selectedDate, setSelectedDate] = useState(today);
  const selectedMonthLastDate = new Date(
    selectedDate.getFullYear(),
    selectedDate.getMonth() + 1,
    0
  );
  const prevMonthLastDate = new Date(
    selectedDate.getFullYear(),
    selectedDate.getMonth(),
    0
  );
  const daysInMonth = selectedMonthLastDate.getDate();
  const firstDayInMonth = new Date(
    selectedDate.getFullYear(),
    selectedDate.getMonth(),
    1
  ).getDay();
  const startingPoint = daysInWeek.indexOf(firstDayInMonth) + 1;
  let prevMonthStartingPoint =
    prevMonthLastDate.getDate() - daysInWeek.indexOf(firstDayInMonth) + 1;
  let currentMonthCounter = 1;
  let nextMonthCounter = 1;
  const rows = 6;
  const cols = 7;
  const calendarRows = {};

  for (let i = 1; i < rows + 1; i++) {
    for (let j = 1; j < cols + 1; j++) {
      if (!calendarRows[i]) {
        calendarRows[i] = [];
      }

      if (i === 1) {
        if (j < startingPoint) {
          calendarRows[i] = [
            ...calendarRows[i],
            {
              classes: "in-prev-month",
              date: `${prevMonthStartingPoint}-${
                selectedDate.getMonth() === 0 ? 12 : selectedDate.getMonth()
              }-${
                selectedDate.getMonth() === 0
                  ? selectedDate.getFullYear() - 1
                  : selectedDate.getFullYear()
              }`,
              value: prevMonthStartingPoint,
            },
          ];
          prevMonthStartingPoint++;
        } else {
          calendarRows[i] = [
            ...calendarRows[i],
            {
              classes: "",
              date: `${currentMonthCounter}-${
                selectedDate.getMonth() + 1
              }-${selectedDate.getFullYear()}`,
              value: currentMonthCounter,
            },
          ];
          currentMonthCounter++;
        }
      } else if (i > 1 && currentMonthCounter < daysInMonth + 1) {
        calendarRows[i] = [
          ...calendarRows[i],
          {
            classes: "",
            date: `${currentMonthCounter}-${
              selectedDate.getMonth() + 1
            }-${selectedDate.getFullYear()}`,
            value: currentMonthCounter,
          },
        ];
        currentMonthCounter++;
      } else {
        calendarRows[i] = [
          ...calendarRows[i],
          {
            classes: "in-next-month",
            date: `${nextMonthCounter}-${
              selectedDate.getMonth() + 2 === 13
                ? 1
                : selectedDate.getMonth() + 2
            }-${
              selectedDate.getMonth() + 2 === 13
                ? selectedDate.getFullYear() + 1
                : selectedDate.getFullYear()
            }`,
            value: nextMonthCounter,
          },
        ];
        nextMonthCounter++;
      }
    }
  }

  const getPrevMonth = () => {
    setSelectedDate(
      (prevValue) =>
        new Date(prevValue.getFullYear(), prevValue.getMonth() - 1, 1)
    );
  };

  const getNextMonth = () => {
    setSelectedDate(
      (prevValue) =>
        new Date(prevValue.getFullYear(), prevValue.getMonth() + 1, 1)
    );
  };
  // end of useCalendar

  const [events, setEvents] = useState([]);
  const router = useRouter();

  const dateClickHandler = (date) => {
    props.onDateChange(date);
    props.onShowChange(true);
    props.onIdChange(
      events[events.length - 1].id == undefined
        ? 1
        : events[events.length - 1].id + 1
    );
  };

  useEffect(() => {
    async function getEvents() {
      const res = await fetch("/event", {
        headers: {
          "Content-Type": "application/json",
        },
        method: "GET",
      });
      const data = await res.json();
      setEvents([...data]);
    }
    getEvents();
  }, [props.show]);

  const checkForEvents = (date) => {
    const event_list = [];
    for (let ev of events) {
      if (ev.date == date) {
        event_list.push(ev);
      }
    }
    return event_list;
  };

  return (
    <>
      <div className="ui center aligned container">
        <h2 className="ui grey header" className={styles.date}>
          {" "}
          Selected Month:{" "}
          {`${
            monthNames[selectedDate.getMonth()]
          } - ${selectedDate.getFullYear()}`}
        </h2>
        <table className="ui grey inverted celled very compact table">
          <thead>
            <tr>
              {daysShort.map((day) => (
                <th key={day}>{day}</th>
              ))}
            </tr>
          </thead>
          <tbody className="ui grey inverted celled very compact table">
            {Object.values(calendarRows).map((cols) => {
              return (
                <tr key={cols[0].date} className={styles.tr + " top aligned"}>
                  {cols.map((col) =>
                    col.date === todayFormatted ? (
                      <td key={col.date} className={styles.today}>
                        <div
                          className={
                            "ui inverted grey segment" + styles.no_padding
                          }
                        >
                          <div
                            onClick={() => {
                              dateClickHandler(col.date);
                            }}
                            className={styles.h_div}
                          >
                            <h5 className="ui inverted dividing header">
                              {col.value}
                            </h5>
                          </div>
                          <div>
                            {checkForEvents(col.date).map((ev) => {
                              return (
                                <a
                                  href={`/Events/${ev.id}`}
                                  key={ev.id}
                                  className={styles.a}
                                >
                                  <div className={styles.a_div}>
                                    {ev.time + " – " + ev.title}
                                  </div>
                                </a>
                              );
                            })}
                          </div>
                        </div>
                      </td>
                    ) : (
                      <td key={col.date} className={styles.td}>
                        <div
                          className={
                            "ui inverted grey segment" + styles.no_padding
                          }
                        >
                          <div
                            onClick={() => {
                              dateClickHandler(col.date);
                            }}
                            className={styles.h_div}
                          >
                            <h5 className="ui inverted dividing header">
                              {col.value}
                            </h5>
                          </div>
                          <div>
                            {checkForEvents(col.date).map((ev) => {
                              return (
                                <a
                                  href={`/Events/${ev.id}`}
                                  key={ev.id}
                                  className={styles.a}
                                >
                                  <div className={styles.a_div}>
                                    {ev.time + " – " + ev.title}
                                  </div>
                                </a>
                              );
                            })}
                          </div>
                        </div>
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
            <i aria-hidden="true" className="left arrow icon"></i>
          </button>
          <button
            className="ui icon right labeled grey button"
            onClick={getNextMonth}
          >
            <i aria-hidden="true" className="right arrow icon"></i>
            Next
          </button>
        </div>
      </div>
    </>
  );
}
