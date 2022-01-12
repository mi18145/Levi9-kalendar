import { React, useState, useEffect } from "react";
import "semantic-ui-css/semantic.min.css";
import styles from "../../styles/Form.module.css";
import { MultiSelect } from "react-multi-select-component";

export default function Form(props) {
  if (!props.show) {
    return null;
  }

  const [participants, setParticipants] = useState([]);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    async function getParticipants() {
      const res = await fetch("/participants");
      const data = await res.json();
      setParticipants(data.map((u) => ({ label: u.name, value: u.id })));
    }
    getParticipants();
  }, []);

  const addEvent = async (event) => {
    event.preventDefault();

    const title = event.target.title.value;
    const description = event.target.description.value;
    const time = event.target.time.value;
    const participants = selected.map((x) => x.value);
    console.log(selected);
    const res = await fetch("/event", {
      body: JSON.stringify({
        title,
        description,
        time,
        participants,
        day,
        month,
        year,
      }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    const result = await res.json();
    console.log(result);
    onSuccess(result);
  };

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [time, setTime] = useState("");
  return (
    <>
      <div onClick={props.onClose} className={styles.center}>
        <div
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <div className={styles.title}>
            <h1>Add new event</h1>
          </div>
          <div className={styles.form}>
            <form className="ui form">
              <br />
              <div>
                <label className={styles.label}>Title: </label>
                <input
                  type="text"
                  placeholder="Type title here..."
                  name="title"
                  id="title"
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <br />
              <div>
                <label className={styles.label}>Description: </label>
                <textarea
                  type="text"
                  placeholder="Type description here..."
                  name="description"
                  id="description"
                  onChange={(e) => setDesc(e.target.value)}
                ></textarea>
              </div>
              <br />
              <div>
                <label className={styles.label}>Time: </label>
                <input
                  type="text"
                  placeholder={props.date}
                  name="time"
                  id="time"
                  onChange={(e) => setTime(e.target.value)}
                />
              </div>
              <br />
              <div>
                <label className={styles.label}>Choose participants: </label>
                <MultiSelect
                  options={participants}
                  value={selected}
                  onChange={setSelected}
                  labelledBy="Select"
                />
              </div>
              <br />
              <div className="ui right aligned container">
                <button
                  type="submit"
                  onClick={props.onClose}
                  className="ui button"
                >
                  Add event
                </button>
                <button onClick={props.onClose} className="ui button">
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
