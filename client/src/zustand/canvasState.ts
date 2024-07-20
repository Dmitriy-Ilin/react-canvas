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

// import create from 'zustand';

// interface CanvasState {
//   canvas: null | HTMLCanvasElement;
//   socket: null | WebSocket;
//   sessionid: null | string;
//   undoList: string[];
//   redoList: string[];
//   username: string;

//   setSessionId: (id: string) => void;
//   setSocket: (socket: WebSocket) => void;
//   setUsername: (username: string) => void;
//   setCanvas: (canvas: HTMLCanvasElement) => void;
//   pushToUndo: (data: string) => void;
//   pushToRedo: (data: string) => void;
//   undo: () => void;
//   redo: () => void;
// }

// const useCanvasState = create<CanvasState>((set) => ({
//   canvas: null,
//   socket: null,
//   sessionid: null,
//   undoList: [],
//   redoList: [],
//   username: '',

//   setSessionId: (id) => set({ sessionid: id }),
//   setSocket: (socket) => set({ socket }),
//   setUsername: (username) => set({ username }),
//   setCanvas: (canvas) => set({ canvas }),
//   pushToUndo: (data) => set((state) => ({ undoList: [...state.undoList, data] })),
//   pushToRedo: (data) => set((state) => ({ redoList: [...state.redoList, data] })),
//   undo: () => {
//     const canvas = get().canvas;
//     if (canvas) {
//       const ctx = canvas.getContext('2d');
//       if (get().undoList.length > 0) {
//         const dataUrl = get().undoList.pop();
//         get().redoList.push(canvas.toDataURL());
//         const img = new Image();
//         img.src = dataUrl;
//         img.onload = () => {
//           ctx.clearRect(0, 0, canvas.width, canvas.height);
//           ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
//         };
//       } else {
//         ctx.clearRect(0, 0, canvas.width, canvas.height);
//       }
//     }
//   },
//   redo: () => {
//     const canvas = get().canvas;
//     if (canvas) {
//       const ctx = canvas.getContext('2d');
//       if (get().redoList.length > 0) {
//         const dataUrl = get().redoList.pop();
//         get().undoList.push(canvas.toDataURL());
//         const img = new Image();
//         img.src = dataUrl;
//         img.onload = () => {
//           ctx.clearRect(0, 0, canvas.width, canvas.height);
//           ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
//         };
//       }
//     }
//   },
// }));

// export default useCanvasState;
