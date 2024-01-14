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
      setSelectedModuleCallback && setSelectedModuleCallback(modules[0]);
    }
  }, []);

  return (
    <View style={styles.pickerContainer}>
      <Text style={styles.inputLabelText}>Modul</Text>
      <View>
        <Picker
          style={{
            viewContainer: styles.picker,
            inputWeb: { ...styles.picker },
            inputIOS: { paddingHorizontal: 10 },
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
  pickerContainer: {
    gap: 5,
  },
  picker: {
    backgroundColor: COLORTHEME.light.grey2,
    border: 0,
    borderRadius: 12,
    height: 40,
    justifyContent: "center",
  },
  inputLabelText: {
    color: COLORTHEME.light.primary,
  },
});
