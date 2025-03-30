import React from "react";
import Toast from "react-native-toast-message";

import { router } from "expo-router";
import { View, Text, Switch } from "react-native";

import PrimaryInput from "@/components/PrimaryInput";

import { useAppSelector } from "@/components/reduxHooks";
import { PrimaryButton } from "@/components/PrimaryButton";
import { useStorePermissionMutation } from "@/components/services/permission";

const Create = () => {
  const storeId = useAppSelector(({ store }) => store.selectedStoreId)!;

  const [storePermission, storePermissionResult] = useStorePermissionMutation();

  const [data, setData] = React.useState({
    authorizationCode: "",
    refund: true,
    modifyBill: true,
  });

  const changeAuthorizationCode = (authorizationCode: string) => {
    setData((prev) => {
      return {
        ...prev,
        authorizationCode,
      };
    });
  };

  const changeRefund = (refund: boolean) => {
    setData((prev) => {
      return {
        ...prev,
        refund,
      };
    });
  };

  const changeModifyBill = (modifyBill: boolean) => {
    setData((prev) => {
      return {
        ...prev,
        modifyBill,
      };
    });
  };

  const save = () => {
    storePermission({ storeId, ...data })
      .unwrap()
      .then(() => {
        router.back();
      })
      .catch((error) => {
        Toast.show({
          type: "error",
          text1: `Error ${error.status}`,
          text2: error.data.message,
        });
      });
  };

  return (
    <View className="flex-1 px-4 pt-4 bg-white">
      <Text className="text-lg font-bold mb-2">Add New Permission</Text>
      <Text className="my-3 text-base font-medium">Set Authorization Code</Text>
      <PrimaryInput
        keyboardType="number-pad"
        className="h-[40]"
        containerClassName="mb-5"
        type="password"
        placeholder="Enter a 6-digit pin"
        value={data.authorizationCode}
        onChangeText={changeAuthorizationCode}
      />
      <Text className="text-base font-medium mb-3">Permission Abilities</Text>
      <View className="flex-row justify-between items-center border-t border-gray-300 py-3 px-2">
        <View className="w-9/12">
          <Text className="font-medium text-sm mb-0.5">Can Modify Bill</Text>
          <Text className="text-gray-500 text-sm">
            The pin can be used for modifying bills.
          </Text>
        </View>
        <Switch onValueChange={changeModifyBill} value={data.modifyBill} />
      </View>
      <View className="flex-row justify-between items-center border-y border-gray-300 py-3 px-2">
        <View className="w-9/12">
          <Text className="font-medium text-sm mb-0.5">Can Refund Payment</Text>
          <Text className="text-gray-500 text-sm">
            The pin can be used for refunding payments.
          </Text>
        </View>
        <Switch onValueChange={changeRefund} value={data.refund} />
      </View>
      <View className="flex-row py-8">
        {/* <DangerButton
                    className='px-4'
                >
                    Delete
                </DangerButton> */}
        <PrimaryButton
          isProcessing={storePermissionResult.isLoading}
          onPress={save}
          className="flex-1 h-[40]"
        >
          Save
        </PrimaryButton>
      </View>
    </View>
  );
};

export default Create;
