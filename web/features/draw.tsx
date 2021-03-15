import {
  FunctionComponent,
  MouseEvent,
  useRef,
  useState,
  useEffect,
} from "react";
import { Box, Button, HStack } from "@chakra-ui/react";
import { HexColorPicker } from "react-colorful";

type HistoryItem = {
  color: string;
  x: number;
  y: number;
};

export const Draw: FunctionComponent = () => {
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const [color, setColor] = useState("#000000");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const context = canvasRef?.current?.getContext("2d");
    if (context) setContext(context);
  }, []);

  const handleMouseMove = (event: MouseEvent) => {
    if (!context) return;

    // left mouse button is pressed
    if (event.buttons !== 1) return;

    context.beginPath(); // begin

    context.lineWidth = 5;
    context.lineCap = "round";
    context.strokeStyle = color;

    const rect = (event.target as HTMLCanvasElement).getBoundingClientRect();

    context.moveTo(position.x, position.y);

    const newX = event.clientX - rect.left;
    const newY = event.clientY - rect.top;

    setPosition({ x: newX, y: newY });
    setHistory([...history, { x: newX, y: newY, color }]);

    context.lineTo(newX, newY);

    context.stroke();
  };

  const handleSave = () => {
    alert("Not implemented yet!");
  };

  const handleClear = (event: MouseEvent) => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    context?.clearRect(0, 0, canvas.width, canvas.height);
    setHistory([]);
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
          <img ref={imageRef} style={{ display: "none" }} />
        </Box>
      )}
    </HStack>
  );
};
