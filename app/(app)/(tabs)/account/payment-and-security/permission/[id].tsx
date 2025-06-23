import React from "react";
import Toast from "react-native-toast-message";

import { View, Text, Switch } from "react-native";
import { router, useLocalSearchParams } from "expo-router";

import PrimaryInput from "@/components/PrimaryInput";
import LoadingComponent from "@/components/LoadingComponent";

import {
  useDestroyPermissionMutation,
  useLazyGetPermissionQuery,
  useUpdatePermissionMutation,
} from "@/components/services/permission";
import { DangerButton } from "@/components/DangerButton";
import { useAppSelector } from "@/components/reduxHooks";
import { PrimaryButton } from "@/components/PrimaryButton";

const Edit = () => {
  const { id }: { id: string } = useLocalSearchParams();

  const storeId = useAppSelector(({ store }) => store.selectedStoreId)!;

  const [getPermission, getPermissionResult] = useLazyGetPermissionQuery();
  const [updatePermission, updatePermissionResult] =
    useUpdatePermissionMutation();
  const [destroyPermission, destroyPermissionResult] =
    useDestroyPermissionMutation();

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
    updatePermission({ permissionId: Number(id), storeId, ...data })
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

  const performDelete = () => {
    destroyPermission({ permissionId: Number(id), storeId })
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

  React.useEffect(() => {
    getPermission({ permissionId: Number(id), storeId })
      .unwrap()
      .then(({ id, ...rest }) => {
        setData(rest);
      })
      .catch((error) => {
        Toast.show({
          type: "error",
          text1: `Error ${error.status}`,
          text2: error.data.message,
        });
      });
  }, []);

  if (getPermissionResult.isFetching) {
    return <LoadingComponent />;
  }

  return (
    <View className="flex-1 px-4 pt-4 bg-white">
      <Text className="text-lg font-bold mb-2">Edit Permission</Text>
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
        <DangerButton
          isProcessing={destroyPermissionResult.isLoading}
          onPress={performDelete}
          className="px-4"
        >
          Delete
        </DangerButton>
        <PrimaryButton
          isProcessing={updatePermissionResult.isLoading}
          onPress={save}
          className="ml-auto px-14 h-[40]"
        >
          Save
        </PrimaryButton>
      </View>
    </View>
  );
};

export default Edit;
