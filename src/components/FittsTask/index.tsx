import * as React from "react";
import {} from "./utils";

window.trials = [];
window.trialCount = 0;

const l2 = (a, b) =>
  (b[1] - a[1]) * (b[1] - a[1]) + (b[0] - a[0]) * (b[0] - a[0]);

const Task = () => {
  const ref = React.useRef(null);
  const tunneling = React.useRef(false);
  const startTime = React.useRef(null);
  const endTime = React.useRef(null);
  const lastCircle = React.useRef(null);

  const incrementTrial = () => {
    console.log("Trials:", window.trials);
    window.trialCount += 1;
  };

  const render = () => {
    const d = new Date();
    startTime.current = d;

    const enterCircle = (circle, init) => {
      const r = 3.5 + 2 * (Math.random() - 0.5);
      const w = 2 * r;
      console.log("W:", w.toFixed(2));

      if (init) {
        circle
          .transition()
          .duration(500)
          .ease(d3.easeElasticOut)
          .attr("r", r)
          .attr("pointer-events", "auto");
      } else {
        circle
          .attr("r", r)
          .attr("pointer-events", "auto")
          .style("fill", "white");
        circle
          .transition()
          .duration(2000)
          .ease(d3.easeExpOut)
          .style("fill", "red");
      }
    };

    const exitCircle = (circle, escape) => {
      circle.attr("pointer-events", "none");

      if (escape) {
        circle
          .interrupt()
          .transition()
          .duration(500)
          .ease(d3.easeExpOut)
          .attr("r", 0);
      }
    };

    d3.select("svg").selectAll("*").remove();
    d3.select(window).on("keydown", ({ code }) => {
      if (code === "Escape") {
        console.log("End task.");
        tunneling.current = false;
        endTrial(true);
        exitCircle(leftCircle, true);
        exitCircle(rightCircle, true);
        console.log(window.trials);
      }
    });

    const startPoint = [10, (Math.random() - 0.5) * 15 + 25];
    const endPoint = [90, (Math.random() - 0.5) * 15 + 25];

    console.log("D:", Math.sqrt(l2(startPoint, endPoint)).toFixed(3));

    const handleMouseover = (event) => {
      lastCircle.current = event.target.id;

      if (tunneling.current) {
        console.log(`Made it ${lastCircle.current}!`);

        endTrial(false);
        incrementTrial();
        render();
      } else {
        console.log("Started.");
        tunneling.current = true;
        render();
      }

      exitCircle(
        event.target.id === "left"
          ? leftCircle
          : event.target.id === "right"
          ? rightCircle
          : null,
        false
      );
    };

    const leftCircle = d3
      .select(ref.current)
      .append("circle")
      .attr("id", "left")
      .attr("cx", startPoint[0])
      .attr("cy", startPoint[1])
      .attr("r", 0)
      .attr("fill", "red")
      .attr("pointer-events", "none")
      .on("mouseover", handleMouseover);

    const rightCircle = d3
      .select(ref.current)
      .append("circle")
      .attr("id", "right")
      .attr("cx", endPoint[0])
      .attr("cy", endPoint[1])
      .attr("r", 0)
      .attr("fill", "red")
      .attr("pointer-events", "none")
      .on("mouseover", handleMouseover);

    if (lastCircle.current === "right") {
      enterCircle(leftCircle, false);
    } else if (lastCircle.current === "left") {
      enterCircle(rightCircle, false);
    } else {
      ~~(Math.random() * 2)
        ? enterCircle(leftCircle, true)
        : enterCircle(rightCircle, true);
    }
  };

  const endTrial = (escaped) => {
    const d = new Date();
    endTime.current = d;
    const delta = endTime.current - startTime.current;
    if (!escaped) {
      console.log(`Took ${delta / 1000} seconds.`);
      window.trials.push(delta / 1000);
    } else {
      window.trials.push("x");
    }
  };

  React.useEffect(() => {
    incrementTrial();
    render();
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
