import { Patrolling, Chasing, Supporting } from '../components/';

import { usePatrol } from '../hooks';

export const PatrollingMap = () => {
  const { isChasing, isSupporting } = usePatrol();

  return <>{isChasing ? <Chasing /> : isSupporting ? <Supporting /> : <Patrolling />}</>;
};
