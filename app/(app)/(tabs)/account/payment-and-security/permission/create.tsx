import { View, Text, Switch } from "react-native";
import React from "react";
import PrimaryInput from "@/components/PrimaryInput";
import { PrimaryButton } from "@/components/PrimaryButton";
import { DangerButton } from "@/components/DangerButton";
import { router } from "expo-router";
import { usePermission } from "@/contexts/PermissionContext";

const Create = () => {
  const { setPermissions } = usePermission();

  const [isLoading, setIsLoading] = React.useState(false);
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
    createPermission({
      data,
      onStart: () => {
        setIsLoading(true);
      },
      onSuccess: () => {
        getPermissions({
          onSuccess: (permissions) => {
            setPermissions(permissions);
          },
          onFinish: () => {
            setIsLoading(false);
            if (router.canGoBack()) {
              router.back();
            }
          },
        });
      },
      onFailed: (errMsg) => {
        setIsLoading(false);
        console.log(errMsg);
      },
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
          isProcessing={isLoading}
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
