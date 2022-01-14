import { React, Fragment, useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
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
    setDate(date);
    setShow(true);
    setId(
      events[events.length - 1].id == undefined
        ? 1
        : events[events.length - 1].id + 1
    );
    //console.log(date);
  };

  const [show, setShow] = useState(false);
  const [date, setDate] = useState("1");
  const [id, setId] = useState(1);
  const [events, setEvents] = useState([]);
  const router = useRouter();

  useEffect(() => {
    async function getEvents() {
      const res = await fetch("/getEvents");
      const data = await res.json();
      setEvents([...data]);
    }
    getEvents();
  }, [show]);

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
                            {Object.values(checkForEvents(col.date)).map(
                              (ev) => {
                                return (
                                  <p
                                    onClick={() =>
                                      router.push(`/Events/${ev.id}`)
                                    }
                                    key={"p" + ev.id}
                                    className={styles.p}
                                  >
                                    {ev.title + " - time: " + ev.time}
                                  </p>
                                );
                              }
                            )}
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
                                <p
                                  onClick={() =>
                                    router.push(`/Events/${ev.id}`)
                                  }
                                  key={"p" + ev.id}
                                  className={styles.p}
                                >
                                  {ev.title + " - time: " + ev.time}
                                </p>
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
      <div className={styles.form}>
        <Form
          show={show}
          date={date}
          id={id}
          onClose={() => setShow(false)}
          onSubmit={() => setShow(false)}
        />
      </div>
    </>
  );
}
