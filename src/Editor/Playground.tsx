import React, { DragEvent, useEffect, useRef } from "react";
import { useRecoilState } from "recoil";
import PlaygroundAtom from "../Recoil/Atoms/PlaygroundAtom";

function Playground() {
  const [{ elements }, setPlaygroundData] = useRecoilState(PlaygroundAtom);
  const canvasRef = useRef<HTMLCanvasElement>();
  const containerRef = useRef<HTMLDivElement>();

  function handleDrop(e: DragEvent<HTMLCanvasElement>) {
    let JSONdata = e.dataTransfer.getData("text/plain");

    let data = JSON.parse(JSONdata);
    console.log(data, e);

    //setCanvas();

    const context = canvasRef.current.getContext("2d");
    context.imageSmoothingEnabled = false;
    context.fillStyle = data.style.background;

    context.fillRect(e.clientX, e.clientY, data.style.width, data.style.height);
    console.log(canvasRef.current);

    setPlaygroundData((prev: any) => {
      return {
        ...prev,
        elements: [
          ...prev.elements,
          {
            ...data,
            style: {
              ...data.style,
              x: e.clientX,
              y: e.clientY,
            },
          },
        ],
      };
    });
  }

  function setCanvas() {
    // const url: CanvasImageSource = canvasRef.current.toDataURL() as any;
    //console.log(this);
    let containerWidth = containerRef.current.offsetWidth - 3;
    let containerHeight = containerRef.current.offsetHeight - 3;

    if (canvasRef.current.width < containerWidth)
      canvasRef.current.width = containerWidth;

    if (canvasRef.current.height < containerHeight)
      canvasRef.current.height = containerHeight;
    // let img = document.createElement("img");
    // img.onload = () => {
    //   canvasRef.current.getContext("2d").drawImage(img, 0, 0);
    // };
    // img.src = url as any;
  }

  function reDraw(ctx) {
    elements.forEach((el) => {
      ctx.imageSmoothingEnabled = false;
      ctx.fillStyle = el.style.background;
      ctx.fillRect(el.style.x, el.style.y, el.style.width, el.style.height);
    });
  }

  useEffect(() => {
    function resizeHandler() {
      setCanvas();
      const ctx = canvasRef.current.getContext("2d");
      reDraw(ctx);
    }
    window.addEventListener("resize", resizeHandler);
    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
  }, [elements]);

  useEffect(() => {
    setCanvas();
  }, []);

  return (
    <div className="playground" ref={containerRef}>
      <canvas
        ref={canvasRef}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onDragEnd={handleDrop}
      ></canvas>
    </div>
  );
}

export default Playground;
