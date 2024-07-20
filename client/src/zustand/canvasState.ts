import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

interface Canvas {
  canvas: null | HTMLCanvasElement;
  socket: null | WebSocket;
  sessionId: null | string;
  undoList: string[];
  redoList: string[];
  username: string;
  setCanvas: (canvas: HTMLCanvasElement) => void;
  pushToRedo: (data: string) => void;
  pushToUndo: (data: string) => void;
  undo: () => void;
  redo: () => void;
  setUsername: (username: string) => void;
  setSocket: (socket: WebSocket) => void;
  setSessionId: (id: string) => void;
}

const useCanvasState = create<Canvas>()(
  immer((set) => ({
    canvas: null,
    socket: null,
    sessionId: null,
    undoList: [],
    redoList: [],
    username: '',
    setCanvas: (canvas) => set({ canvas }),
    pushToUndo: (data) =>
      set((state) => {
        state.undoList.push(data);
      }),
    pushToRedo: (data) =>
      set((state) => {
        state.redoList.push(data);
      }),
    undo: () => {
      set((state) => {
        const canvas = state.canvas;
        if (canvas) {
          const ctx = canvas.getContext('2d');
          if (state.undoList.length > 0) {
            const dataUrl = state.undoList.pop();
            const img = new Image();
            if (dataUrl) {
              state.redoList.push(canvas.toDataURL());
              img.src = dataUrl;
              img.onload = () => {
                ctx?.clearRect(0, 0, canvas.width, canvas.height);
                ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
              };
            }
          } else {
            ctx?.clearRect(0, 0, canvas.width, canvas.height);
          }
        }
      });
    },
    redo: () => {
      set((state) => {
        const canvas = state.canvas;
        if (canvas) {
          const ctx = canvas.getContext('2d');
          if (state.redoList.length > 0) {
            const dataUrl = state.redoList.pop();
            const img = new Image();
            if (dataUrl) {
              state.undoList.push(canvas.toDataURL());
              img.src = dataUrl;
              img.onload = () => {
                ctx?.clearRect(0, 0, canvas.width, canvas.height);
                ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
              };
            }
          }
        }
      });
    },
    setUsername: (username) =>
      set((state) => {
        state.username = username;
      }),
    setSocket: (socket) => {
      set((state) => {
        state.socket = socket;
      });
    },
    setSessionId: (id) => {
      set((state) => {
        state.sessionId = id;
      });
    },
  })),
);

export default useCanvasState;
