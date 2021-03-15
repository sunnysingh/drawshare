import { useState } from 'react';
import { useRouter } from 'next/router';
import { useToast } from '@chakra-ui/react';

import { api } from 'api';

import { StepItem } from './types';

type SaveDrawingPayload = {
  username: string;
  steps: StepItem[];
  createdAt: number;
  drawTime: number;
  isPublic: boolean;
};

export function useSaveDrawing() {
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();
  const toast = useToast();

  const save = (drawing: SaveDrawingPayload) => {
    setIsSaving(true);
    api
      .service('drawings')
      .create(drawing)
      .then(() => {
        if (drawing.isPublic) router.push('/');
        else router.push('/private');
      })
      .catch((error: Error) => {
        setIsSaving(false);
        toast({
          title: error.message,
          status: 'error',
          duration: 9000,
          isClosable: true,
          position: 'top',
        });
      });
  };

  return { isSaving, save };
}
