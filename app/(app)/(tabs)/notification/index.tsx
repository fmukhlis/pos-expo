import React from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import { skipToken } from "@reduxjs/toolkit/query";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, FlatList, RefreshControl } from "react-native";

import {
  useAcceptInvitationMutation,
  useDeclineInvitationMutation,
  useGetIncomingInvitationsQuery,
} from "@/components/services/employee";
import { Icon } from "@/components/Icon";
import { useSession } from "@/contexts/SessionContext";
import { PrimaryButtonSM } from "@/components/PrimaryButton";
import { SecondaryButtonSM } from "@/components/SecondaryButton";

const Notification = () => {
  const { user } = useSession();

  const [acceptInvitation, acceptInvitationResult] =
    useAcceptInvitationMutation();
  const [declineInvitation, declineInvitationResult] =
    useDeclineInvitationMutation();

  const {
    data: invitations,
    isFetching,
    refetch,
  } = useGetIncomingInvitationsQuery(user ? { userId: user.id } : skipToken);

  const accept = (employeeInvitationId: number) => {
    if (user) {
      acceptInvitation({
        userId: user.id,
        employeeInvitationId,
      });
    }
  };

  const decline = (employeeInvitationId: number) => {
    if (user) {
      declineInvitation({
        userId: user.id,
        employeeInvitationId,
      });
    }
  };

  React.useEffect(() => {
    dayjs.extend(relativeTime);
  }, []);

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 py-1 bg-white">
        <Text className="px-5 text-2xl font-bold mb-3">Notifications</Text>
        <FlatList
          data={invitations}
          renderItem={({ item }) => {
            return (
              <View className="border-t border-gray-200 py-3 px-5">
                <View className="flex-row items-center mb-2">
                  {item.status === "Pending" ? (
                    <>
                      <Icon name="person-add-outline" size={20} />
                      <Text className="text-base ml-1">
                        You're invited to join{" "}
                        <Text className="font-medium">{item.storeName}</Text>.
                      </Text>
                    </>
                  ) : item.status === "Accepted" ? (
                    <Text className="text-base">
                      Great! You are now an employee of{" "}
                      <Text className="font-medium">{item.storeName}</Text>.
                    </Text>
                  ) : (
                    <Text className="text-base">
                      You declined the invitation from{" "}
                      <Text className="font-medium">{item.storeName}</Text>.
                    </Text>
                  )}
                </View>
                {item.status === "Pending" && (
                  <View className="flex-row space-x-2 justify-between mb-2">
                    <SecondaryButtonSM
                      isProcessing={declineInvitationResult.isLoading}
                      onPress={() => {
                        decline(item.id);
                      }}
                      className="px-7 py-1"
                    >
                      Decline
                    </SecondaryButtonSM>
                    <PrimaryButtonSM
                      isProcessing={acceptInvitationResult.isLoading}
                      onPress={() => {
                        accept(item.id);
                      }}
                      className="flex-1 py-1"
                    >
                      Accept
                    </PrimaryButtonSM>
                  </View>
                )}
                <View className="flex-row justify-end items-center space-x-1">
                  <Icon
                    name="time-outline"
                    size={15}
                    className="text-gray-500"
                  />
                  <Text className="text-xs text-gray-500">
                    {dayjs().to(dayjs(item.invitedAt))}
                  </Text>
                </View>
              </View>
            );
          }}
          refreshControl={
            <RefreshControl refreshing={isFetching} onRefresh={refetch} />
          }
          ListEmptyComponent={
            <View className="px-4">
              <View className="p-4 border border-gray-400 rounded items-center">
                <Text className="text-lg text-gray-500 font-medium mb-2">
                  You're all caught up
                </Text>
                <Text className="text-sm text-center text-gray-500">
                  Check back soon for alerts on invitations and more.
                </Text>
              </View>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
};

export default Notification;
