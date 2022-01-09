import React from "react";
import Calendar from "../Calendar";

import styles from "../../styles/App.module.css";

export default function App() {
  return (
    <>
      <div className={styles.center}>
        <Calendar />
      </div>
    </>
  );
}
