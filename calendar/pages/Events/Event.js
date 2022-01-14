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
      <div className="ui inverted grey very padded text container segment">
        <h2 className="ui centered header">{event.title}</h2>
        <label>Description:</label>
        <div className="ui text container tight segment">
          <p>{event.description}</p>
        </div>
        <p></p>
      </div>
    </>
  );
}
