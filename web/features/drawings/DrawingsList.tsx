import { FunctionComponent } from 'react';
import {
  Box,
  Wrap,
  WrapItem,
  Alert,
  AlertDescription,
  Spinner,
} from '@chakra-ui/react';

import { Link } from 'components';
import { useAuthContext } from 'contexts/auth';

import { ReplayedDrawing } from './ReplayedDrawing';
import { useDrawingsList } from './hooks';

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
