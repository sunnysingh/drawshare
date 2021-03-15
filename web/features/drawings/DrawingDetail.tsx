import { FunctionComponent } from 'react';
import { Spinner, Alert, AlertDescription } from '@chakra-ui/react';

import { ReplayedDrawing } from './ReplayedDrawing';
import { useDrawingDetail } from './hooks';

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
