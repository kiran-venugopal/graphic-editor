import React, {
  DragEvent,
  LegacyRef,
  MouseEvent,
  MutableRefObject,
  useEffect,
  useRef,
} from "react";
import { useRecoilState } from "recoil";
import PlaygroundAtom from "../Recoil/Atoms/PlaygroundAtom";
import {
  drawBorder,
  drawElement,
  findMouseOveredElement,
  moveElement,
  uniqueID,
} from "./functions/canvasOperations";

function Playground() {
  const [{ elements }, setPlaygroundData] = useRecoilState(PlaygroundAtom);
  const canvasRef = useRef<HTMLCanvasElement>();
  const containerRef = useRef<HTMLDivElement>();
  let mouseOveredElId: string | undefined;
  let movingElement: any;

  function handleDrop(e: DragEvent<HTMLCanvasElement>) {
    let JSONdata = e.dataTransfer.getData("text/plain");

    let data = JSON.parse(JSONdata);
    console.log(data, e);

    //setCanvas();

    const context = canvasRef.current?.getContext("2d");
    if (context) {
      context.imageSmoothingEnabled = false;
      context.fillStyle = data.background;
      context.fillRect(e.clientX, e.clientY, data.width, data.height);
    }

    console.log(canvasRef.current);

    setPlaygroundData((prev: any) => {
      return {
        ...prev,
        elements: [
          ...prev.elements,
          {
            ...data,
            id: uniqueID(),
            x: e.clientX,
            y: e.clientY,
          },
        ],
      };
    });
  }

  function setCanvas() {
    // const url: CanvasImageSource = canvasRef.current.toDataURL() as any;
    //console.log(this);
    let containerWidth = (containerRef.current?.offsetWidth || 0) - 3;
    let containerHeight = (containerRef.current?.offsetHeight || 0) - 3;

    if (
      canvasRef.current?.width &&
      (canvasRef.current.width || 0 < containerWidth)
    )
      canvasRef.current.width = containerWidth;

    if (
      canvasRef.current?.height &&
      (canvasRef.current.height || 0 < containerHeight)
    )
      canvasRef.current.height = containerHeight;
    // let img = document.createElement("img");
    // img.onload = () => {
    //   canvasRef.current.getContext("2d").drawImage(img, 0, 0);
    // };
    // img.src = url as any;
  }

  function reDraw(ctx: CanvasRenderingContext2D) {
    console.log("redrawing..");
    ctx.clearRect(
      0,
      0,
      canvasRef.current?.width || 0,
      canvasRef.current?.height || 0
    );
    elements.forEach((el: any) => {
      drawElement(ctx, el);
    });
  }

  useEffect(() => {
    function resizeHandler() {
      setCanvas();
      const ctx = canvasRef.current?.getContext("2d");
      if (ctx) reDraw(ctx);
    }
    window.addEventListener("resize", resizeHandler);
    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
  }, [elements]);

  useEffect(() => {
    setCanvas();
  }, []);

  useEffect(() => {
    const handleMouseDown = (e: globalThis.MouseEvent): void => {
      let element = findMouseOveredElement(e.clientX, e.clientY, elements);
      console.log("mousedowned el", element, e.clientX, e.clientY);
      if (element) {
        movingElement = {
          element,
          clientX: e.clientX,
          clientY: e.clientY,
        };
      }
    };

    const handleMouseUp = () => {
      if (movingElement) {
        // console.log(movingElement);
        setPlaygroundData((prev: any) => ({
          ...prev,
          elements: [
            ...prev.elements.filter(
              (el: any) => el.id !== movingElement.element.id
            ),
            {
              ...movingElement.element,
              x: movingElement.newX,
              y: movingElement.newY,
            },
          ],
        }));
        movingElement = undefined;
      }
    };

    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [elements]);

  function handleMouseMove(e: MouseEvent<HTMLCanvasElement>) {
    let element = findMouseOveredElement(e.clientX, e.clientY, elements);
    const ctx = canvasRef.current?.getContext("2d");

    if (movingElement && ctx && canvasRef.current) {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      let updatedData = moveElement(
        e.clientX,
        e.clientY,
        movingElement,
        elements,
        ctx
      );
      if (updatedData) {
        movingElement = {
          ...movingElement,
          ...updatedData,
        };
      }
    } else if (canvasRef.current && mouseOveredElId !== element?.id) {
      if (ctx) {
        if (element?.id) {
          if (mouseOveredElId) reDraw(ctx);
          drawBorder(ctx, element.x, element.y, element.width, element.height);
        } else reDraw(ctx);
      }
      mouseOveredElId = element?.id;
    }
  }

  return (
    <div className="playground" ref={containerRef as LegacyRef<HTMLDivElement>}>
      <canvas
        ref={canvasRef as LegacyRef<HTMLCanvasElement>}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onDragEnd={handleDrop}
        onMouseMove={handleMouseMove}
      ></canvas>
    </div>
  );
}

export default Playground;
