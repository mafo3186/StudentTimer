import { StyleSheet, TextInput } from "react-native";
import { useState } from "react";
import { Link, useRouter } from "expo-router";

import { COLORTHEME } from "@/constants/Theme";

import Header from "@/components/Header";
import { Title } from "@/components/StyledText";
import { View, Text } from "@/components/Themed";
import Button from "@/components/Button";
import Separator from "@/components/Separator";
import OtherLogins from "@/components/auth/OtherLogins";
import InputField from "@/components/InputField";
import { useAuth } from "@/context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [error, setError] = useState("");

  const { onLogin } = useAuth();

  const router = useRouter();

  const validateInput = () => {
    var emailValid = false;
    if (email.length == 0) {
      setEmailError("E-Mail ist erforderlich");
    } else if (email.length < 6) {
      setEmailError("E-Mail sollte mindestens 6 Zeichen lang sein");
    } else if (email.indexOf(" ") >= 0) {
      setEmailError("E-Mail kann keine Leerzeichen enthalten");
    } else {
      setEmailError("");
      emailValid = true;
    }

    var passwordValid = false;
    if (password.length == 0) {
      setPasswordError("Passwort ist erforderlich");
    } else if (password.length < 6) {
      setPasswordError("Das Passwort sollte mindestens 6 Zeichen lang sein");
    } else if (password.indexOf(" ") >= 0) {
      setPasswordError("Passwort kann keine Leerzeichen enthalten");
    } else {
      setPasswordError("");
      passwordValid = true;
    }

    if (emailValid && passwordValid) {
      return true;
    }

    return false;
  };

  const login = async () => {
    if (validateInput()) {
      const result = await onLogin!(email, password);
      if (result && result.error) {
        setError(result.msg);
      } else {
        router.push("/(tabs)/(tracking)");
      }
    }
  };

  return (
    <>
      <Header title="Login"></Header>
      <View style={styles.container}>
        <Title>Student Time Tracker</Title>
        <View style={styles.inputs}>
          <InputField
            value={email}
            onChangeText={setEmail}
            placeholder="E-Mail"
            label="E-Mail"
            keyboardType="email-address"
            message={emailError}
            messageColor="red"
            style={{ width: "100%" }}
          />
          <InputField
            value={password}
            onChangeText={setPassword}
            placeholder="Passwort"
            label="Passwort"
            keyboardType="visible-password"
            secureTextEntry={true}
            message={passwordError}
            messageColor="red"
            style={{ width: "100%" }}
          />
          <View style={styles.buttons}>
            <Button
              text="Log In"
              backgroundColor={COLORTHEME.light.primary}
              textColor={COLORTHEME.light.grey2}
              onPress={login}
            />
          </View>
          {error && <Text style={styles.errorMessage}>{error}</Text>}
          <Text>
            Sie haben kein Konto?{" "}
            <Link href="/signup" style={{ textDecorationLine: "underline" }}>
              Account erstellen
            </Link>
          </Text>
          <Separator text="oder" />
          <OtherLogins />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-around",
    paddingHorizontal: 12,
  },
  inputs: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 25,
  },
  buttons: {
    flexDirection: "column",
    width: 200,
    gap: 10,
  },
  errorMessage: {
    color: "red",
    fontSize: 14,
    textAlign: "center",
    width: "100%",
  },
});
