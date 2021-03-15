import {
  FunctionComponent,
  MouseEvent,
  ChangeEvent,
  useRef,
  useState,
  useEffect,
} from 'react';
import {
  Box,
  Button,
  Wrap,
  WrapItem,
  Alert,
  AlertDescription,
  FormControl,
  FormLabel,
  Switch,
} from '@chakra-ui/react';
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
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPublic, setIsPublic] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const steps = useRef<StepItem[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const context = canvasRef?.current?.getContext('2d');
    if (context) setContext(context);
  }, []);

  const handleMouseMove = (event: MouseEvent) => {
    if (!context) return;

    const isLeftMouseButtonPressed = event.buttons !== 1;

    if (isLeftMouseButtonPressed) return;

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
      createdAt: Number(new Date()),
      isPublic,
    };

    if (drawing.steps.length === 0) {
      setError('You should draw something first.');
      return;
    }

    setIsSaving(true);
    setError(null);

    await api
      .service('drawings')
      .create(drawing)
      .then((response: { _id: string }) => {
        if (drawing.isPublic) router.push('/');
        else router.push(`/draw/${response._id}`);
      })
      .catch((error: Error) => {
        setIsSaving(false);
        setError(error.message);
      });
  };

  const handleClear = (event: MouseEvent) => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    context?.clearRect(0, 0, canvas.width, canvas.height);

    steps.current = [];

    setError(null);
  };

  return (
    <Wrap spacing={8} align="flex-start">
      <WrapItem display="block">
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
            width="400"
            height="400"
          />
        </Box>

        {error && (
          <Alert status="error" mb={4}>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {context && (
          <>
            <FormControl display="flex" alignItems="center" mb={4}>
              <FormLabel htmlFor="isPublic" mb="0">
                Public Drawing
              </FormLabel>
              <Switch
                id="isPublic"
                isChecked={isPublic}
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  setIsPublic(event.target.checked)
                }
              />
            </FormControl>

            <Button
              colorScheme="teal"
              variant="solid"
              mr={4}
              onClick={handleSave}
              isLoading={isSaving}
            >
              Save
            </Button>

            <Button
              colorScheme="teal"
              variant="outline"
              onClick={handleClear}
              disabled={isSaving}
            >
              Clear
            </Button>
          </>
        )}
      </WrapItem>

      {context && (
        <WrapItem>
          <HexColorPicker color={color} onChange={setColor} />
        </WrapItem>
      )}
    </Wrap>
  );
};
