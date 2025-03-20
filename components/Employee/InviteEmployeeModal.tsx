import { View, Text, Modal, TouchableHighlight } from "react-native";
import React from "react";
import useEmployeeAPI from "./useEmployeeAPI";
import { Icon } from "../Icon";
import { PrimaryButton } from "../PrimaryButton";
import PrimaryInput from "../PrimaryInput";
import { SecondaryButtonSM } from "../SecondaryButton";
import { useEmployee } from "@/contexts/EmployeeContext";
import { useAppSelector } from "../reduxHooks";

const InviteEmployeeModal = ({
  visible = false,
  onVisibleChange = () => {},
  ...props
}: InviteEmployeeModalProps) => {
  const { setEmployeeInvitations } = useEmployee();

  const storeId = useAppSelector(({ store }) => store.selectedStoreId)!;

  const { getOutgoingEmployeeInvitations, getUserByEmail, inviteEmployees } =
    useEmployeeAPI();

  const [users, setUsers] = React.useState<{ id: number; fullName: string }[]>(
    []
  );

  const [modalVisible, setModalVisible] = React.useState(visible);

  const [email, setEmail] = React.useState("");

  const [getUserByEmailLoading, setGetUserByEmailLoading] =
    React.useState(false);
  const [inviteEmployeesLoading, setInviteEmployeesLoading] =
    React.useState(false);

  const invite = () => {
    inviteEmployees({
      data: {
        userIds: users.map((user) => user.id),
      },
      onStart: () => {
        setInviteEmployeesLoading(true);
      },
      onSuccess: () => {
        getOutgoingEmployeeInvitations({
          storeId,
          onSuccess: (invitations) => {
            setEmployeeInvitations(
              invitations.filter(
                (invitation) => invitation.status != "Accepted"
              )
            );
            setInviteEmployeesLoading(false);
            onVisibleChange(false);
          },
        });
      },
      onFailed: (error) => {
        console.log(error);
        setInviteEmployeesLoading(false);
      },
    });
  };

  const addUser = () => {
    getUserByEmail({
      data: { email },
      onStart: () => {
        setGetUserByEmailLoading(true);
      },
      onSuccess: (user) => {
        setEmail("");
        setUsers((prev) => [...prev, user]);
      },
      onFinish: () => {
        setGetUserByEmailLoading(false);
      },
    });
  };

  React.useEffect(() => {
    setModalVisible(visible);
    if (visible) {
      setEmail("");
      setUsers([]);
    }
  }, [visible]);

  return (
    <Modal {...props} transparent animationType="fade" visible={modalVisible}>
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
                onVisibleChange(false);
              }}
            >
              <Icon name="close" />
            </TouchableHighlight>
            <PrimaryButton
              disabled={getUserByEmailLoading}
              isProcessing={inviteEmployeesLoading}
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
              disabled={inviteEmployeesLoading}
              isProcessing={getUserByEmailLoading}
              onPress={addUser}
              className="ml-1"
            >
              Add
            </SecondaryButtonSM>
          </View>
          <Text className="text-[13px] text-gray-400 mb-2">
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
  onVisibleChange?: (visible: boolean) => void;
}
