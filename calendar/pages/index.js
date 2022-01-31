import { useState } from "react";
import Calendar from "../components/Calendar";
import Form from "../components/Form";

export default function Home() {
  const [show, setShow] = useState(false);
  const [date, setDate] = useState("1");
  const [id, setId] = useState(1);

  return (
    <>
      <div>
        <Calendar
          show={show}
          onShowChange={(show) => setShow(show)}
          onDateChange={(date) => setDate(date)}
          onIdChange={(id) => setId(id)}
        />
      </div>
      <div>
        <Form show={show} date={date} id={id} onClose={() => setShow(false)} />
      </div>
    </>
  );
}
