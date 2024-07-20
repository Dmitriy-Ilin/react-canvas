import { useCallback } from 'react';
import Brush from 'src/tools/Brush';
import Circle from 'src/tools/Circle';
import Eraser from 'src/tools/Eraser';
import Line from 'src/tools/Line';
import Rect from 'src/tools/Rect';
import useCanvasState from 'src/zustand/canvasState';
import useToolState from 'src/zustand/toolState';

const ToolBar = () => {
  const { canvas, undo, redo, socket, sessionId } = useCanvasState();
  const { setStrokeColor, setTool, setFillColor } = useToolState();
  // const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleBrushClick = useCallback(() => {
    if (canvas && socket && sessionId) {
      const tool = new Brush(canvas, socket, sessionId);
      setTool(tool);
    }
  }, [canvas, socket, sessionId, setTool]);

  const handleRectClick = useCallback(() => {
    if (canvas && socket && sessionId) {
      const tool = new Rect(canvas, socket, sessionId);
      setTool(tool);
    }
  }, [canvas, socket, sessionId, setTool]);

  const handleCircleClick = () => {
    if (canvas) {
      const tool = new Circle(canvas);
      setTool(tool);
    }
  };

  const handleEraserClick = () => {
    if (canvas) {
      const tool = new Eraser(canvas);
      setTool(tool);
    }
  };

  const handleLineClick = () => {
    if (canvas) {
      const tool = new Line(canvas);
      setTool(tool);
    }
  };

  const handleColorChange = (e: any) => {
    setStrokeColor(e.target.value);
    setFillColor(e.target.value);
  };

  const handleDownloadClick = () => {
    const dataUrl = canvas?.toDataURL();
    console.log(dataUrl);
    const a = document.createElement('a');
    if (dataUrl) {
      a.href = dataUrl;
      a.download = sessionId + '.jpg';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  return (
    <div className='toolbar'>
      <button
        className='toolbar__btn brush'
        onClick={handleBrushClick}
      ></button>
      <button className='toolbar__btn rect' onClick={handleRectClick}></button>
      <button
        className='toolbar__btn circle'
        onClick={handleCircleClick}
      ></button>
      <button
        className='toolbar__btn eraser'
        onClick={handleEraserClick}
      ></button>
      <button className='toolbar__btn line' onClick={handleLineClick}></button>
      <input
        type='color'
        className='color'
        onChange={(e) => handleColorChange(e)}
      />
      <button className='toolbar__btn undo' onClick={() => undo()}></button>
      <button className='toolbar__btn redo' onClick={() => redo()}></button>
      <button
        className='toolbar__btn save'
        onClick={() => handleDownloadClick()}
      ></button>
    </div>
  );
};

export default ToolBar;
