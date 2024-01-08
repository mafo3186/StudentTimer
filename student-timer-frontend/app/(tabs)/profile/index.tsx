import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import Button from "@/components/Button";
import { COLORTHEME } from "@/constants/Theme";
import { User2 } from "lucide-react-native";
import { LogOutIcon } from "lucide-react-native";
import {Link, router} from "expo-router";
import { useAuth } from "@/context/AuthContext";
import {Header} from "@react-navigation/elements";

export default function Profile() {

  const { onLogout, authState } = useAuth();

  const images: { [key: string]: any } = {
    "phil.jpg": require("../../../assets/images/profile/phil.jpg"),
    "mareike.jpg": require("../../../assets/images/profile/mareike.jpg"),
    "carlo.jpg": require("../../../assets/images/profile/carlo.jpg"),
    "nils.png": require("../../../assets/images/profile/nils.png"),
    "konstantin.png": require("../../../assets/images/profile/konstantin.png"),
    "": require("../../../assets/images/profile/profile-picture.jpg"),
    "default.jpg": require("../../../assets/images/profile/profile-picture.jpg"),
  };

  const defaultPic = require("../../../assets/images/profile/profile-picture.jpg");
  //const pic = require("../../../assets/images/profile/phil.jpg");


  // toDo: Bildabfrage ermöglichen statt defaultPic
  const user = {
    name: authState?.user.name,
    studySubject: authState?.user.studyCourse,
    profileImage: defaultPic,
    //profileImage: authState?.user.profilePicture,
    //profileImage: authState?.user.profilePicture in images ? images[authState?.user.profilePicture] : images["default.jpg"],
  };

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
      </View>
      <Button
          text="Logout"
          backgroundColor={'transparent'}
          textColor={COLORTHEME.light.text}
          onPress={onLogout}
          style={{ width: 200 }}
      />
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
