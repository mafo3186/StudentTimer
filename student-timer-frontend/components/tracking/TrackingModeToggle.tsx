//@ts-ignore
import SwitchSelector from "react-native-switch-selector";

import { COLORTHEME, COLORS } from "@/constants/Theme";

export default function TrackingModeToggle(props: {
  onPress: React.Dispatch<React.SetStateAction<any>>;
  disabled: boolean;
}) {
  const { onPress, disabled } = props;

  return (
    <SwitchSelector
      options={[
        { label: "Stoppuhr", value: true },
        { label: "Timer", value: false },
      ]}
      style={{
        opacity: disabled ? 0.5 : undefined,
      }}
      initial={0}
      onPress={onPress}
      backgroundColor={COLORTHEME.light.primary}
      buttonColor={COLORS.white}
      selectedColor={COLORTHEME.light.primary}
      textColor={COLORS.white}
      hasPadding
      valuePadding={4}
      borderWidth={0}
      fontSize={16}
      textStyle={{ fontFamily: "OpenSans_SemiBold" }}
      selectedTextStyle={{ fontFamily: "OpenSans_SemiBold" }}
      disabled={disabled}
    />
  );
}
