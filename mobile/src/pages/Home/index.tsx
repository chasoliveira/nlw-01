import React, { useState, useEffect } from "react";
import {
  View,
  Image,
  StyleSheet,
  Text,
  ImageBackground,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import Constants from "expo-constants";
import { RectButton } from "react-native-gesture-handler";
import { Feather as Icon, FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import RNPickerSelect from "react-native-picker-select";
import { ibgeApi } from "../../Services/api";

interface IBGEUFRes {
  sigla: string;
}

interface IBGECityRes {
  nome: string;
}
interface UF {
  initial: string;
  cities: string[];
}

const Home = () => {
  const [ufs, setUfs] = useState<UF[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [uf, setUf] = useState<UF>({} as UF);
  const [ufLoading, setUfLoading] = useState(true);
  const [cityLoading, setCityLoading] = useState(false);
  const [city, setCity] = useState("");

  const navigation = useNavigation();

  const setUfsOrdered = (ufs: UF[]) => {
    const order = ufs.sort((a, b) => (a.initial < b.initial ? -1 : 0));
    setUfs(order);
  };
  useEffect(() => {
    setUfLoading(true);
    ibgeApi.get<IBGEUFRes[]>("estados").then((response) => {
      const ufInitials = response.data.map((uf) => ({
        initial: uf.sigla,
        cities: [],
      }));
      setUfsOrdered(ufInitials);
      setUfLoading(false);
    });
  }, []);

  useEffect(() => {
    let currentUf = ufs.find((u) => u.initial === uf.initial) as UF;
    if (!currentUf) return;
    if (currentUf.cities.length > 0) {
      setCities([...currentUf.cities]);
      return;
    }
    setCityLoading(true);
    ibgeApi
      .get<IBGECityRes[]>(`estados/${uf.initial}/municipios`)
      .then((response) => {
        const citiesByUf = response.data.map((city) => city.nome);
        currentUf.cities = citiesByUf;
        const incomingUF = [
          ...ufs.filter((u) => u.initial !== uf.initial),
          currentUf,
        ];
        console.log("incomingUF", incomingUF);

        setUfsOrdered(incomingUF);
        setCities([...currentUf.cities]);
        setCityLoading(false);
      })
      .catch((err) => console.log("error", err));
  }, [uf]);

  const onNavigation = () => {
    navigation.navigate("Points", { uf: uf.initial, city });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS == "ios" ? "padding" : undefined}
    >
      <ImageBackground
        style={styles.container}
        source={require("../../assets/home-background.png")}
        imageStyle={{ width: 274, height: 368 }}
      >
        <View style={styles.main}>
          <Image source={require("../../assets/logo.png")} />
          <View>
            <Text style={styles.title}>
              Seu marketplace de coleta de resíduos
            </Text>
            <Text style={styles.description}>
              Ajudamos pessoas a encotrarem pontos de coleta de forma eficiente.
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          {ufLoading ? (
            <ActivityIndicator style={styles.spinner} size="large" />
          ) : (
            <RNPickerSelect
              style={pickerSelectStyles}
              placeholder={{ label: "Selecione uma UF" }}
              value={uf.initial}
              onValueChange={(value) =>
                setUf({ ...(ufs.find((u) => u.initial === value) as UF) })
              }
              items={ufs.map((uf) => ({
                label: uf.initial,
                value: uf.initial,
              }))}
              Icon={() => <Icon name="chevron-down" size={25} />}
            />
          )}
          {cityLoading ? (
            <ActivityIndicator style={styles.spinner} size="large" />
          ) : (
            <RNPickerSelect
              style={pickerSelectStyles}
              placeholder={{ label: "Selecione uma Cidade" }}
              value={city}
              disabled={ufLoading || cities.length === 0}
              onValueChange={(value) => setCity(value)}
              items={cities.map((city) => ({
                label: city,
                value: city,
              }))}
              Icon={() => <Icon name="chevron-down" size={25} />}
            />
          )}
          <RectButton style={styles.button} onPress={onNavigation}>
            <View style={styles.buttonIcon}>
              <Text>
                <Icon name="arrow-right" color="#FFF" size={24} />
              </Text>
            </View>
            <Text style={styles.buttonText}>Entrar</Text>
          </RectButton>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    height: 60,
    backgroundColor: "#FFF",
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,

    paddingVertical: 12,
    borderWidth: 1,
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    height: 60,
    backgroundColor: "#FFF",
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,

    // paddingVertical: 8,
    // borderWidth: 0.5,
    // paddingRight: 30, // to ensure the text is never behind the icon
  },
  iconContainer: {
    fontSize: 16,
    top: 18,
    right: 15,
  },
});

const styles = StyleSheet.create({
  spinner: {
    fontSize: 80,
    fontFamily: "Roboto_400Regular",
    textAlign: "center",
    paddingTop: 50,
    color: "#34CB79",
  },
  container: {
    flex: 1,
    padding: 32,
  },

  main: {
    flex: 1,
    justifyContent: "center",
  },

  title: {
    color: "#322153",
    fontSize: 32,
    fontFamily: "Ubuntu_700Bold",
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: "#6C6C80",
    fontSize: 16,
    marginTop: 16,
    fontFamily: "Roboto_400Regular",
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  select: {},

  input: {
    height: 60,
    backgroundColor: "#FFF",
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  button: {
    backgroundColor: "#34CB79",
    height: 60,
    flexDirection: "row",
    borderRadius: 10,
    overflow: "hidden",
    alignItems: "center",
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    flex: 1,
    justifyContent: "center",
    textAlign: "center",
    color: "#FFF",
    fontFamily: "Roboto_500Medium",
    fontSize: 16,
  },
});
export default Home;
