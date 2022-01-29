import { React, useState, useEffect } from "react";
import "semantic-ui-css/semantic.min.css";
import styles from "./Form.module.css";
import { MultiSelect } from "react-multi-select-component";

export default function Form(props) {
  if (!props.show) {
    return null;
  }

  const [participants, setParticipants] = useState([]);
  const [selected, setSelected] = useState([]);

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [time, setTime] = useState("");

  const [titleVal, setTitleVal] = useState(false);
  const [descVal, setDescVal] = useState(false);
  const [timeVal, setTimeVal] = useState(false);
  const [selectedVal, setSelectedVal] = useState(false);

  useEffect(() => {
    async function getParticipants() {
      const res = await fetch("/participants");
      const data = await res.json();
      setParticipants(data.map((u) => ({ label: u.name, value: u.id })));
    }
    getParticipants();
  }, []);

  const validateForm = () => {
    let isValid = true;
    if (title == "") {
      setTitleVal(true);
      isValid = false;
    } else {
      setTitleVal(false);
    }

    if (desc == "") {
      setDescVal(true);
      isValid = false;
    } else {
      setDescVal(false);
    }

    const expression = /^([01]?[0-9]|2[0-3]):[0-5][0-9](am|AM|pm|PM)?$/;
    const regex = new RegExp(expression);

    if (!time.match(regex)) {
      setTimeVal(true);
      isValid = false;
    } else {
      setTimeVal(false);
    }

    if (selected.length == 0) {
      setSelectedVal(true);
      isValid = false;
    } else {
      setSelectedVal(false);
    }

    return isValid;
  };

  const addEvent = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    const participants = selected.map((x) => x.value);
    const date = props.date;
    const id = props.id;
    const res = await fetch("/event", {
      body: JSON.stringify({
        id,
        title,
        description: desc,
        date,
        time,
        participants,
      }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    const result = await res.json();
    props.onClose();
  };

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
            <form className="ui form" onSubmit={addEvent}>
              <br />
              <div>
                {titleVal ? (
                  <label className={styles.required}>
                    This field is required!
                  </label>
                ) : null}
                <br />
                <label className={styles.label}>Title: </label>
                <input
                  type="text"
                  placeholder="Type title here..."
                  name="title"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <br />
              <div>
                {descVal ? (
                  <label className={styles.required}>
                    This field is required!
                  </label>
                ) : null}
                <br />
                <label className={styles.label}>Description: </label>
                <textarea
                  type="text"
                  placeholder="Type description here..."
                  name="description"
                  id="description"
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                ></textarea>
              </div>
              <br />
              <div>
                {timeVal ? (
                  <label className={styles.required}>
                    This field is required and should be formated like xx:xx
                    (can be followed by am/pm)!
                  </label>
                ) : null}
                <br />
                <label className={styles.label}>Time: </label>
                <input
                  type="text"
                  placeholder={props.date}
                  name="time"
                  id="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
              </div>
              <br />
              <div>
                {selectedVal ? (
                  <label id="participants_val" className={styles.required}>
                    This field is required!
                  </label>
                ) : null}
                <br />
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
                <button type="submit" className="ui button">
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
