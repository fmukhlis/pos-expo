import React from "react";

import {
  View,
  Text,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from "react-native";

import LoadingComponent from "@/components/LoadingComponent";
import PaymentMethodModal from "@/components/PaymentMethod/PaymentMethodModal";
import DeletePaymentMethodButton from "@/components/PaymentMethod/DeletePaymentMethodButton";

import { Icon } from "@/components/Icon";
import { PrimaryButton } from "@/components/PrimaryButton";
import { useLazyGetStoreQuery } from "@/components/services/store";
import { useAppDispatch, useAppSelector } from "@/components/reduxHooks";
import { useGetPaymentMethodsQuery } from "@/components/services/paymentMethod";
import { setSelectedPaymentMethodId } from "@/components/PaymentMethod/paymentMethodSlice";

const PaymentMethod = () => {
  const storeId = useAppSelector(({ store }) => store.selectedStoreId)!;
  const dispatch = useAppDispatch();

  const {
    data: paymentMethods,
    isFetching,
    refetch,
  } = useGetPaymentMethodsQuery({ storeId });

  const [getStore, getStoreResult] = useLazyGetStoreQuery();

  const [modalVisible, setModalVisible] = React.useState(false);

  const showModal = (id: number | null) => {
    dispatch(setSelectedPaymentMethodId(id));
    setModalVisible(true);
  };

  const hideModal = () => {
    setModalVisible(false);
  };

  React.useEffect(() => {
    getStore({ storeId }, true);
  }, []);

  if (getStoreResult.isFetching) {
    return <LoadingComponent />;
  }

  return (
    <View className="flex-1 bg-white">
      <FlatList
        ListHeaderComponent={() => (
          <View className="px-4 pt-4">
            <PaymentMethodModal visible={modalVisible} onClose={hideModal} />
            <Text className="text-lg font-bold mb-2">Payment Methods</Text>
            {paymentMethods && paymentMethods.length > 0 && (
              <Text className="text-base mb-4">
                You have added
                <Text className="font-medium">
                  {` ${paymentMethods.length} `}
                </Text>
                payment methods on
                <Text className="font-medium">
                  {` ${getStoreResult.data?.name}`}
                </Text>
                .
              </Text>
            )}
          </View>
        )}
        data={paymentMethods}
        renderItem={({ item }) => (
          <View className="bg-gray-100 border-t border-gray-300 px-4 pt-2 pb-2.5 flex-row justify-between items-center">
            <View className="flex-1">
              <Text className="font-bold text-base mb-0.5">{item.name}</Text>
              <Text className="text-sm text-gray-500">{item.destination}</Text>
            </View>
            <DeletePaymentMethodButton paymentMethodId={item.id} />
            <TouchableOpacity
              className="rounded h-[40] w-[40] justify-center items-center"
              onPress={() => {
                showModal(item.id);
              }}
            >
              <Icon
                name="create-outline"
                className="text-emerald-500"
                size={23}
              />
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(item) => `${item.id}`}
        ListEmptyComponent={() => (
          <View className="px-4">
            <Text className="text-base">
              You have never added any payment method for
              <Text className="font-medium mx-1">
                {getStoreResult.data?.name}
              </Text>
              .
            </Text>
          </View>
        )}
        refreshControl={
          <RefreshControl onRefresh={refetch} refreshing={isFetching} />
        }
      />
      <View className="border-t border-gray-300 py-4 bg-white">
        <PrimaryButton
          onPress={() => {
            showModal(null);
          }}
          className="h-[40] self-center px-5"
        >
          Add Payment Method
        </PrimaryButton>
      </View>
    </View>
  );
};

export default PaymentMethod;
