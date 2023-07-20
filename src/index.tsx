//
import * as React from "react";
import * as ReactDOM from "react-dom";
import "./index.scss";

import SteeringTask from "./components/SteeringTask";
import FittsTask from "./components/FittsTask";
import FittsRamp from "./components/FittsRamp";

const Application = () => {
  return (
    <div className="Application">
      <FittsTask />
    </div>
  );
};

export default Application;

ReactDOM.render(<Application />, document.getElementById("root"));
