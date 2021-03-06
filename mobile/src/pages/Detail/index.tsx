import React, { useEffect, useState } from "react";
import Constants from "expo-constants";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
  ActivityIndicator,
  Linking,
} from "react-native";
import { Feather as Icon, FontAwesome } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { RectButton } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import api from "../../Services/api";
import * as MailComposer from "expo-mail-composer";

interface Params {
  point_id: number;
}
interface Data {
  point: {
    name: string;
    image: string;
    email: string;
    whatsapp: string;
    city: string;
    uf: string;
  };
  items: {
    title: string;
  }[];
}
const Detail = () => {
  const [data, setData] = useState<Data>({} as Data);

  const navigation = useNavigation();
  const route = useRoute();

  const routParams = route.params as Params;

  useEffect(() => {
    api.get(`points/${routParams.point_id}`).then((response) => {
      console.log(response.data);

      const data = {
        ...response.data,
        point: {
          ...response.data.point,
          image: `${response.config.baseURL}${response.data.point.image_url}`,
        },
      };
      setData(data);
    });
  }, [routParams]);

  const onBackNavigateHandler = () => {
    navigation.goBack();
  };

  const onClickWhatsAppMessage = () => {
    Linking.openURL(
      `whatsapp://send?phone=${data.point.whatsapp}&text=Tenho interese em coleta de resíduos.`
    );
  };

  const mailComposeHandler = () => {
    MailComposer.composeAsync({
      subject: "Interese na Coleta de Resíduos",
      recipients: [data.point.email],
    });
  };

  if (!data.point)
    return <ActivityIndicator style={styles.spinner} size="large" />;
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <TouchableOpacity onPress={onBackNavigateHandler}>
          <Icon name="arrow-left" size={20} color="#34cb79" />
        </TouchableOpacity>
        <Image
          style={styles.pointImage}
          source={{
            uri: data.point.image,
          }}
        />
        <Text style={styles.pointName}>{data.point.name}</Text>
        <Text style={styles.pointItems}>
          {data.items.map((item) => item.title).join(", ")}
        </Text>
        <View style={styles.address}>
          <Text style={styles.addressTitle}>Endereço</Text>
          <Text style={styles.addressContent}>
            {data.point.city}-{data.point.uf}
          </Text>
        </View>
        <View style={styles.address}>
          <FontAwesome style={styles.addressTitle} name="whatsapp" size={20} />
          <Text style={styles.addressContent}>{data.point.whatsapp}</Text>
        </View>

        <View style={styles.address}>
          <FontAwesome style={styles.addressTitle} name="envelope" size={20} />
          <Text style={styles.addressContent}>{data.point.email}</Text>
        </View>
      </View>
      <View style={styles.footer}>
        <RectButton style={styles.button} onPress={onClickWhatsAppMessage}>
          <FontAwesome name="whatsapp" size={20} color="#FFF" />
          <Text style={styles.buttonText}>Whatsapp</Text>
        </RectButton>
        <RectButton style={styles.button} onPress={mailComposeHandler}>
          <Icon name="mail" size={20} color="#FFF" />
          <Text style={styles.buttonText}>E-mail</Text>
        </RectButton>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  spinner: {
    fontSize: 80,
    fontFamily: "Roboto_400Regular",
    textAlign: "center",
    paddingTop: 50 + Constants.statusBarHeight,
    color: "#34CB79",
  },
  container: {
    flex: 1,
    padding: 32,
    paddingTop: 20,
  },

  pointImage: {
    width: "100%",
    height: 120,
    resizeMode: "cover",
    borderRadius: 10,
    marginTop: 32,
  },

  pointName: {
    color: "#322153",
    fontSize: 28,
    fontFamily: "Ubuntu_700Bold",
    marginTop: 24,
  },

  pointItems: {
    fontFamily: "Roboto_400Regular",
    fontSize: 16,
    lineHeight: 24,
    marginTop: 8,
    color: "#6C6C80",
  },

  address: {
    marginTop: 32,
  },

  addressTitle: {
    color: "#322153",
    fontFamily: "Roboto_500Medium",
    fontSize: 16,
  },

  addressContent: {
    fontFamily: "Roboto_400Regular",
    lineHeight: 24,
    marginTop: 8,
    color: "#6C6C80",
  },

  footer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: "#999",
    paddingVertical: 20,
    paddingHorizontal: 32,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  button: {
    width: "48%",
    backgroundColor: "#34CB79",
    borderRadius: 10,
    height: 50,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    marginLeft: 8,
    color: "#FFF",
    fontSize: 16,
    fontFamily: "Roboto_500Medium",
  },
});

export default Detail;
