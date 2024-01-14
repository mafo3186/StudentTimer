import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import Picker, { Item } from "react-native-picker-select";
import { useFocusEffect } from "expo-router";

import { useModules } from "@/context/ModuleContext";
import { COLORTHEME } from "@/constants/Theme";
import { View, Text } from "@/components/Themed";
import { ModuleType } from "@/types/ModuleType";

export default function ModulePicker(props: {
  setSelectedModule?: React.Dispatch<React.SetStateAction<ModuleType>>;
}) {
  const { setSelectedModule: setSelectedModuleCallback } = props;
  const { modules, fetchModules } = useModules();
  const [selectedModuleId, setSelectedModuleId] = useState<number>();
  const [selectedModule, setSelectedModule] = useState({} as ModuleType);

  useFocusEffect(
    React.useCallback(() => {
      (async () => {
        fetchModules && (await fetchModules());
      })();
    }, [])
  );

  useEffect(() => {
    if (modules?.length) {
      setSelectedModuleId(modules[0].id);
      setSelectedModule(modules[0]);
      setSelectedModuleCallback && setSelectedModuleCallback(modules[0]);
    }
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.inputLabelText}>Modul</Text>
      <View style={styles.pickerContainer}>
        <View
          style={[
            styles.color,
            {
              backgroundColor: selectedModule
                ? selectedModule.colorCode
                : "transparent",
            },
          ]}
        />
        <Picker
          style={{
            viewContainer: styles.picker,
            inputWeb: { ...styles.picker, ...styles.pickerText },
            inputAndroid: styles.pickerText,
            inputIOS: { ...styles.pickerText, paddingHorizontal: 10 },
          }}
          placeholder={{}}
          value={selectedModuleId}
          items={
            modules?.length
              ? modules.map((module) => {
                  return {
                    key: module.id,
                    label: module.name,
                    value: module.id,
                  } as Item;
                })
              : []
          }
          onValueChange={(moduleId: number) => {
            setSelectedModuleId(moduleId);
            let module = modules?.find((module) => module.id === moduleId);
            if (!module) return;
            setSelectedModule(module);
            setSelectedModuleCallback && setSelectedModuleCallback(module);
          }}
          //@ts-ignore
          InputAccessoryView={() => null}
          disabled={!modules?.length}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 5,
  },
  color: {
    width: 16,
    height: 16,
    borderRadius: 1000,
  },
  pickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORTHEME.light.grey2,
    borderRadius: 12,
    height: 40,
    paddingHorizontal: 10,
    gap: 8,
  },
  picker: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "transparent",
    border: 0,
  },
  pickerText: {
    color: COLORTHEME.light.grey3,
  },
  inputLabelText: {
    color: COLORTHEME.light.primary,
  },
});
