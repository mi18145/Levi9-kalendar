import { useRouter } from "next/router";
import Event from "./Event";

export default function Events() {
  const router = useRouter();
  const { id } = router.query;

  return (
    <div>
      {id}
      <Event />
    </div>
  );
}
