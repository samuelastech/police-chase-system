import { Marker, Popup } from 'react-leaflet';
import { LatLngExpression, Icon, Point } from 'leaflet';

interface Props {
  position: LatLngExpression;
  isChasing?: boolean;
  isSupporting?: boolean;
  ip: string;
}

const setIcon = (filename: string) => {
  return new Icon({
    iconUrl: require(`../images/${filename}.png`),
    iconRetinaUrl: require(`../images/${filename}.png`),
    iconSize: new Point(30, 30),
  });
}

const marker = (MarkerIcon: Icon, position: LatLngExpression, ip: string) => {
  return (
    <Marker icon={MarkerIcon} position={position}>
      <Popup>
        <a href={`http://${ip}:81/stream`} target='_blank' rel="noreferrer">Abrir câmera no IP: {ip ? ip : 'Não tem server'}</a>
      </Popup>
    </Marker>
  );
}

export const PositionMarker = ({ position, isChasing, isSupporting, ip }: Props) => {
  
  if (isChasing) {
    const MarkerOccurrence = setIcon('MarkerOccurrence');
    return marker(MarkerOccurrence, position, ip);
  } else if (isSupporting) {
    const MarkerSupporting = setIcon('MarkerSupporting');
    return marker(MarkerSupporting, position, ip);
  } else {
    const MarkerPatrol = setIcon('MarkerPatrol');
    return marker(MarkerPatrol, position, ip);
  }
}
