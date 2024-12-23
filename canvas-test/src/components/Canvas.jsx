import { useEffect, useRef, useState } from "react"

const shapes = [
  { x: 10, y: 10, width: 50, height: 50, color: 'red' },
  { x: 20, y: 80, width: 50, height: 50, color: 'blue' }
]

 
export default function Canvas() {

  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState({ h: null, w: null,offsetX:null, offsetY:null })
  const [currentIndex, setCurrent] = useState(null)
  const [isDragging, setDragging] = useState(false)
  const [clickPos, setClickPos] = useState()

   
  function draw(ctx) {
    ctx.clearRect(0, 0, canvas.w, canvas.h)
    for (let shape of shapes) {
      ctx.fillStyle = shape.color;
      ctx.fillRect(shape.x, shape.y, shape.width, shape.height);
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    setCanvas({
      h: canvas.height,
      w: canvas.width,
      offsetX: canvas.getBoundingClientRect().left,
      offsetY: canvas.getBoundingClientRect().top
    })

    draw(context)

  }, [shapes])
  
  function handleClick(e) {
    e.preventDefault()

    let startX = parseInt(e.clientX - canvas.offsetX) 
    let startY = parseInt(e.clientY - canvas.offsetY) 
    
    let index = 0;
    for (let shape of shapes) {
      if (isMouseInShape(startX, startY, shape)) {
        console.log('yes')
        setCurrent(index);
        setDragging(true);
        setClickPos({ x: startX, y: startY })
        
        return;
      } 
      index++
    }
  }

  function handleMouseUp(e) {
    e.preventDefault();
    if (!isDragging) {
      return;
    }
    setDragging(false)
  }

  function handleMouseOut(e) {
    e.preventDefault();
    if (!isDragging) {
      return;
    }
    setDragging(false)
  }

  function handleMouseMove(e) {
    if (!isDragging) return;
    
    e.preventDefault()
    let mouseX = parseInt(e.clientX - e.target.offsetLeft) 
    let mouseY = parseInt(e.clientY - e.target.offsetTop) 

    let dx = mouseX - clickPos.x;
    let dy = mouseY - clickPos.y;

    let currentShape = shapes[currentIndex]
    
    currentShape.x += dx;
    currentShape.y += dy;

    draw(canvasRef.current.getContext('2d'));

    setClickPos({x: mouseX,y:mouseY})

  }

  return (
    <canvas
      ref={canvasRef}
      style={{ border: "1px solid black" }}
      width="200"
      height="200"
      id="tutorial"
      onMouseDown={handleClick}
      onMouseUp={handleMouseUp}
      onMouseOut={handleMouseOut}
      onMouseMove={handleMouseMove}
    >
      Fallback
    </canvas>
  )
}

function isMouseInShape(x,y,shape) {
  const shapeLeft = shape.x;
  const shapeRight = shape.x + shape.width;
  const shapeTop = shape.y;
  const shapeBottom = shape.y + shape.height;
  

  if (x > shapeLeft && x < shapeRight && y > shapeTop && y < shapeBottom) {
    return true
  }
  return false;
}