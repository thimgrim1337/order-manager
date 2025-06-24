import { shuffle } from '@/lib/utils';
import { useEffect, useState } from 'react';

export function useShuffledColors<T>(items: T[]) {
  const [shuffled, setShuffled] = useState<T[]>([]);

  useEffect(() => {
    setShuffled(shuffle([...items]));
  }, [items]);

  return shuffled;
}
