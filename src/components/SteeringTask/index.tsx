import * as React from "react";
import { svgPath, bezierCommandCalc } from "./utils";

window.trials = [];
window.trialCount = 0;

const Task = () => {
  const ref = React.useRef();
  const tunneling = React.useRef(false);
  const startTime = React.useRef();
  const endTime = React.useRef();

  const renderPath = () => {
    tunneling.current = false;
    console.log("Trials:", window.trials);
    console.log(
      "Success rate:",
      (window.trials.length / window.trialCount).toFixed(2)
    );
    window.trialCount += 1;

    d3.select("svg").selectAll("*").remove();

    const startPoint = [10, (Math.random() - 0.5) * 15 + 25];
    const endPoint = [90, (Math.random() - 0.5) * 15 + 25];

    const points = [
      startPoint,
      [(Math.random() - 0.5) * 10 + 30, (Math.random() - 0.5) * 15 + 25],
      [(Math.random() - 0.5) * 10 + 50, (Math.random() - 0.5) * 15 + 25],
      [(Math.random() - 0.5) * 10 + 70, (Math.random() - 0.5) * 15 + 25],
      endPoint,
    ];

    const path = d3
      .select(ref.current)
      .append("path")
      .attr("d", svgPath(points, bezierCommandCalc))
      .attr("fill", "none")
      .attr("stroke", "grey")
      .attr("stroke-width", 7)
      .attr("stroke-linecap", "round")
      .style("opacity", 0)
      .on("mouseout", function () {
        if (tunneling.current) {
          // console.log("Whoops, left path. Resetting.");
          // tunneling.current = false;

          path.transition().attr("stroke", "black").style("opacity", 0);
          startCircle.transition().style("opacity", 0);
          endCircle.transition().style("opacity", 0).on("end", renderPath);

          // setTrials((t) => [...t, "x"]);
        }
      });

    path.transition().duration(500).style("opacity", 1);

    const startCircle = d3
      .select(ref.current)
      .append("circle")
      .attr("cx", startPoint[0])
      .attr("cy", startPoint[1])
      .attr("r", 3.5)
      .attr("fill", "red")
      .style("opacity", 0)
      .on("mouseover", () => {
        tunneling.current = true;
        console.log("Started.");

        const d = new Date();
        startTime.current = d;

        startCircle
          .transition()
          .duration(500)
          .ease(d3.easeBackOut)
          .attr("r", 5);

        startCircle
          .transition()
          .duration(250)
          .delay(500)
          .ease(d3.easeCircleIn)
          .attr("r", 0);
      });

    startCircle.transition().duration(500).style("opacity", 1);

    const endCircle = d3
      .select(ref.current)
      .append("circle")
      .attr("cx", endPoint[0])
      .attr("cy", endPoint[1])
      .attr("r", 3.5)
      .attr("fill", "red")
      .attr("opacity", 0)
      .on("mouseover", () => {
        if (tunneling.current) {
          console.log("Made it!");
          tunneling.current = false;

          endTrial(endCircle);

          setTimeout(renderPath, 1000);
        }
      });

    endCircle.transition().duration(500).style("opacity", 1);
  };

  const endTrial = (endCircle) => {
    const d = new Date();
    endTime.current = d;

    const delta = endTime.current - startTime.current;

    console.log(`Took ${delta / 1000} seconds.`);

    window.trials.push(delta / 1000);

    endCircle.transition().duration(500).ease(d3.easeBackOut).attr("r", 5);
    endCircle
      .transition()
      .duration(250)
      .delay(500)
      .ease(d3.easeCircleIn)
      .attr("r", 0);
    endCircle.transition().delay(750).style("opacity", 0.5);
  };

  React.useEffect(() => {
    renderPath();
  }, []);

  return (
    <svg
      ref={ref}
      viewBox="0 0 100 50"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      className="svg"
    ></svg>
  );
};

export default Task;
