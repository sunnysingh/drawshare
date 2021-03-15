import { FunctionComponent, useRef, useEffect } from 'react';
import { Box, Link, Button } from '@chakra-ui/react';
import { format } from 'date-fns';

import { useDeleteDrawing } from './hooks';
import { Step } from './types';

type ReplayedDrawingProps = {
  id: string;
  steps: Step[];
  username: string;
  drawTime: number;
  createdAt: number;
  isDeletable?: boolean;
  onDelete?: () => void;
};

export const ReplayedDrawing: FunctionComponent<ReplayedDrawingProps> = ({
  id,
  steps,
  username,
  drawTime,
  createdAt,
  isDeletable = false,
  onDelete = () => {},
}) => {
  const { isDeleting, handleDelete } = useDeleteDrawing();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const context = canvasRef?.current?.getContext('2d');

    if (!context) return;

    steps.forEach((step) => {
      context.beginPath();
      context.lineWidth = step.strokeWidth;
      context.lineCap = 'round';
      context.strokeStyle = step.color;
      context.moveTo(step.fromX, step.fromY);
      context.lineTo(step.toX, step.toY);
      context.stroke();
    });
  }, [canvasRef]);

  const drawTimeSeconds = Math.floor(drawTime / 1000);

  return (
    <div>
      <Box>By @{username}</Box>

      <Box borderWidth="1px" borderColor="black" w={400} h={400}>
        <canvas ref={canvasRef} width={400} height={400} />
      </Box>

      <Box>
        <Link href={`/draw/${id}`}>
          {format(new Date(createdAt), 'LLL do yyyy')} at{' '}
          {format(new Date(createdAt), 'HH:mm a')}
        </Link>{' '}
        in {drawTimeSeconds > 0 ? `${drawTimeSeconds}s` : `${drawTime}ms`}
      </Box>

      {isDeletable && (
        <Button
          mt={2}
          colorScheme="red"
          variant="outline"
          onClick={() => handleDelete(id, onDelete)}
          isLoading={isDeleting}
        >
          Delete
        </Button>
      )}
    </div>
  );
};
