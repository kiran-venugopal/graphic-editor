import React, { DragEvent } from "react";

const shapes = [
  {
    id: "1",
    label: "Rectange",
    type: "rectangle",
    width: 100,
    height: 80,
    x: 10,
    y: 10,
    background: "white",
  },
  {
    id: "2",
    label: "Circle",
    type: "circle",
    borderRadius: "50%",
    width: 100,
    height: 100,
    x: 10,
    y: 10,
    background: "white",
  },
  {
    id: "3",
    label: "Line",
    type: "line",
    width: 200,
    height: 2,
    x: 10,
    y: 10,
    background: "black",
  },
];

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
            key={sh.id}
            onDrop={(e) => console.log(e)}
            className={`shape ${sh.type}`}
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
