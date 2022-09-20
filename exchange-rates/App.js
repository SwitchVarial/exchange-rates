import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import { StyleSheet, View, TextInput, Pressable, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";

// api key 4oz2LA8Bw1n0ixX0rCbnxTtPqYgKezWF

export default function App() {
  const [amount, setAmount] = useState("");
  const [symbols, setSymbols] = useState([]);
  const [result, setResult] = useState();
  const [currency, setCurrency] = useState("");

  const myHeaders = new Headers();
  myHeaders.append("apikey", "4oz2LA8Bw1n0ixX0rCbnxTtPqYgKezWF");

  const requestOptions = {
    method: "GET",
    redirect: "follow",
    headers: myHeaders,
  };

  const getSymbols = () => {
    fetch(`https://api.apilayer.com/exchangerates_data/symbols`, requestOptions)
      .then((response) => response.json())
      .then((json) => {
        setSymbols(Object.keys(json.symbols));
      })
      .catch((error) => {
        Alert.alert("Error", error);
      });
  };

  const convertAmount = () => {
    fetch(
      `https://api.apilayer.com/exchangerates_data/convert?to=EUR&from=${currency}&amount=${amount}`,
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => {
        setResult(JSON.parse(result));
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  useEffect(() => {
    getSymbols();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text>{result ? result.result : ""}</Text>
      <Picker
        style={styles.pickerStyles}
        selectedValue={currency}
        onValueChange={(itemValue, itemIndex) => setCurrency(itemValue)}
      >
        {symbols.map((symbol) => (
          <Picker.Item key={symbol} label={symbol} value={symbol} />
        ))}
      </Picker>
      <TextInput
        style={styles.input}
        onChangeText={(text) => setAmount(text)}
        keyboardType="decimal-pad"
      />
      <Pressable style={styles.button} onPress={convertAmount}>
        <Ionicons name="search" size={24} color="white" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    width: 200,
    height: 50,
    padding: 10,
    borderRadius: 8,
    margin: "2%",
    borderColor: "mediumorchid",
    borderWidth: 2,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "mediumorchid",
  },
  pickerStyles: {
    width: "70%",
    backgroundColor: "gray",
    color: "white",
  },
});
