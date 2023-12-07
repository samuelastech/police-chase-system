import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'

const useNavigate = () => {
  return useNavigation<NativeStackNavigationProp<any>>()
}

export default useNavigate
