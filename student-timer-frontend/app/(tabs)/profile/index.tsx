import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import Button from "@/components/Button";
import { COLORTHEME } from "@/constants/Theme";
import { User2 } from "lucide-react-native";
import {router, useRouter} from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { deleteStoredItem } from "@/libs/deviceStorage";
import { useAuth } from "@/context/AuthContext";

export default function Profile() {

  const { onLogout, authState } = useAuth();

  const pic = require("../../../assets/images/profile-picture.jpg");

  const user = {
    name: authState?.user.name,
    studySubject: authState?.user.studyCourse,
    profileImage: pic,
  };

  /* const user = {
    name: "Maxine Hellas",
    studySubject: "Master Medieninformatik",
    profileImage: pic,
  };*/

  const handleEditProfile = () => {
    router.push("/profile/edit/");
    console.log("Profil bearbeiten");
  };

  const handleExportData = () => {
    // Hier implementiere die Logik für den Datenexport
    console.log("Daten exportieren");
  };

  return (
    <View style={styles.container}>
      {/* Profilbild */}
      <View style={styles.profileImageContainer}>
        {user.profileImage ? (
          <Image source={user.profileImage} style={styles.profileImage} />
        ) : (
          <User2 size={100} color={COLORTHEME.light.primary} />
        )}
      </View>

      {/* Benutzerinformationen */}
      <Text style={styles.title}>{user.name}</Text>
      <Text>{user.studySubject}</Text>

      {/* Aktionen */}
      <View style={styles.actionContainer}>
        <Button
          text="Profil bearbeiten"
          backgroundColor={COLORTHEME.light.primary}
          textColor="#FFFFFF"
          onPress={handleEditProfile}
        />
        <Button
          text="Daten exportieren"
          backgroundColor={COLORTHEME.light.primary}
          textColor="#FFFFFF"
          onPress={handleExportData}
        />
        <Button
          text="Logout"
          backgroundColor={COLORTHEME.light.primary}
          textColor="#FFFFFF"
          onPress={onLogout}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORTHEME.light.background,
  },
  profileImageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#EEEAEA",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderColor: COLORTHEME.light.primary,
    borderWidth: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  actionContainer: {
    flexDirection: "column",
    width: 200,
    gap: 15,
    marginTop: 20,
  },
});