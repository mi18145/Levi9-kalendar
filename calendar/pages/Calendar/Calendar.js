import { React, Fragment, useState, useEffect } from "react";
import { useRouter } from "next/router";
import Form from "../Form";
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

  const [show, setShow] = useState(false);
  const [date, setDate] = useState("1");
  const [events, setEvents] = useState([]);

  useEffect(() => {
    async function getEvents() {
      const res = await fetch("/events");
      const data = await res.json();
      console.log(data);
      setEvents([...data]);
    }
    getEvents();
  }, []);

  const checkForEvents = (date) => {
    const event_list = [];
    for (let ev of events) {
      if (ev.date == date) {
        event_list.push(ev.title);
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
                      <td
                        key={col.date}
                        className={styles.td}
                        onClick={() => {
                          dateClickHandler(col.date);
                          setShow(true);
                          setDate(col.date);
                        }}
                      >
                        <div className="ui inverted grey clearing segment">
                          <div>
                            <h5 className="ui inverted dividing header">
                              {col.value}
                            </h5>
                          </div>
                          <div>
                            {checkForEvents(col.date).map((ev) => {
                              return <p className={styles.p}>{ev}</p>;
                            })}
                          </div>
                        </div>
                      </td>
                    ) : (
                      <td
                        key={col.date}
                        className={styles.td}
                        onClick={() => {
                          dateClickHandler(col.date);
                          setShow(true);
                          setDate(col.date);
                        }}
                      >
                        <div className="ui inverted grey clearing segment">
                          <div>
                            <h5 className="ui inverted dividing header">
                              {col.value}
                            </h5>
                          </div>
                          <div>
                            {checkForEvents(col.date).map((ev) => {
                              return <p className={styles.p}>{ev}</p>;
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
      <div className={styles.form}>
        <Form show={show} date={date} onClose={() => setShow(false)} />
      </div>
    </>
  );
}
