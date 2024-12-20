'use client'

import Konva from 'konva';
import { useRef, useState } from 'react'
import { Stage, Layer, Rect } from 'react-konva' 

const inicialRect = {
  x: 20,
  y: 20,
  width: 100,
  height: 100,
  stroke: 'red',
  strokeWidth: 3,
  id: 'rect1',
};

export default function Canvas() {
  const stageRef = useRef(null);
  const constructorRef = useRef(null);
  const [idCounter, setIdCounter] = useState(1)
  const [rectList, setRectList] = useState([inicialRect])
  const [clickCounter, setClick] = useState(0);
  const [isDrawing, setDrawing] = useState(false)
  const [tempPos1, setTempPos1] = useState(null)
  const [tempPos2, setTempPos2] = useState(null)
  const [selectedId, setSelectedShape] = useState(null)


  function handleMouseDown(e) {
    const clickedOnTag = e.target?.id() !== 'canvas' 
    if (!clickedOnTag) {
      setSelectedShape(null)
      if (clickCounter == 0) {
        

        const pointerPos = getPointer()
        setTempPos1(pointerPos)
        setDrawing(true)
      }
    } else {
      setSelectedShape(e.target.id())
    }
  }

  function handleMouseMove() {
    if (!isDrawing) return;
    const mousepos = getPointer()
    setTempPos2(mousepos);
    const atr = {
      x: tempPos1.x, 
      y: tempPos1.y,
      width: tempPos2 ?  tempPos2.x - tempPos1.x : 0,
      height: tempPos2 ? tempPos2.y - tempPos1.y : 0,
    }
    const constructor = constructorRef.current;
    constructor.setAttrs(atr)
  }

  function handleMouseUp() {
    if (!isDrawing) return;
    setDrawing(false)

    //create new tag and add to array
    const tag = {
      x: tempPos1.x,
      y: tempPos1.y,
      width: tempPos2 ? tempPos2.x - tempPos1.x : 0,
      height: tempPos2 ? tempPos2.y - tempPos1.y : 0,
      stroke: 'yellow',
      strokeWidth: 3,
      id: crypto.randomUUID(),
    };
    const tagArr = rectList
    tagArr.push(tag)
    setRectList(tagArr);

    //reset constructor
    const constructor = constructorRef.current;
    constructor.setAttrs({
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    })

    //reset temp positions
    setTempPos1(0)
    setTempPos2(0)
  }

  function handleDragEnd(e) {
    const id = e.target.id()
    const tagArr = rectList.slice();
    const item = tagArr.find((tag) => tag.id === id) 
    const index = tagArr.indexOf(item)
    tagArr[index] = {
      ...item,
      x: Math.round(e.target.x()),
      y: Math.round(e.target.y()),
    }
    console.log(tagArr[index])
    setRectList(tagArr)
  }

  function handleDelete() {
    const id = selectedId
    if (!selectedId) return
    
    const item = rectList.find((tag) => tag.id === id)
    const index = rectList.indexOf(item)
    const newArr = rectList.toSpliced(index,1)
    
    setRectList(newArr)
    setSelectedShape(null)
  }

  function getPointer() {
    const stage = stageRef.current
    if (stage) {
      const pointerPos = stage.getRelativePointerPosition();
      pointerPos.x = Math.round(pointerPos.x)
      pointerPos.y = Math.round(pointerPos.y)
      return pointerPos
    }
  }
  return (
    <>
      <Stage
        ref={stageRef}
        width={window?.innerWidth || 0} 
        height={500}
        className='border-2 border-black'
        id='canvas'
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseup={handleMouseUp}
        name="canvas"
      >
        <Layer>
          {rectList.map((rect, index) => {
            return (<Rect {...rect} key={index} draggable onDragEnd={handleDragEnd}/>)
          })}
          <Rect
            ref={constructorRef}
            draggable
            stroke= 'grey'
            strokeWidth={5}
          />
        </Layer>
      </Stage>
      <button
        className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
        onClick={handleDelete}
      >delete</button>
    </>
    )
}