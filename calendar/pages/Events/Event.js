import { React, useState, useEffect } from "react";
import "semantic-ui-css/semantic.min.css";
import styles from "../../styles/Event.module.css";

export default function Event(props) {
  const [event, setEvent] = useState({
    id: 0,
    title: "",
    description: "",
    date: "",
    time: "",
    participants: [],
  });

  const [participants, setParticipants] = useState([]);
  useEffect(() => {
    if (props.event_id != undefined) {
      async function getParticipants() {
        const res = await fetch("/participants");
        const data = await res.json();
        setParticipants(data.map((u) => ({ label: u.name, value: u.id })));
      }
      getParticipants();
    }
  }, [props.event_id]);

  useEffect(() => {
    async function getEvents() {
      if (props.event_id != undefined) {
        const res = await fetch(`/getEvent/${props.event_id}`);
        const data = await res.json();
        setEvent(...data);
      }
    }
    getEvents();
  }, [props.event_id]);

  return (
    <>
      <div className={styles.center}>
        <div className={styles.container}>
          <h2 className="ui inverted centered header">
            {event.date} - {event.time} : {event.title}
          </h2>
          <label className={styles.label}>Description:</label>
          <div className="ui container segment">
            <p>{event.description}</p>
          </div>
          <label className={styles.label}>Participants:</label>
          <div className="ui container segment">
            <p>
              {event.participants
                .map((index) => {
                  if (participants[index - 1] != undefined) {
                    return participants[index - 1].label;
                  }
                })
                .join(", ")}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
