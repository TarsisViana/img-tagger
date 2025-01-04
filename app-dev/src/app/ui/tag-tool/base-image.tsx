import React, { useEffect } from "react";
import { Image, Layer } from "react-konva";
import useImage from "use-image";


export default function BaseImage({ selectShape, setImageAtr, setScale, setHeight }:
  {
    selectShape: (arg: null) => void,
    setImageAtr: (arg: object) => void,
    setScale: (arg: number) => void,
    setHeight: (arg: number) => void;
  }) {
  const [image] = useImage('/pic.png');

  useEffect(() => {
    if (!image) return
    const ratio = image.width / image.height
    setImageAtr({
      width: image.width,
      height: image.height,
      imgRatio: ratio,
    })

    setScale(800/image.width)
    setHeight(800*ratio)
  },[image])

  return (
    <Layer>
      <Image
        image={image}
        onMouseDown={() => {
          selectShape(null)
        }}
        name='image'
        alt='placeholder'
      />
    </Layer>
  );
};
