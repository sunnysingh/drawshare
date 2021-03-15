import { FunctionComponent, useEffect, useState, useRef } from 'react';
import {
  Box,
  Wrap,
  WrapItem,
  Alert,
  AlertDescription,
  Spinner,
} from '@chakra-ui/react';
import { format } from 'date-fns';

import { Link } from 'components';
import { api } from 'api';
import { useAuthContext } from 'contexts/auth';

type Step = {
  strokeWidth: number;
  color: string;
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
};

type Drawing = {
  username: string;
  steps: Step[];
  isPublic: boolean;
  drawTime: number;
  createdAt: number;
  _id: string;
};

type DrawingsListResponse = {
  data: Drawing[];
};

export function useDrawingsList() {
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [drawings, setDrawings] = useState<Drawing[]>([]);

  useEffect(() => {
    api
      .service('drawings')
      .find({
        query: {
          isPublic: true,
          $sort: {
            createdAt: -1,
          },
        },
      })
      .then((drawings: DrawingsListResponse) => {
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

export function useDrawingDetail(id: string) {
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [drawing, setDrawing] = useState<Drawing | null>(null);

  useEffect(() => {
    api
      .service('drawings')
      .get(id)
      .then((drawing: Drawing) => {
        setIsFetching(false);
        setDrawing(drawing);
      })
      .catch((error: Error) => {
        setIsFetching(false);
        setError(error.message);
      });
  }, [api, setDrawing]);

  return { isFetching, error, drawing };
}

type ReplayedDrawingProps = {
  steps: Step[];
  username: string;
  drawTime: number;
  createdAt: number;
};

export const ReplayedDrawing: FunctionComponent<ReplayedDrawingProps> = ({
  steps,
  username,
  drawTime,
  createdAt,
}) => {
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
        {format(new Date(createdAt), 'LLL do yyyy')} at{' '}
        {format(new Date(createdAt), 'HH:mm a')} in{' '}
        {drawTimeSeconds > 0 ? `${drawTimeSeconds}s` : `${drawTime}ms`}
      </Box>
    </div>
  );
};

type DrawingDetailProps = {
  id: string;
};

export const DrawingDetail: FunctionComponent<DrawingDetailProps> = ({
  id,
}) => {
  const { isFetching, error, drawing } = useDrawingDetail(id);

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

  if (!drawing) {
    return (
      <Alert status="error" mb={4}>
        <AlertDescription>Drawing data is not available.</AlertDescription>
      </Alert>
    );
  }

  return (
    <ReplayedDrawing
      steps={drawing.steps}
      username={drawing.username}
      drawTime={drawing.drawTime}
      createdAt={drawing.createdAt}
    />
  );
};

export const DrawingsList: FunctionComponent = () => {
  const { isAuthenticated } = useAuthContext();
  const { isFetching, error, drawings } = useDrawingsList();

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
          <ReplayedDrawing
            steps={drawing.steps}
            username={drawing.username}
            drawTime={drawing.drawTime}
            createdAt={drawing.createdAt}
          />
        </WrapItem>
      ))}
    </Wrap>
  );
};
