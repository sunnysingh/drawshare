import { FunctionComponent, useEffect, useState, useRef } from 'react';
import {
  Box,
  Wrap,
  WrapItem,
  Alert,
  AlertDescription,
  Spinner,
  Button,
  useToast,
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

export function useDrawingsList(isPublic = true) {
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [drawings, setDrawings] = useState<Drawing[]>([]);
  const [shouldFetch, setShouldFetch] = useState(true);

  useEffect(() => {
    if (!shouldFetch) return;

    setShouldFetch(false);

    api
      .service('drawings')
      .find({
        query: {
          isPublic,
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
  }, [api, setDrawings, shouldFetch]);

  const refetch = () => {
    setShouldFetch(true);
  };

  return { isFetching, error, drawings, refetch };
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

export function useDeleteDrawing() {
  const [isDeleting, setIsDeleting] = useState(false);
  const toast = useToast();

  const handleDelete = (id: string, onSuccess: (id?: string) => void) => {
    setIsDeleting(true);
    api
      .service('drawings')
      .remove(id)
      .then(() => {
        setIsDeleting(false);
        onSuccess(id);
        toast({
          title: 'Deleted',
          status: 'success',
          duration: 3000,
          isClosable: true,
          position: 'top',
        });
      })
      .catch((error: Error) => {
        setIsDeleting(false);
        toast({
          title: error.message,
          status: 'error',
          duration: 9000,
          isClosable: true,
          position: 'top',
        });
      });
  };

  return { isDeleting, handleDelete };
}

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
      id={drawing._id}
      steps={drawing.steps}
      username={drawing.username}
      drawTime={drawing.drawTime}
      createdAt={drawing.createdAt}
    />
  );
};

type DrawingsListProps = {
  isPublic?: boolean;
};

export const DrawingsList: FunctionComponent<DrawingsListProps> = ({
  isPublic = true,
}) => {
  const { isAuthenticated, username } = useAuthContext();
  const { isFetching, error, drawings, refetch } = useDrawingsList(isPublic);

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
            id={drawing._id}
            steps={drawing.steps}
            username={drawing.username}
            drawTime={drawing.drawTime}
            createdAt={drawing.createdAt}
            isDeletable={drawing.username === username}
            onDelete={refetch}
          />
        </WrapItem>
      ))}
    </Wrap>
  );
};
