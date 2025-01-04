'use client'

import Konva from 'konva';
import { use, useRef, useState } from 'react'
import { Stage, Layer, Rect } from 'react-konva'
import Tag from './tag';
import { KonvaEventObject } from 'konva/lib/Node';
import BaseImage from './base-image';


export interface Rectangle  {
  x: number,
  y: number,
  width: number,
  height: number,
  stroke: string,
  strokeWidth: number,
  id: string
}

const initialRect : Rectangle = {
  x: 20,
  y: 20,
  width: 100,
  height: 100,
  stroke: 'red',
  strokeWidth: 3,
  id: 'rect1',
};

export default function Canvas() {
  const [rectList, setRectList] = useState<Rectangle[]>([initialRect]);
  const [selectedId, selectShape] = useState<string | null>(null);
  const [isDrawing, setDrawing] = useState(false);
  const [imageAtr, setImageAtr] = useState(null);

  //stage size
  const [height, setHeight] = useState(500) 
  const [scale, setScale] = useState(1)


  const stageRef = useRef<Konva.Stage>(null);
  const constructorRef = useRef<Konva.Rect>(null);


  function handleMouseDown(e: KonvaEventObject<MouseEvent, Konva.Node>) {
    const clickedOnTag = e.target.name() === 'tag'
    
    if (!clickedOnTag) {
      const node = stageRef.current
      const constructor = constructorRef.current;

      const pointerPos = getPointer(node)
      const atr = {
        x: pointerPos?.x,
        y: pointerPos?.y,
      }
      constructor?.setAttrs(atr)
      setDrawing(true)
    }
  }

  function handleMouseMove() {
    if (!isDrawing) return;
    const node = stageRef.current
    const pointerPos = getPointer(node)
    const constructor = constructorRef.current;
    if (pointerPos && constructor) {
      const atr = {
        width: pointerPos.x - constructor.x(),
        height: pointerPos.y - constructor.y(),
      }
      constructor.setAttrs(atr)
    }
    
  }

  function handleMouseUp() {
    if (!isDrawing) return;
    setDrawing(false)

    //create new tag and add to array with size minimum
    const constructor = constructorRef.current;
    if (constructor && constructor.width() > 20 && constructor.height() > 20) {
      const tag = {
        x: constructor.x(),
        y: constructor.y(),
        width: constructor.width(),
        height: constructor.height(),
        stroke: 'yellow',
        strokeWidth: 3/scale,
        id: crypto.randomUUID(),
      };
      const tagArr = rectList
      tagArr.push(tag)
      setRectList(tagArr);
    }
    

    //reset constructor
    constructor?.setAttrs({
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    })
  }

  function handleDelete() {
    const id = selectedId
    if (!selectedId) return

    const item = rectList.find((tag) => tag.id === id)
    if (item) {
      const index = rectList.indexOf(item)
      const newArr = rectList.toSpliced(index, 1)

      setRectList(newArr)
      selectShape(null)
    }
  }

  function getPointer(node: Konva.Node | null) {
    if (!node) {
      return{ x:0, y:0 }
    }
    if (node) {
      const pointerPos = node.getRelativePointerPosition();
      if (pointerPos) {
        pointerPos.x = Math.round(pointerPos.x)
        pointerPos.y = Math.round(pointerPos.y)
      }
      return pointerPos
    }
  }
  return (
    <div className='row justify-content-center'>
      <div className='col-9 justify-content-center d-flex'>
        <Stage
          width={800}
          height={height}
          scaleX={scale}
          scaleY={scale}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          name="canvas"
          ref={stageRef}
          className='border border-secondary-subtle'
        >
          <BaseImage
            selectShape={selectShape}
            setImageAtr={setImageAtr}
            setScale={setScale}
            setHeight={setHeight}
          />
          <Layer>
            {rectList.map((rect, index) => {
              return (
                <Tag
                  key={index}
                  tagProps={rect}
                  isSelected={rect.id === selectedId}
                  onSelect={() => {
                    selectShape(rect.id);
                  }}
                  onChange={(newAttrs: Rectangle) => {
                    const rects = rectList.slice();
                    rects[index] = newAttrs;
                    setRectList(rects);
                  }}
                />
              )
            })}
            <Rect
              ref={constructorRef}
              draggable
              stroke= 'grey'
              strokeWidth={5/scale}
            />
          </Layer>
        </Stage>
      </div>
      
      <div style={{ maxWidth: '300px' }} className='col-3'>
        <button className='btn-primary btn' onClick={handleDelete}>
          delete
        </button>
      </div>
    </div>
    )
}