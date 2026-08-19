import { useEffect, useRef } from 'react';
import './SprayPaint.css';

const BASE_CELL_SIZE = 10;

// function getAdaptiveCellSize(width: number, height: number) {
//   const devicePixelRatio = window.devicePixelRatio || 1;
//   const isSmallViewport = width <= 768 || height <= 600;
//   const isHighResolution = width * height >= 3_000_000 || devicePixelRatio >= 2.5;

//   if (isHighResolution) {
//     return 14;
//   }

//   if (isSmallViewport) {
//     return 12;
//   }

//   return BASE_CELL_SIZE;
// }


function SprayPaint() {
  const canvasRef = useRef(null);
  useEffect(() => {
    
  }, []);
  return(
    <canvas ref={canvasRef} className='sprayContainer' aria-hidden='true' />
  );
}

export default SprayPaint;