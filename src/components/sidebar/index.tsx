import Suggestions from "./suggestions";
import User from "./user";

function Sidebar() {
  return (
    <div className="p-4">
      <User username={"Sandeep"} fullName={"Sandeep Lakhiwal"} />
      <Suggestions />
    </div>
  );
}

export default Sidebar;
