import { React, useState } from "react";
import "semantic-ui-css/semantic.min.css";
import styles from "../../styles/Form.module.css";

export default function Form(props) {
  if (!props.show) {
    return null;
  }
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
          <div className="ui center aligned container" className={styles.title}>
            <h1>Add new event</h1>
          </div>
          <div className={styles.form}>
            <form className="ui inverted form">
              <br />
              <div className="field">
                <label>Title: </label>
                <input
                  type="text"
                  placeholder="Type title here..."
                  name="title"
                  id="title"
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <br />
              <div className="field">
                <label>Description: </label>
                <textarea
                  type="text"
                  placeholder="Type description here..."
                  name="description"
                  id="description"
                  onChange={(e) => setDesc(e.target.value)}
                ></textarea>
              </div>
              <br />
              <div className="field">
                <label>Time: </label>
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
                <label>Choose participants: </label>
                {/* <MultiSelect
                  options={ucesnici}
                  value={selected}
                  onChange={setSelected}
                  labelledBy="Select"
                /> */}
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
                <button
                  onClick={() => {
                    props.onClose;
                  }}
                  className="ui button"
                >
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
