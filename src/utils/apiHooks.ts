import type { RouterInputs } from 'utils/api';
import { api } from 'utils/api';

export function useMenuPositions({
  category,
}: RouterInputs['entities']['getPositions']) {
  return api.entities.getPositions.useQuery(
    {
      category,
    },
    { staleTime: Infinity }
  );
}
