import { ReactNode, createContext, useMemo } from 'react';
import { Socket, io } from 'socket.io-client';
import useAuth from '../hooks/useAuth';

export interface WorkProps {
  socket: Socket;
}

const WorkContext = createContext({
  socket: {},
} as WorkProps);

interface WorkProviderProps {
  children?: ReactNode;
}

export const WorkProvider = ({ children }: WorkProviderProps) => {
  const { auth } = useAuth();
  const socket = useMemo(() => {
    return io(process.env.EXPO_PUBLIC_SOCKET_SERVER as string, {
      transportOptions: {
        polling: {
          extraHeaders: {
            Authorization: auth.accessToken,
          },
        },
      },
    }).connect();
  }, []);

  return <WorkContext.Provider value={{ socket }}>{children}</WorkContext.Provider>;
};

export default WorkContext;
