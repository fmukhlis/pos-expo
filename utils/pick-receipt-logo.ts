import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";

export async function pickReceiptLogoBase64() {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    quality: 1,
  });

  if (result.canceled) {
    return null;
  }

  const asset = result.assets[0];

  const manipulated = await ImageManipulator.manipulateAsync(
    asset.uri,
    [
      {
        resize: {
          width: 250,
        },
      },
    ],
    {
      compress: 0.8,
      format: ImageManipulator.SaveFormat.PNG,
      base64: true,
    },
  );

  return manipulated.base64 ?? null;
}

const RECEIPT_LOGO_BASE64_FILE_URI =
  FileSystem.documentDirectory + "receipt-logo-base64.txt";

export function normalizeBase64Image(base64: string) {
  return base64.replace(/^data:image\/\w+;base64,/, "");
}

export function toImageDataUri(base64: string) {
  if (!base64) return "";
  if (base64.startsWith("data:image")) return base64;

  return `data:image/jpeg;base64,${base64}`;
}

export async function saveReceiptLogoBase64(base64: string) {
  const normalizedBase64 = normalizeBase64Image(base64);

  await FileSystem.writeAsStringAsync(
    RECEIPT_LOGO_BASE64_FILE_URI,
    normalizedBase64,
    {
      encoding: FileSystem.EncodingType.UTF8,
    },
  );

  return normalizedBase64;
}

export async function loadReceiptLogoBase64() {
  const fileInfo = await FileSystem.getInfoAsync(RECEIPT_LOGO_BASE64_FILE_URI);

  if (!fileInfo.exists) {
    return "";
  }

  const base64 = await FileSystem.readAsStringAsync(
    RECEIPT_LOGO_BASE64_FILE_URI,
    {
      encoding: FileSystem.EncodingType.UTF8,
    },
  );

  return normalizeBase64Image(base64);
}

/**
 * Hapus custom logo.
 *
 * Setelah ini Redux dikosongkan, dan print akan fallback ke logoExample.
 */
export async function deleteReceiptLogoBase64() {
  const fileInfo = await FileSystem.getInfoAsync(RECEIPT_LOGO_BASE64_FILE_URI);

  if (!fileInfo.exists) {
    return;
  }

  await FileSystem.deleteAsync(RECEIPT_LOGO_BASE64_FILE_URI, {
    idempotent: true,
  });
}
