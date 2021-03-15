import { FunctionComponent, useEffect, useState, useRef } from 'react';
import { Box, Wrap, WrapItem } from '@chakra-ui/react';

import { api } from 'api';

type Step = {
  color: string;
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
};

type Drawing = {
  username: string;
  steps: Step[];
  public: boolean;
  _id: string;
};

type DrawingsResponse = {
  data: Drawing[];
};

export function useDrawings() {
  const [drawings, setDrawings] = useState<Drawing[]>([]);

  useEffect(() => {
    api
      .service('drawings')
      .find()
      .then((drawings: DrawingsResponse) => {
        setDrawings(drawings?.data || []);
      });
  }, [api, setDrawings]);

  return drawings;
}

type ReplayedDrawingProps = {
  steps: Step[];
  username: string;
};

export const ReplayedDrawing: FunctionComponent<ReplayedDrawingProps> = ({
  steps,
  username,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const context = canvasRef?.current?.getContext('2d');

    if (!context) return;

    steps.forEach((step) => {
      context.beginPath();
      context.lineWidth = 5;
      context.lineCap = 'round';
      context.strokeStyle = step.color;
      context.moveTo(step.fromX, step.fromY);
      context.lineTo(step.toX, step.toY);
      context.stroke();
    });
  }, [canvasRef]);

  return (
    <div>
      <Box>By @{username}</Box>
      <Box borderWidth="1px" borderColor="black" w={400} h={400} mb={4}>
        <canvas ref={canvasRef} width={400} height={400} />
      </Box>
    </div>
  );
};

export const Drawings: FunctionComponent = () => {
  const drawings = useDrawings();
  return (
    <Wrap spacing={4} flexWrap="wrap">
      {drawings.map((drawing) => (
        <WrapItem key={drawing._id}>
          <ReplayedDrawing steps={drawing.steps} username={drawing.username} />
        </WrapItem>
      ))}
    </Wrap>
  );
};
