import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

interface Tool {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  mouseDown: boolean;
}

interface ToolState {
  tool: null | Tool;
  setTool: (tool: Tool | null) => void;
  setFillColor: (color: string) => void;
  setStrokeColor: (color: string) => void;
  setLineWidth: (width: number) => void;
}

const useToolState = create<ToolState>()(
  immer((set) => ({
    tool: null,
    setTool: (tool) => {
      console.log('setTool called with', tool);
      set({ tool });
    },
    setFillColor: (color) =>
      set((state) => {
        if (state.tool) {
          state.tool.ctx.fillStyle = color;
        }
        return state;
      }),
    setStrokeColor: (color) =>
      set((state) => {
        if (state.tool) {
          state.tool.ctx.strokeStyle = color;
        }
        return state;
      }),
    setLineWidth: (width) => {
      set((state) => {
        if (state.tool) {
          state.tool.ctx.lineWidth = width;
        }
        return state;
      });
    },
  })),
);

export default useToolState;
