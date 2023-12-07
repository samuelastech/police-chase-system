import { useContext } from 'react';
import PatrolContext from '../context/PatrolProvider';

const usePatrol = () => {
  return useContext(PatrolContext);
};

export default usePatrol;
