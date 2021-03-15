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
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Switch,
} from '@chakra-ui/react';
import { HexColorPicker } from 'react-colorful';
import { useRouter } from 'next/router';

import { useAuthContext } from 'contexts/auth';
import { api } from 'api';

type StepItem = {
  strokeWidth: number;
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
  const [strokeWidth, setStrokeWidth] = useState(5);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPublic, setIsPublic] = useState(true);
  const [isErasing, setIsErasing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const steps = useRef<StepItem[]>([]);
  const startTime = useRef<number | null>(null);
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

    const strokeStyle = isErasing ? '#FFFFFF' : color;

    context.lineWidth = strokeWidth;
    context.lineCap = 'round';
    context.strokeStyle = strokeStyle;

    const rect = (event.target as HTMLCanvasElement).getBoundingClientRect();

    context.moveTo(position.x, position.y);

    const toX = event.clientX - rect.left;
    const toY = event.clientY - rect.top;

    if (steps.current.length === 0) {
      startTime.current = Number(new Date());
    }

    steps.current.push({
      fromX: position.x,
      fromY: position.y,
      toX,
      toY,
      color: strokeStyle,
      strokeWidth,
    });

    setPosition({ x: toX, y: toY });

    context.lineTo(toX, toY);

    context.stroke();
  };

  const handleSave = async () => {
    const endTime = Number(new Date());
    const drawing = {
      username: auth.username,
      steps: steps.current,
      createdAt: Number(new Date()),
      drawTime: endTime - (startTime.current || 0),
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
    startTime.current = null;

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
        <WrapItem display="block">
          <Box mb={8}>
            <HexColorPicker color={color} onChange={setColor} />
          </Box>

          <FormControl mb={8}>
            <FormLabel htmlFor="strokeWidth" mb="0">
              Stroke Width
            </FormLabel>
            <NumberInput
              id="strokeWidth"
              value={strokeWidth}
              max={30}
              min={5}
              onChange={(value) => setStrokeWidth(Number(value))}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>

          <FormControl display="flex" alignItems="center" mb={8}>
            <FormLabel htmlFor="eraser" mb="0">
              Eraser
            </FormLabel>
            <Switch
              id="eraser"
              size="lg"
              isChecked={isErasing}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                setIsErasing(event.target.checked)
              }
            />
          </FormControl>
        </WrapItem>
      )}
    </Wrap>
  );
};
