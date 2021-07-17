import React, { DragEvent } from "react";

const shapes = [
  {
    label: "Rectange",
    key: "rectangle",
    style: {
      width: 100,
      height: 80,
      x: 10,
      y: 10,
      background: "white",
    },
  },
  {
    label: "Circle",
    key: "circle",
    style: {
      borderRadius: "50%",
      width: 100,
      height: 100,
      x: 10,
      y: 10,
      background: "white",
    },
  },
  {
    label: "Line",
    key: "line",
    style: {
      width: 200,
      height: 2,
      x: 10,
      y: 10,
      background: "black",
    },
  },
];

const noop = () => {};

function Sidebar() {
  const handleDragStart = (e: DragEvent<HTMLDivElement>, sh: any) => {
    e.dataTransfer.dropEffect = "copy";
    e.dataTransfer?.setData("text/plain", JSON.stringify(sh));
  };

  const download = () => {};

  return (
    <div className="sidebar">
      <button onClick={download}>download</button>
      <h5>Shapes</h5>
      <div className="shapes">
        {shapes.map((sh) => (
          <div
            key={sh.key}
            onDrop={(e) => console.log(e)}
            className={`shape ${sh.key}`}
            draggable={true}
            onDragStart={(e: DragEvent<HTMLDivElement>) => {
              handleDragStart(e, sh);
            }}
          ></div>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
