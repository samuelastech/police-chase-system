import { View, Text, Image, StyleSheet } from 'react-native';
import { Callout, Marker } from 'react-native-maps';
import { colors } from '../styles/base';
import DefaultMarker from '../assets/Marker.png';
import SupportingMarker from '../assets/MarkerSupporting.png';
import SquadMemberMarker from '../assets/MarkerSquadMember.png';

interface PositionMarkerProps {
  position: number[];
  isChasing?: boolean;
  isSupporting?: boolean;
  isSquadMember?: boolean;
  id?: string;
}

export const PositionMarker = ({
  position,
  isChasing,
  isSupporting,
  isSquadMember,
  id,
}: PositionMarkerProps) => {
  return (
    <Marker
      calloutAnchor={{
        x: 0.4,
        y: 0,
      }}
      coordinate={{
        latitude: position[0],
        longitude: position[1],
      }}
      identifier={id}
      anchor={{ x: 0.5, y: 0.4 }}
    >
      {isChasing ? (
        <View style={styles.radius}>
          <Image source={DefaultMarker} style={styles.marker} />
        </View>
      ) : isSupporting ? (
        <Image source={SupportingMarker} style={styles.marker} />
      ) : isSquadMember ? (
        <Image source={SquadMemberMarker} style={styles.marker} />
      ) : (
        <Image source={DefaultMarker} style={styles.marker} />
      )}

      <Callout>
        <View>
          <Text>Você está aqui!</Text>
        </View>
      </Callout>
    </Marker>
  );
};

const styles = StyleSheet.create({
  marker: {
    height: 35,
    width: 35,
  },

  radius: {
    padding: 45,
    borderRadius: 100,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.red[500],
    backgroundColor: colors.red['0.25'],
  },
});
