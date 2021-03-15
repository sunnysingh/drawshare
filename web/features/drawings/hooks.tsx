import { useState, useEffect } from 'react';
import { useToast } from '@chakra-ui/react';

import { api } from 'api';

import { Step, Drawing } from './types';

export type DrawingsListResponse = {
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
