import React from "react";
import { View, StyleSheet, ImageSourcePropType } from "react-native";
import OnboardingCard from "./OnboardingCard";
import { OnboardingItem } from "../../constants/onboardingItems";

type OnboardingContainerProps = {
    onboardingData: OnboardingItem[];
    activeIndex: number;
}

export default function OnboardingContainer({ onboardingData, activeIndex }: OnboardingContainerProps) {
    return (
        <View style={styles.container}>
            {onboardingData.map((item, index) => (
                <View key={index}>
                    {index === activeIndex && <OnboardingCard onboardingItem={item} />}
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 5,
    },
});
