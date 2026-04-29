import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useAppDispatch, useAppSelector } from "./reduxHooks";
import {
  deleteReceiptLogoBase64,
  saveReceiptLogoBase64,
  toImageDataUri,
} from "@/utils/pick-receipt-logo";
import { setBase64ReceiptLogo } from "./Store/storeSlice";

export function ReceiptLogoPicker() {
  const dispatch = useAppDispatch();

  const customLogoBase64 = useAppSelector(
    (state) => state.store.base64ReceiptLogo,
  );

  const [isProcessing, setIsProcessing] = useState(false);

  const hasCustomLogo = Boolean(customLogoBase64);

  const handlePickLogo = async () => {
    try {
      setIsProcessing(true);

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.6,
        base64: true,
      });

      if (result.canceled) {
        return;
      }

      const asset = result.assets[0];

      if (!asset.base64) {
        Alert.alert(
          "Failed",
          "Selected image could not be converted to base64.",
        );
        return;
      }

      const savedBase64 = await saveReceiptLogoBase64(asset.base64);

      dispatch(setBase64ReceiptLogo(savedBase64));
    } catch (error) {
      Alert.alert("Failed", "Could not select receipt logo.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRemoveLogo = async () => {
    try {
      setIsProcessing(true);

      await deleteReceiptLogoBase64();

      dispatch(setBase64ReceiptLogo(""));
    } catch (error) {
      Alert.alert("Failed", "Could not remove receipt logo.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <View style={styles.card} className="mx-5 mb-5">
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.title}>Receipt Logo</Text>
          <Text style={styles.description}>
            Choose a custom logo from your gallery. If empty, the default logo
            will be used.
          </Text>
        </View>
      </View>

      <View style={styles.previewBox}>
        {hasCustomLogo ? (
          <Image
            source={{ uri: toImageDataUri(customLogoBase64) }}
            style={styles.previewImage}
            resizeMode="contain"
          />
        ) : (
          <View style={styles.emptyPreview}>
            <Text style={styles.emptyIcon}>🧾</Text>
            <Text style={styles.emptyTitle}>Default logo</Text>
            <Text style={styles.emptyText}>No custom logo selected yet.</Text>
          </View>
        )}
      </View>

      <View style={styles.actions}>
        <Pressable
          disabled={isProcessing}
          onPress={handlePickLogo}
          style={({ pressed }) => [
            styles.primaryButton,
            pressed && styles.pressed,
            isProcessing && styles.disabled,
          ]}
        >
          {isProcessing ? (
            <ActivityIndicator />
          ) : (
            <Text style={styles.primaryButtonText}>
              {hasCustomLogo ? "Change Logo" : "Select Logo"}
            </Text>
          )}
        </Pressable>

        {hasCustomLogo ? (
          <Pressable
            disabled={isProcessing}
            onPress={handleRemoveLogo}
            style={({ pressed }) => [
              styles.secondaryButton,
              pressed && styles.pressed,
              isProcessing && styles.disabled,
            ]}
          >
            <Text style={styles.secondaryButtonText}>Remove</Text>
          </Pressable>
        ) : null}
      </View>

      <Text style={styles.hint}>
        Recommended: simple black-and-white logo with high contrast. Thermal
        printers do not print detailed colored images well. For best print
        results, crop the image to a 5:3 aspect ratio.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 16,
  },
  header: {
    gap: 12,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111827",
  },
  description: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 18,
    color: "#6B7280",
  },
  customBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: "#DCFCE7",
  },
  customBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#166534",
  },
  defaultBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: "#F3F4F6",
  },
  defaultBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#4B5563",
  },
  previewBox: {
    height: 150,
    borderRadius: 4,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#D1D5DB",
    backgroundColor: "#F9FAFB",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  previewImage: {
    width: "100%",
    height: "100%",
  },
  emptyPreview: {
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 20,
  },
  emptyIcon: {
    fontSize: 28,
  },
  emptyTitle: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
  },
  emptyText: {
    fontSize: 12,
    textAlign: "center",
    color: "#6B7280",
  },
  actions: {
    flexDirection: "row",
    gap: 10,
  },
  primaryButton: {
    flex: 1,
    minHeight: 46,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#111827",
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  secondaryButton: {
    minHeight: 46,
    paddingHorizontal: 18,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F3F4F6",
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#374151",
  },
  hint: {
    fontSize: 12,
    lineHeight: 17,
    color: "#9CA3AF",
  },
  pressed: {
    opacity: 0.75,
  },
  disabled: {
    opacity: 0.6,
  },
});
