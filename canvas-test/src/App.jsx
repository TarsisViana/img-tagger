import { useState } from 'react'
import Canvas from './components/Canvas'

const inicialShapes = [
  { x: 10, y: 10, width: 50, height: 50, color: 'red' },
  { x: 20, y: 80, width: 50, height: 50, color: 'blue' }
]

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Canvas inicialShapes={inicialShapes}/>
    </>
  )
}

export default App
