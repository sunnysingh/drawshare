import {
  FunctionComponent,
  MouseEvent,
  useRef,
  useState,
  useEffect,
} from 'react';
import { Box, Button, HStack } from '@chakra-ui/react';
import { HexColorPicker } from 'react-colorful';
import { useRouter } from 'next/router';

import { useAuthContext } from 'contexts/auth';
import { api } from 'api';

type StepItem = {
  color: string;
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
};

export const Draw: FunctionComponent = () => {
  const auth = useAuthContext();
  const router = useRouter();
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const [color, setColor] = useState('#000000');
  const steps = useRef<StepItem[]>([]);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const context = canvasRef?.current?.getContext('2d');
    if (context) setContext(context);
  }, []);

  const handleMouseMove = (event: MouseEvent) => {
    if (!context) return;

    // left mouse button is pressed
    if (event.buttons !== 1) return;

    context.beginPath();

    context.lineWidth = 5;
    context.lineCap = 'round';
    context.strokeStyle = color;

    const rect = (event.target as HTMLCanvasElement).getBoundingClientRect();

    context.moveTo(position.x, position.y);

    const toX = event.clientX - rect.left;
    const toY = event.clientY - rect.top;

    steps.current.push({
      fromX: position.x,
      fromY: position.y,
      toX,
      toY,
      color,
    });

    setPosition({ x: toX, y: toY });

    context.lineTo(toX, toY);

    context.stroke();
  };

  const handleSave = async () => {
    const drawing = {
      username: auth.username,
      steps: steps.current,
      public: true,
    };

    await api.service('drawings').create(drawing);

    router.push('/');
  };

  const handleClear = (event: MouseEvent) => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    context?.clearRect(0, 0, canvas.width, canvas.height);
    steps.current = [];
  };

  return (
    <HStack spacing={8} align="flex-start">
      <Box>
        <Box mb={4} w="400px" borderWidth="2px" borderColor="black">
          <canvas
            ref={canvasRef}
            onMouseMove={handleMouseMove}
            onMouseDown={(event: MouseEvent) => {
              const rect = (event.target as HTMLCanvasElement).getBoundingClientRect();
              setPosition({
                x: event.clientX - rect.left,
                y: event.clientY - rect.top,
              });
            }}
            onMouseEnter={(event: MouseEvent) => {
              const rect = (event.target as HTMLCanvasElement).getBoundingClientRect();
              setPosition({
                x: event.clientX - rect.left,
                y: event.clientY - rect.top,
              });
            }}
            width="400%"
            height="400"
          />
        </Box>

        {context && (
          <>
            <Button
              colorScheme="teal"
              variant="solid"
              mr={4}
              onClick={handleSave}
            >
              Save
            </Button>

            <Button colorScheme="teal" variant="outline" onClick={handleClear}>
              Clear
            </Button>
          </>
        )}
      </Box>

      {context && <HexColorPicker color={color} onChange={setColor} />}

      {context && (
        <Box>
          <img ref={imageRef} style={{ display: 'none' }} />
        </Box>
      )}
    </HStack>
  );
};
