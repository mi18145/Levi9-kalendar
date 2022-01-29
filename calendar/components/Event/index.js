import { React, useState, useEffect } from "react";
import { useRouter } from "next/router";
import "semantic-ui-css/semantic.min.css";
import styles from "./Event.module.css";

export default function Event(params) {
  const router = useRouter();
  const [event, setEvent] = useState({
    id: params.event_id,
    title: "",
    description: "",
    date: "",
    time: "",
    participants: [],
  });
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    if (params.event_id != undefined) {
      async function getParticipants() {
        const res = await fetch("/participants");
        const data = await res.json();
        setParticipants(data.map((u) => u.name));
      }
      getParticipants();
    }
  }, [params.event_id]);

  useEffect(() => {
    async function getEvents() {
      if (params.event_id != undefined) {
        const res = await fetch(`/getEventById/${params.event_id}`);
        const data = await res.json();
        setEvent(data);
      }
    }
    getEvents();
  }, [params.event_id]);

  const deleteEvent = async () => {
    const res = await fetch("/event", {
      body: JSON.stringify({ id: event.id }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "DELETE",
    });

    const result = await res.json();
    router.push("/");
  };

  return (
    <>
      <div className={styles.center}>
        <div className={styles.container}>
          <h2 className={styles.bold + " ui inverted centered dividing header"}>
            {event.title}
          </h2>
          <h3 className={styles.header + " ui inverted centered  header"}>
            Date: {event.date}
            <br />
            Time: {event.time}
          </h3>
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
                    return participants[index - 1];
                  }
                })
                .join(", ")}
            </p>
          </div>
          <button
            className="negative ui right floated button"
            onClick={deleteEvent}
          >
            Delete event
          </button>
        </div>
      </div>
    </>
  );
}
