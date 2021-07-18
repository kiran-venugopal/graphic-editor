export function drawBorder(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  color: string = "#4791ff",
  borderWidth = 2
) {
  ctx.imageSmoothingEnabled = true;
  ctx.strokeStyle = color;
  ctx.lineWidth = borderWidth;
  console.log("called border");

  ctx.strokeRect(x, y, width + 1, height + 1);
}

export function uniqueID() {
  // Math.random should be unique because of its seeding algorithm.
  // Convert it to base 36 (numbers + letters), and grab the first 9 characters
  // after the decimal.
  return "_" + Math.random().toString(36).substr(2, 9);
}

export function setupCanvas(canvas: HTMLCanvasElement) {
  // Get the device pixel ratio, falling back to 1.
  var dpr = window.devicePixelRatio || 1;
  // Get the size of the canvas in CSS pixels.
  var rect = canvas.getBoundingClientRect();
  // Give the canvas pixel dimensions of their CSS
  // size * the device pixel ratio.
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  var ctx = canvas.getContext("2d");
  // Scale all drawing operations by the dpr, so you
  // don't have to worry about the difference.
  if (ctx) ctx.scale(dpr, dpr);
  return ctx;
}

export function findMouseOveredElement(
  clientX: number,
  clientY: number,
  elements: any[] = []
) {
  let foundEl;
  for (let i = 0; i < elements.length; i++) {
    let currentEl = elements[i];
    if (currentEl.x === clientX && currentEl.y === clientY) {
      // console.log("same start");
      foundEl = currentEl;
      break;
    }

    let startX = currentEl.x;
    let startY = currentEl.y;

    let endX = startX + currentEl.width;
    let endY = startY + currentEl.height;

    if (
      startX < clientX &&
      clientX < endX &&
      startY < clientY &&
      clientY < endY
    ) {
      // console.log("inside x", startX, endX, clientX);
      foundEl = currentEl;
      break;
    }
  }
  return foundEl;
}

export function drawElement(ctx: CanvasRenderingContext2D, element: any) {
  ctx.imageSmoothingEnabled = false;
  ctx.fillStyle = element.background;

  ctx.fillRect(element.x, element.y, element.width, element.height);
}

export function moveElement(
  clientX: number,
  clientY: number,
  element: any,
  allElements: any[],
  context: CanvasRenderingContext2D
) {
  let updatedElement;
  //console.log(element, allElements);
  //console.log(element.clientX, element.clientY);

  for (let i = 0; i < allElements.length; i++) {
    if (element.element.id === allElements[i].id) {
      let deltaX = clientX - element.clientX;
      let deltaY = clientY - element.clientY;
      // console.log(clientX, clientY);
      let newX = element.element.x + deltaX;
      let newY = element.element.y + deltaY;

      updatedElement = {
        element: element.element,
        newX,
        newY,
      };

      drawElement(context, {
        ...element.element,

        x: newX,
        y: newY,
      });
    } else drawElement(context, allElements[i]);
  }

  return updatedElement;
}
