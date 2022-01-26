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

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [time, setTime] = useState("");

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
      document.getElementById("title_val").removeAttribute("hidden");
      isValid = false;
    } else if (!document.getElementById("title_val").hasAttribute("hidden")) {
      document.getElementById("title_val").setAttribute("hidden", "");
    }

    if (desc == "") {
      document.getElementById("desc_val").removeAttribute("hidden");
      isValid = false;
    } else if (!document.getElementById("desc_val").hasAttribute("hidden")) {
      document.getElementById("desc_val").setAttribute("hidden", "");
    }

    const expression = /^([01]?[0-9]|2[0-3]):[0-5][0-9](am|AM|pm|PM)?$/;
    const regex = new RegExp(expression);

    if (!time.match(regex)) {
      document.getElementById("time_val").removeAttribute("hidden");
      isValid = false;
    } else if (!document.getElementById("time_val").hasAttribute("hidden")) {
      document.getElementById("time_val").setAttribute("hidden", "");
    }

    if (selected.length == 0) {
      document.getElementById("participants_val").removeAttribute("hidden");
      isValid = false;
    } else if (
      !document.getElementById("participants_val").hasAttribute("hidden")
    ) {
      document.getElementById("participants_val").setAttribute("hidden", "");
    }

    return isValid;
  };

  const addEvent = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return false;
    }

    const participants = selected.map((x) => x.value);
    const date = props.date;
    const id = props.id;
    const res = await fetch("/addEvent", {
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
    return true;
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
            <form
              className="ui form"
              onSubmit={async (ev) => {
                if (await addEvent(ev)) {
                  props.onClose();
                }
              }}
            >
              <br />
              <div>
                <label id="title_val" className={styles.required} hidden>
                  This field is required!
                </label>
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
                <label id="desc_val" className={styles.required} hidden>
                  This field is required!
                </label>
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
                <label id="time_val" className={styles.required} hidden>
                  This field is required and should be formated like xx:xx (can
                  be followed by am/pm)!
                </label>
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
                <label id="participants_val" className={styles.required} hidden>
                  This field is required!
                </label>
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
