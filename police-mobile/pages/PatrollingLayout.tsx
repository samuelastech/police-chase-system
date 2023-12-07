import { PatrolProvider } from '../context';
import { PatrollingMap } from './PatrollingMap';

export const PatrollingLayout = () => {
  return (
    <PatrolProvider>
      <PatrollingMap />
    </PatrolProvider>
  );
};
