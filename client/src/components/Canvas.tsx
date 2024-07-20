import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import Brush from 'src/tools/Brush';
import Rect from 'src/tools/Rect';
import useCanvasState from 'src/zustand/canvasState';
import useToolState from 'src/zustand/toolState';

const Canvas = () => {
  const { pushToUndo, setUsername, username, setSocket, setSessionId } =
    useCanvasState();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const usernameRef = useRef<null | HTMLInputElement>(null);
  const [modal, setModal] = useState(true);
  const params = useParams();

  useEffect(() => {
    if (canvasRef.current) {
      useCanvasState.setState({ canvas: canvasRef.current });
    }
    const ctx = canvasRef.current?.getContext('2d');
    axios
      .get(`http://localhost:5000/image?id=${params.id}`)
      .then((response) => {
        const img = new Image();
        img.src = response.data;
        img.onload = () => {
          if (canvasRef.current && ctx) {
            ctx.clearRect(
              0,
              0,
              canvasRef.current.width,
              canvasRef.current.height,
            );
            ctx.drawImage(
              img,
              0,
              0,
              canvasRef.current.width,
              canvasRef.current.height,
            );
            ctx.stroke();
          }
        };
      });
  }, [params.id]);

  useEffect(() => {
    if (username) {
      const socket = new WebSocket('ws://localhost:5000/');
      setSocket(socket);
      if (params.id) {
        setSessionId(params.id);
      }

      if (canvasRef.current && params.id) {
        useToolState.setState({
          tool: new Brush(canvasRef.current, socket, params.id),
        });
      }

      socket.onopen = () => {
        console.log('Подключение установлено');
        socket.send(
          JSON.stringify({
            id: params.id,
            username: username,
            method: 'connection',
          }),
        );

        socket.onmessage = (event: MessageEvent) => {
          const msg = JSON.parse(event.data);
          switch (msg.method) {
            case 'connection':
              console.log(`Пользователь ${msg.username} подключен`);
              break;
            case 'draw':
              drawHandler(msg);
              break;
          }
        };
      };
    }
  }, [username, params.id, setSessionId, setSocket]);

  const drawHandler = (msg: any) => {
    const figure = msg.figure;
    const ctx = canvasRef.current?.getContext('2d');
    switch (figure.type) {
      case 'brush':
        if (ctx) {
          Brush.draw(ctx, figure.x, figure.y);
        }
        break;
      case 'rect':
        if (ctx) {
          Rect.staticDraw(
            ctx,
            figure.x,
            figure.y,
            figure.width,
            figure.height,
            figure.color,
          );
        }
        break;
      case 'finish':
        ctx?.beginPath();
        break;
    }
  };

  const handleMouseDown = () => {
    if (canvasRef.current) {
      pushToUndo(canvasRef.current?.toDataURL());
      axios
        .post(`http://localhost:5000/image?id=${params.id}`, {
          img: canvasRef.current.toDataURL(),
        })
        .then((response) => console.log(response.data));
    }
  };

  const connectHandler = () => {
    if (usernameRef.current) {
      setUsername(usernameRef.current.value);
      setModal(false);
    }
  };

  return (
    <div className='canvas'>
      <Modal show={modal} onHide={() => {}}>
        <Modal.Header closeButton>
          <Modal.Title>Введите ваше имя</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input type='text' ref={usernameRef} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={() => connectHandler()}>
            Войти
          </Button>
        </Modal.Footer>
      </Modal>
      <canvas
        onMouseDown={() => handleMouseDown()}
        ref={canvasRef}
        width={600}
        height={400}
      />
    </div>
  );
};

export default Canvas;
