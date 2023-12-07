import { Socket } from 'socket.io-client';

interface WorkingProps {
  connection: Socket;
  position: number[];
}

export interface ChasingProps extends WorkingProps, SetSupporters {
  toggleChasing: () => void;
}

export interface SupportingProps extends WorkingProps, SetSupporters {
  toggleSupporting: () => void;
  occurrenceId?: string;
}

interface SetSupporters {
  setSupportPosition: (chasingId: string, position: number[]) => void;
}

export interface PatrollingProps extends ChasingProps, SupportingProps {
  setCurrentOccurrence: (occurrenceId: string) => void;
}

export interface AcceptOrRejectPopupProps {
  isOpen: boolean;
  accept: () => void;
  reject: () => void;
}

export interface SupportPosition {
  [chaserId: string]: number[];
}
