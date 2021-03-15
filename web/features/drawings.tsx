import { FunctionComponent, useEffect, useState, useRef } from 'react';
import {
  Box,
  Wrap,
  WrapItem,
  Alert,
  AlertDescription,
  Spinner,
} from '@chakra-ui/react';

import { Link } from 'components';
import { api } from 'api';
import { useAuthContext } from 'contexts/auth';

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
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [drawings, setDrawings] = useState<Drawing[]>([]);

  useEffect(() => {
    api
      .service('drawings')
      .find()
      .then((drawings: DrawingsResponse) => {
        setIsFetching(false);
        setDrawings(drawings?.data || []);
      })
      .catch((error: Error) => {
        setIsFetching(false);
        setError(error.message);
      });
  }, [api, setDrawings]);

  return { isFetching, error, drawings };
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
  const { isAuthenticated } = useAuthContext();
  const { isFetching, error, drawings } = useDrawings();

  if (isFetching) {
    return <Spinner size="xl" />;
  }

  if (error) {
    return (
      <Alert status="error" mb={4}>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (drawings.length === 0) {
    return (
      <Box>
        There are no drawings yet.{' '}
        <Link href={isAuthenticated ? '/draw' : '/auth/register'}>
          Why not create one?
        </Link>
      </Box>
    );
  }

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
