import { Text, View,StyleSheet} from "react-native";
import colors from "../constants/colors";

const SaleScreen=()=> {
  return (
    <View style={styles.screen}>
      <Text style={styles.text}>Sale coming soon..</Text>
    </View>
  );
}
const styles = StyleSheet.create({
    screen: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor:colors.white
    },
    text: {
      fontSize: 18,
    },
  });
  
export default SaleScreen;