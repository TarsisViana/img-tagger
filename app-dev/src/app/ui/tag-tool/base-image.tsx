import React from "react";
import { Image, Layer } from "react-konva";
import useImage from "use-image";


export default function BaseImage({ selectShape }:
  { selectShape: (arg: null) => void }) {
  const [image] = useImage('/pic.png');

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
