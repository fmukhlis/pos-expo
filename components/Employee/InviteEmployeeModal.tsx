import React from "react";
import Toast from "react-native-toast-message";

import { View, Text, Modal, TouchableHighlight } from "react-native";

import PrimaryInput from "../PrimaryInput";

import {
  useInviteEmployeesMutation,
  useLazyGetUserByEmailQuery,
} from "../services/employee";
import { Icon } from "../Icon";
import { PrimaryButton } from "../PrimaryButton";
import { useAppSelector } from "../reduxHooks";
import { SecondaryButtonSM } from "../SecondaryButton";

const InviteEmployeeModal = ({
  visible,
  onClose = () => {},
  ...props
}: InviteEmployeeModalProps) => {
  const storeId = useAppSelector(({ store }) => store.selectedStoreId)!;

  const [inviteEmployees, inviteEmployeesResult] = useInviteEmployeesMutation();
  const [getUserByEmail, getUserByEmailResult] = useLazyGetUserByEmailQuery();

  const [users, setUsers] = React.useState<{ id: number; fullName: string }[]>(
    []
  );

  const [email, setEmail] = React.useState("");

  const invite = () => {
    inviteEmployees({ storeId, userIds: users.map((user) => user.id) })
      .unwrap()
      .then(() => {
        onClose();
      })
      .catch((error) => {
        Toast.show({
          type: "error",
          text1: `Error ${error.status}`,
          text2: error.data.message,
        });
      });
  };

  const addUser = () => {
    getUserByEmail({ email })
      .unwrap()
      .then((result) => {
        setUsers((prev) => [...prev, result]);
        setEmail("");
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
    if (visible) {
      setEmail("");
      setUsers([]);
    }
  }, [visible]);

  return (
    <Modal {...props} transparent animationType="fade" visible={visible}>
      <View className="flex-1 justify-center items-center">
        <View
          style={{
            elevation: 5,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 4,
          }}
          className="bg-white p-5 w-10/12"
        >
          <View className="flex-row mb-3 items-center justify-between">
            <TouchableHighlight
              underlayColor={"#e5e7eb"}
              className="rounded"
              onPress={() => {
                onClose();
              }}
            >
              <Icon name="close" />
            </TouchableHighlight>
            <PrimaryButton
              isProcessing={inviteEmployeesResult.isLoading}
              onPress={invite}
              className="px-5"
            >
              Invite
            </PrimaryButton>
          </View>
          <Text className="text-lg font-bold mb-3">Invite Employees</Text>
          <View className="flex-row mb-1">
            <PrimaryInput
              keyboardType="email-address"
              autoCapitalize="none"
              className="text-sm h-[40]"
              containerClassName="flex-1"
              placeholder="Enter employee's email..."
              value={email}
              onChangeText={(text) => {
                setEmail(text);
              }}
            />
            <SecondaryButtonSM
              isProcessing={getUserByEmailResult.isFetching}
              onPress={addUser}
              className="ml-1"
            >
              Add
            </SecondaryButtonSM>
          </View>
          <Text className="text-[13px] text-gray-400 mb-2 mt-1">
            *You can only invite an employee with their email.
          </Text>
          {users.map((user) => (
            <View
              key={user.id}
              className="flex-row flex-wrap justify-center my-1"
            >
              <View className="rounded-xl border border-gray-300 bg-gray-200 px-3 pb-0.5">
                <Text className="text-gray-500">{user.fullName}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </Modal>
  );
};

export default InviteEmployeeModal;

interface InviteEmployeeModalProps
  extends React.ComponentPropsWithoutRef<typeof Modal> {
  onClose?: () => void;
}
