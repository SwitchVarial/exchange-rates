import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Pressable,
  Text,
  ActivityIndicator,
  Keyboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";

// api key google 4oz2LA8Bw1n0ixX0rCbnxTtPqYgKezWF
// api key haaga-helia nxTRsZ6bz5rYXRpl49HwIvpS0LDk2TF8

export default function App() {
  const [amount, setAmount] = useState("");
  const [currencies, setCurrencies] = useState([]);
  const [result, setResult] = useState();
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [isLoadingCurrencies, setIsLoadingCurrencies] = useState(false);
  const [isLoadingResults, setIsLoadingResults] = useState(false);
  const toCurrency = "EUR";

  const myHeaders = new Headers();
  myHeaders.append("apikey", "nxTRsZ6bz5rYXRpl49HwIvpS0LDk2TF8");

  const requestOptions = {
    method: "GET",
    redirect: "follow",
    headers: myHeaders,
  };

  const getSymbols = () => {
    setIsLoadingCurrencies(true);
    fetch(`https://api.apilayer.com/exchangerates_data/symbols`, requestOptions)
      .then((response) => response.json())
      .then((json) => {
        setCurrencies(Object.keys(json.symbols));
        setIsLoadingCurrencies(false);
      })
      .catch((error) => {
        console.log("error", error);
        setIsLoadingCurrencies(false);
      });
  };

  const convertAmount = () => {
    setIsLoadingResults(true);
    Keyboard.dismiss();
    fetch(
      `https://api.apilayer.com/exchangerates_data/convert?to=${toCurrency}&from=${fromCurrency}&amount=${amount}`,
      requestOptions
    )
      .then((response) => response.text())
      .then((json) => {
        setResult(JSON.parse(json));
        setIsLoadingResults(false);
      })
      .catch((error) => {
        console.log("error", error);
        setIsLoadingResults(false);
      });
  };

  useEffect(() => {
    getSymbols();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.row}>
        <Text style={styles.title}>Results</Text>
        <Ionicons
          name="logo-euro"
          size={26}
          color="black"
          style={{ marginTop: 13 }}
        />
      </View>
      <View style={styles.results}>
        {isLoadingResults ? (
          <ActivityIndicator size="large" color="mediumorchid" />
        ) : result !== undefined ? (
          <Text style={styles.resultsText}>{result.result.toFixed(2)} €</Text>
        ) : (
          <View style={styles.container}>
            <Text style={styles.listTitle}>Sorry, we could load results!</Text>
          </View>
        )}
      </View>
      <View style={styles.row}>
        <View>
          <Text style={styles.label}>Amount EUR</Text>
          <TextInput
            style={styles.input}
            onChangeText={(text) => setAmount(text)}
            keyboardType="decimal-pad"
          />
        </View>
        <View>
          <Text style={styles.label}>Select Currency</Text>
          <View style={styles.pickerView}>
            {isLoadingCurrencies ? (
              <ActivityIndicator size="small" color="mediumorchid" />
            ) : currencies ? (
              <Picker
                style={styles.picker}
                selectedValue={fromCurrency}
                onValueChange={(itemValue, itemIndex) =>
                  setFromCurrency(itemValue)
                }
              >
                {currencies.map((currency) => (
                  <Picker.Item
                    key={currency}
                    label={currency}
                    value={currency}
                  />
                ))}
              </Picker>
            ) : (
              <View style={styles.container}>
                <Text style={styles.listTitle}>
                  Sorry, we could not load currencies!
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
      <Pressable style={styles.button} onPress={convertAmount}>
        <View style={styles.row}>
          <Text style={styles.buttonText}>Convert</Text>
          <Ionicons name="swap-horizontal" size={24} color="white" />
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-start",
    marginTop: 100,
  },
  input: {
    width: 150,
    height: 50,
    padding: 10,
    borderRadius: 8,
    marginRight: 8,
    borderColor: "mediumorchid",
    borderWidth: 2,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    width: 308,
    height: 50,
    marginTop: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "mediumorchid",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 8,
    color: "white",
  },
  pickerView: {
    justifyContent: "center",
    backgroundColor: "white",
    height: 50,
    width: 150,
    borderRadius: 8,
    borderColor: "mediumorchid",
    borderWidth: 2,
  },
  picker: {
    color: "black",
  },
  row: {
    flexDirection: "row",
  },
  label: {
    fontSize: 12,
    marginBottom: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "mediumorchid",
    marginTop: 10,
    marginRight: 8,
  },
  resultsText: {
    height: 20,
    fontSize: 18,
    margin: 8,
  },
  results: {
    alignItems: "center",
    justifyContent: "center",
    width: 308,
    height: 50,
  },
});
