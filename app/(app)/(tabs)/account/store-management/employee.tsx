import React from "react";
import { TouchableHighlight } from "react-native";
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from "react-native";

import PrimaryInput from "@/components/PrimaryInput";
import InviteEmployeeModal from "@/components/Employee/InviteEmployeeModal";
import { Icon } from "@/components/Icon";
import { useAppSelector } from "@/components/reduxHooks";
import {
  useDisinviteEmployeeMutation,
  useGetEmployeesQuery,
  useGetOutgoingInvitationsQuery,
  useTerminateEmployeeMutation,
} from "@/components/services/employee";

const Employee = () => {
  const storeId = useAppSelector(({ store }) => store.selectedStoreId)!;

  const {
    data: employees,
    isFetching: employeesFetching,
    refetch: refetchEmployee,
  } = useGetEmployeesQuery({ storeId });

  const {
    data: employeeInvitations,
    isFetching: employeeInvitationsFetching,
    refetch: refetchEmployeeInviations,
  } = useGetOutgoingInvitationsQuery({ storeId });

  const [terminateEmployee, terminateEmployeeResult] =
    useTerminateEmployeeMutation();
  const [disinviteEmployee, disinviteEmployeeResult] =
    useDisinviteEmployeeMutation();

  const [filter, setFilter] = React.useState("");

  const filteredEmployees = React.useMemo(() => {
    if (employees) {
      return employees.filter((value) =>
        value.userName.toLowerCase().includes(filter.toLowerCase())
      );
    }
    return [];
  }, [employees, filter]);

  const pendingInvitations = React.useMemo(() => {
    if (employeeInvitations) {
      return employeeInvitations.filter((value) => value.status !== "Accepted");
    }
    return [];
  }, [employeeInvitations]);

  const [inviteEmployeeModalVisible, setInviteEmployeeModalVisible] =
    React.useState(false);

  const reloadScreensData = () => {
    refetchEmployee();
    refetchEmployeeInviations();
  };

  const terminate = (employeeId: number) => {
    terminateEmployee({ employeeId, storeId });
  };

  const disinvite = (invitationId: number) => {
    disinviteEmployee({ invitationId, storeId });
  };

  return (
    <View className="flex-1 bg-white p-4 relative">
      <InviteEmployeeModal
        visible={inviteEmployeeModalVisible}
        onClose={() => {
          setInviteEmployeeModalVisible(false);
        }}
        onRequestClose={() => {
          setInviteEmployeeModalVisible(false);
        }}
      />
      <View className="flex-1 mb-5">
        <FlatList
          renderItem={({ item }) => {
            return (
              <View className="border-t border-gray-300">
                <TouchableOpacity
                  onPress={() => {
                    Alert.alert(
                      "Terminate Employee",
                      "This will terminate the employee from the store. Continue?",
                      [
                        { text: "Cancel", style: "cancel" },
                        {
                          text: "OK",
                          onPress: () => {
                            terminate(item.id);
                          },
                        },
                      ]
                    );
                  }}
                >
                  <View className="p-3 flex-row justify-between">
                    <Text>{item.userName}</Text>
                    <Icon
                      name="radio-button-on"
                      className={`${
                        item.status === "Active"
                          ? "text-green-500"
                          : "text-gray-400"
                      }`}
                      size={20}
                    />
                  </View>
                </TouchableOpacity>
              </View>
            );
          }}
          data={filteredEmployees}
          ListHeaderComponent={
            <View className="">
              <View className="flex-row justify-between items-center mb-3">
                <Text className="text-lg font-bold">Employees</Text>
                <View className="w-[25] h-[25] rounded-full bg-rose-600">
                  <Text className="m-auto text-[11px] font-bold text-white">
                    {employees && employees.length < 100
                      ? employees.length
                      : "99+"}
                  </Text>
                </View>
              </View>
              <PrimaryInput
                containerClassName="mt-1 mb-3"
                className="text-sm h-[40]"
                placeholder="Search..."
                value={filter}
                onChangeText={(text) => {
                  setFilter(text);
                }}
              />
            </View>
          }
          ListEmptyComponent={
            <View className="border-t py-3 border-gray-300">
              <Text className="text-gray-500 text-center">
                You don't have any employee.
              </Text>
            </View>
          }
          refreshControl={
            <RefreshControl
              refreshing={employeesFetching}
              onRefresh={reloadScreensData}
            />
          }
        />
      </View>
      <View className="absolute h-[200] bottom-0 left-0 right-0 m-4">
        <FlatList
          renderItem={({ item }) => {
            return (
              <View className="border-t border-gray-300">
                <TouchableOpacity
                  onPress={() => {
                    Alert.alert(
                      "Disinvite Employee",
                      "This will disinvite the employee. Continue?",
                      [
                        { text: "Cancel", style: "cancel" },
                        {
                          text: "OK",
                          onPress: () => {
                            disinvite(item.id);
                          },
                        },
                      ]
                    );
                  }}
                >
                  <View className="p-3 flex-row justify-between items-center">
                    <Text>{item.userName}</Text>
                    <Icon
                      name="close-circle"
                      size={20}
                      className="text-gray-500"
                    />
                  </View>
                </TouchableOpacity>
              </View>
            );
          }}
          data={pendingInvitations}
          ListHeaderComponent={
            <View className="">
              <View className="flex-row justify-between items-center mb-3">
                <Text className="text-lg font-bold">Pending Invitations</Text>
                <TouchableHighlight
                  underlayColor={"#e5e7eb"}
                  onPress={() => {
                    setInviteEmployeeModalVisible(true);
                  }}
                  className="mt-1 ml-3 w-[25] h-[25] rounded-full border-2 border-gray-400"
                >
                  <Icon name="add" className="text-gray-500 m-auto" size={20} />
                </TouchableHighlight>
              </View>
            </View>
          }
          ListEmptyComponent={
            <View className="border-t py-3 border-gray-300">
              <Text className="text-gray-500 text-center">
                You haven't invited anyone yet.
              </Text>
            </View>
          }
        />
      </View>
      <View className="h-[200]"></View>
    </View>
  );
};

export default Employee;
