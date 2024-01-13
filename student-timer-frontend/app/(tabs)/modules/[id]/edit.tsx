import Button from "@/components/Button";
import { H2, P } from "@/components/StyledText";
import { View } from "@/components/Themed";
import LearningUnitRow from "@/components/modules/LearningUnitRow";
import ModuleForm from "@/components/modules/ModuleForm";
import { LearningUnitEnum } from "@/constants/LearningUnitEnum";
import { COLORTHEME } from "@/constants/Theme";
import { useAuth } from "@/context/AuthContext";
import { useAxios } from "@/context/AxiosContext";
import { useModules } from "@/context/ModuleContext";
import { computeRemainingSessionTime } from "@/libs/moduleTypeHelper";
import { LearningUnitType } from "@/types/LearningUnitType";
import { ModuleType } from "@/types/ModuleType";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Plus } from "lucide-react-native";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
} from "react-native";
import { useToast } from "react-native-toast-notifications";

export default function EditModule() {
  const { id: moduleToEditId } = useLocalSearchParams<{
    id: string;
  }>();

  const toast = useToast();
  const { authState } = useAuth();
  const { authAxios } = useAxios();
  const { modules, fetchModules } = useModules();
  const router = useRouter();

  const fetchDetailModule = () => {
    if (modules && modules.length > 0) {
      var filteredModule: ModuleType | undefined = modules.find(
        (module) => module.id.toString() === moduleToEditId
      );
      if (filteredModule) {
        // setModuleError(false);
        return filteredModule;
      }
    }

    return {
      id: -1,
      name: "",
      colorCode: "",
      creditPoints: 0,
      examDate: new Date(),
      learningUnits: [],
      learningSessions: [],
      totalLearningSessionTime: 0,
      totalLearningUnitTime: 0,
      totalLearningTime: 0,
      totalModuleTime: 0,
    } as ModuleType;
  };

  const [detailModule, setDetailModule] = useState<ModuleType>(
    fetchDetailModule()
  );
  const [dateDiabled, setDateDisabled] = useState(
    detailModule.examDate ? false : true
  );

  const [moduleNameError, setModuleNameError] = useState("");
  const [creditPointError, setCreditPointError] = useState("");

  const validateInput = () => {
    var nameValid = false;
    if (detailModule.name.trim().length == 0) {
      setModuleNameError(() => "Name ist erforderlich");
    } else {
      setModuleNameError(() => "");
      nameValid = true;
    }

    var creditPointsValid = false;
    if (+detailModule.creditPoints <= 0) {
      setCreditPointError(
        () => "Creditpoints muss einen Wert größer 0 enthalten"
      );
    } else {
      setCreditPointError(() => "");
      creditPointsValid = true;
    }

    return nameValid && creditPointsValid;
  };

  const handleUpdate = (module: ModuleType, disabledStatus?: boolean) => {
    if (module) setDetailModule(module);
    if (disabledStatus != undefined) setDateDisabled(disabledStatus);
    validateInput();
  };

  const onSave = async () => {
    if (validateInput()) {
      let toastId = toast.show("Änderungen speichern...");
      let response;

      try {
        let moduleDTO;
        if (detailModule.examDate && !dateDiabled) {
          moduleDTO = {
            name: detailModule.name,
            examDate: detailModule.examDate,
            colorCode: detailModule.colorCode,
            creditpoints: +detailModule.creditPoints,
          };
        } else {
          moduleDTO = {
            name: detailModule.name,
            colorCode: detailModule.colorCode,
            creditpoints: +detailModule.creditPoints,
          };
        }

        response = await authAxios?.put(
          `/students/${authState?.user.id}/modules/${moduleToEditId}`,
          moduleDTO
        );
        const createdModule: ModuleType | undefined = response?.data;
        // learningUnits.forEach(async (unit: LearningUnitType) => {
        //   await authAxios?.post(
        //     `/students/${authState?.user.id}/modules/${createdModule?.id}/learningUnits`,
        //     {
        //       name: unit.name,
        //       startDate: unit.startDate.toISOString().substring(0, 10),
        //       endDate: unit.endDate.toISOString().substring(0, 10),
        //       workloadPerWeek: unit.workloadPerWeek,
        //     }
        //   );
        // });

        toast.update(toastId, "Änderungen erfolgreich gespeichert.", {
          type: "success",
        });
        fetchModules && (await fetchModules());
        router.replace("/(tabs)/modules");
      } catch (e) {
        toast.update(toastId, `Fehler beim Ändern des Moduls: ${e}`, {
          type: "danger",
        });
      }
    }
  };

  const onDelete = (learningUnitId: number) => {
    Alert.alert(
      "Lerneinheit wirklich löschen?",
      `Möchtest du die Lerneinheit ${
        detailModule.learningUnits.find((unit) => unit.id === learningUnitId)
          ?.name
      } wirklich unwiederuflich löschen?`,
      [
        {
          text: "Abbrechen",
          style: "cancel",
        },
        {
          text: "Löschen",
          onPress: () => {
            deleteLearningUnit(learningUnitId);
          },
          style: "destructive",
        },
      ],
      { cancelable: false }
    );
  };

  const deleteLearningUnit = async (learningUnitId: number) => {
    let id = toast.show("Löschen...", { type: "loading" });
    try {
      let response = await authAxios?.delete(
        `/students/${authState?.user.id}/modules/${detailModule.id}/learningUnits/${learningUnitId}`
      );
      toast.update(id, "Lerneinheit erfolgreich gelöscht", { type: "success" });
      fetchModules && (await fetchModules());
    } catch (e) {
      toast.update(id, `Fehler beim Löschen der Lerneinheit: ${e}`, {
        type: "danger",
      });
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        style={styles.scrollViewContainer}
        contentContainerStyle={styles.scrollViewContainerStyle}
      >
        <ModuleForm
          inputData={detailModule}
          onChange={handleUpdate}
          dateDiabled={dateDiabled}
          moduleNameError={moduleNameError}
          creditPointError={creditPointError}
        />
        <View style={styles.unitWrapper}>
          <View style={styles.unitHeaderRow}>
            <H2 style={{ textAlign: "left" }}>Einheiten</H2>
            <Pressable
              onPress={() =>
                router.push(`/modules/${detailModule.id}/learningUnits/new`)
              }
              style={styles.roundButton}
            >
              <Plus
                color={COLORTHEME.light.background}
                style={{ backgroundColor: "transparent" }}
              />
            </Pressable>
          </View>
          <View>
            {detailModule?.learningUnits.map((unit: LearningUnitType) => {
              if (unit.name != LearningUnitEnum.SELBSTSTUDIUM) {
                return (
                  <LearningUnitRow
                    key={unit.id}
                    learningUnit={unit}
                    selfLearningTime={computeRemainingSessionTime(
                      detailModule.totalModuleTime,
                      detailModule.totalLearningTime
                    )}
                    onDelete={() =>
                      detailModule.learningUnits.length > 1
                        ? onDelete(unit.id)
                        : toast.show(
                            "Es muss mindestens eine Lerneinheit vorhanden sein.",
                            { type: "normal" }
                          )
                    }
                    onEdit={() =>
                      router.push({
                        pathname: `modules/${detailModule.id}/learningUnits/${unit.id}/edit`,
                      } as never)
                    }
                  />
                );
              }
            })}
          </View>
        </View>
        <Button
          text="Änderungen speichern"
          backgroundColor={COLORTHEME.light.primary}
          textColor={COLORTHEME.light.grey2}
          onPress={onSave}
          style={{ width: 200, alignSelf: "center" }}
        />
        <P
          style={styles.discardLink}
          onPress={() => {
            Alert.alert(
              "Änderungen verwerfen?",
              `Wenn du fortfährst, gehen alle Änderungen ungespeichert verloren.`,
              [
                {
                  text: "Abbrechen",
                  style: "default",
                },
                {
                  text: "Verwerfen",
                  onPress: () => {
                    router.push("/modules");
                  },
                  style: "destructive",
                },
              ],
              { cancelable: false }
            );
          }}
        >
          Verwerfen
        </P>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    flexDirection: "column",
    gap: 24,
    backgroundColor: COLORTHEME.light.background,
  },
  scrollViewContainer: {
    flexGrow: 1,
    flexDirection: "column",
    gap: 24,
    backgroundColor: COLORTHEME.light.background,
  },
  scrollViewContainerStyle: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
  },
  section: {
    width: "100%",
    gap: 12,
    backgroundColor: "transparent",
  },
  flatListContainer: {
    gap: 12,
  },
  outerWrapper: {
    width: "100%",
    backgroundColor: COLORTHEME.light.grey1,
    borderRadius: 12,
    flexDirection: "column",
    justifyContent: "space-between",
    padding: 24,
    gap: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "flex-start",
    backgroundColor: "transparent",
    gap: 16,
  },
  dateRowContainer: {
    gap: 5,
    flexDirection: "column",
    backgroundColor: "transparent",
  },
  buttons: {
    flexDirection: "column",
    alignItems: "center",
    gap: 16,
  },
  colorWrapper: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: "100%",
    backgroundColor: "transparent",
    gap: 4,
  },
  inputLabelText: {
    color: COLORTHEME.light.primary,
  },
  colorOptionWrapper: {
    justifyContent: "center",
    alignItems: "center",
    width: 60,
    height: 60,
  },
  colorOptionIndicator: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -26 }, { translateY: -26 }],
    width: 52,
    height: 52,
    backgroundColor: "transparent",
    borderRadius: 1000,
    borderWidth: 4,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 1000,
  },
  discardLink: {
    fontSize: 16,
    textAlign: "center",
    textDecorationLine: "underline",
    marginBottom: 20,
  },
  unitWrapper: {
    width: "100%",
    flexDirection: "column",
    justifyContent: "flex-start",
    gap: 16,
  },
  unitHeaderRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingRight: 4,
  },
  roundButton: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    height: 40,
    width: 40,
    backgroundColor: COLORTHEME.light.primary,
  },
});