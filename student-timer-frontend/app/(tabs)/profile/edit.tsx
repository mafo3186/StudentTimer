import React, { useState } from "react";
import { Alert } from "react-native";
import { View, ScrollView } from "@/components/Themed";
import { useRouter } from "expo-router";
import { BASE_STYLES } from "@/constants/Theme";
import { useAuth } from "@/context/AuthContext";
import UserDetailsInput from "@/components/userInput/UserDetailsInput";
import PasswordInput from "@/components/userInput/PasswordInput";
import Pressable from "@/components/Pressable";
import { useToast } from "react-native-toast-notifications";
import ProfilePicture from "@/components/profile/ProfilePicture";

export default function Edit() {

    const toast = useToast();
    const { onUpdate, onRemove, onChangePassword, authState } = useAuth();
    const router = useRouter();

    const defaultPic = require("../../../assets/images/profile/profile-picture.jpg");

    const [isChanged, setIsChanged] = useState(false);

    const [userName, setUserName] = useState(authState?.user.name || "");
    const [userStudyCourse, setUserStudyCourse] = useState(authState?.user.studyCourse || "");
    const [userEmail, setUserEmail] = useState(authState?.user.email || "");
    const [userPassword, setUserPassword] = useState("");
    const [userCheckPassword, setUserCheckPassword] = useState("");

    const [nameError, setNameError] = useState("");
    const [studyCourseError, setStudyCourseError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [error, setError] = useState("");


    {/* Profilbilder */}
    const defaultPictureName="profile-picture.jpg";
    const profilePictureBasePath = "../../../assets/images/profile/";

    const userProfilePicture = authState?.user.profilePicture || defaultPictureName;
    const [profilePicture, setProfilePicture] = useState<string>(userProfilePicture);

    const userImagePath = userProfilePicture === 'empty'
        ? `${profilePictureBasePath}${defaultPictureName}`
        : `${profilePictureBasePath}${userProfilePicture}`;
    const [imagePath, setImagePath] = useState<string>(userImagePath);



    console.log("#### useState:", userProfilePicture, typeof userProfilePicture);
    console.log("authState?.user.profilePicture", authState?.user.profilePicture, typeof authState?.user.profilePicture);
    console.log("imagePath", imagePath);

    const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>) => {
        return (value: string) => {
            setter(value);
            setIsChanged(true);
        };
    };

    const validateInput = () => {
        let nameValid = false;
        if (userName.length === 0) {
            setNameError("Name ist erforderlich");
        } else {
            setNameError("");
            nameValid = true;
        }

        let studyCourseValid = false;
        if (userStudyCourse.length === 0) {
            setStudyCourseError("Studienfach ist erforderlich");
        } else {
            setStudyCourseError("");
            studyCourseValid = true;
        }

        let emailValid = false;
        if (userEmail.length === 0) {
            setEmailError("E-Mail ist erforderlich");
        } else if (userEmail.length < 6) {
            setEmailError("E-Mail sollte mindestens 6 Zeichen lang sein");
        } else if (userEmail.indexOf(" ") >= 0) {
            setEmailError("E-Mail kann keine Leerzeichen enthalten");
        } else {
            setEmailError("");
            emailValid = true;
        }
        return (nameValid && studyCourseValid && emailValid);
    };

    const validatePassword = () => {
        let passwordValid = false;
        if (userPassword.length === 0) {
            setPasswordError("Passwort ist erforderlich");
        } else if (userPassword.length < 6) {
            setPasswordError("Das Passwort sollte mindestens 6 Zeichen lang sein");
        } else if (userPassword.indexOf(" ") >= 0) {
            setPasswordError("Passwort kann keine Leerzeichen enthalten");
        } else if (userPassword != userCheckPassword) {
            setPasswordError("Passwörter stimmen nicht überein");
        } else {
            setPasswordError("");
            passwordValid = true;
        }
        return passwordValid;
    }

    const cancel = () => {
        router.push("/profile/");
        console.log("Abbrechen");
    };

    const update = async () => {
        if (validateInput()) {
            const id = toast.show("Speichern...", { type: "loading" });
            const result = await onUpdate!(
                userName,
                userStudyCourse,
                userEmail,
            );
            console.log("validateInput");
            if (result && result.error) {
                setError(result.msg);
                toast.update(id, result.msg, { type: "danger" });
            } else {
                toast.update(id, "Profildaten erfolgreich gespeichert", {
                    type: "success",
                });
                router.push("/profile/");
            }
        } else {
            toast.show("Korrektur notwendig", { type: "danger" });
        }
    };

    const changePassword = async () => {
        if (validatePassword()) {
            const result = await onChangePassword!(
                userPassword,
                userCheckPassword,
            );
            if (result && result.error) {
                setError(result.msg);
            } else {
                toast.show("Passwort erfolgreich geändert", { type: "success" });
                router.push("/profile/");
            }
        }
    };

    const removeUser = async () => {
        console.log("User removed:", authState?.user.email)
        let id = toast.show("Löschen...", { type: "loading" });
        if (authState?.user.id) {
            const result = await onRemove!(
                authState?.user.id
            );
            console.log("remove")
            if (result && result.error) {
                setError(result.msg);
            } else {
                toast.update(id, "Ihr Konto wurde erfolgreich gelöscht", { type: "success" });
                router.push("/(auth)/signup");
            }
        }
    };

  const onCancel = () => {
    if (isChanged) {
      console.log(
        "Alert für Änderung verwerfen aktiviert:",
        authState?.user.email
      );
      Alert.alert(
        "Änderungen verwerfen?",
        `Sie haben ungespeicherte Änderungen vorgenommen. Wenn Sie fortfahren, gehen alle ungespeicherten Daten verloren. Möchten Sie wirklich abbrechen?`,
        [
          {
            text: "Nein",
            onPress: () => console.log("Alert closed"),
            style: "cancel",
          },
          {
            text: "Ja",
            onPress: () => {
              cancel();
            },
            style: "destructive",
          },
        ],
        { cancelable: false }
      );
    } else {
      cancel();
    }
  };

  const onDelete = () => {
    console.log("Alert für User-Löschung aktiviert:", authState?.user.email);
    Alert.alert(
      "Profil wirklich löschen?",
      `Möchtest du deinen Account mit der E-Mail-Adresse "${authState?.user.email}" wirklich unwiderruflich löschen? Alle zum Profil gehörenden Daten, Module, Lerneinheiten und Trackings werden dabei gelöscht.`,
      [
        {
          text: "Abbrechen",
          onPress: () => console.log("Alert closed"),
          style: "cancel",
        },
        {
          text: "Löschen",
          onPress: () => {
            removeUser();
          },
          style: "destructive",
        },
      ],
      { cancelable: false }
    );
  };

  return (
      <ScrollView contentContainerStyle={{borderRadius: BASE_STYLES.borderRadius}}>
          <View style={{ alignItems: "center" }}>
              <ProfilePicture imagePath={imagePath} editMode={true}/>
              <UserDetailsInput
                  title={"Daten bearbeiten"}
                  userName={userName}
                  setUserName={handleInputChange(setUserName)}
                  nameError={nameError}
                  userStudyCourse={userStudyCourse}
                  setUserStudyCourse={handleInputChange(setUserStudyCourse)}
                  studyCourseError={studyCourseError}
                  userEmail={userEmail}
                  setUserEmail={handleInputChange(setUserEmail)}
                  emailError={emailError}
                  buttonAction={update}
                  disabled={!isChanged}
                  cancelAction={onCancel}
              />
              <PasswordInput
                  title={"Passwort ändern"}
                  userPassword={userPassword}
                  setUserPassword={handleInputChange(setUserPassword)}
                  userCheckPassword={userCheckPassword}
                  setUserCheckPassword={handleInputChange(setUserCheckPassword)}
                  passwordError={passwordError}
                  buttonAction={changePassword}
                  disabled={!isChanged}
                  cancelAction={onCancel}
              />
              <Pressable style={{ marginBottom: 40 }}
                  text={"Konto löschen"}
                  textColor={"#F00"}
                  ariaLabel={"Konto löschen"}
                  accessibilityRole={"button"}
                  onPress={onDelete}
              />
          </View>
      </ScrollView>
  );
}

