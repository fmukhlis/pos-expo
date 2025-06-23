import React from "react";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { View, Text, TextInput } from "react-native";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

import BasicModal from "@/components/BasicModal";
import LoadingComponent from "@/components/LoadingComponent";

import { useRefundItemsMutation } from "@/components/services/order";
import { closeModal, setRefundPayload } from "../orderSlice";
import { useAppDispatch, useAppSelector } from "@/components/reduxHooks";

const PinModal = ({
  onRequestClose,
  visible,
  orderId,
  ...props
}: PinModalProps) => {
  const dispatch = useAppDispatch();

  const storeId = useAppSelector(({ store }) => store.selectedStoreId)!;
  const refundPayload = useAppSelector(({ order }) => order.refundPayload);

  const [refundItem, refundItemResult] = useRefundItemsMutation();

  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "all",
    resolver: zodResolver(Schema),
    defaultValues,
  });

  const onSubmit: SubmitHandler<z.infer<typeof Schema>> = (data, e) => {
    refundItem({ storeId, orderId, ...refundPayload, ...data })
      .unwrap()
      .then(() => {
        dispatch(closeModal("PinModal"));
        dispatch(closeModal("IssueRefundModal"));
        dispatch(
          setRefundPayload({
            authorizationCode: "",
            reason: "",
            orderProductVariantIds: [],
          })
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };

  React.useEffect(() => {
    reset();
    refundItemResult.reset();
  }, [visible]);

  return (
    <BasicModal
      {...props}
      visible={visible}
      animationType="fade"
      onRequestClose={() => {
        dispatch(closeModal("PinModal"));
      }}
      containerClassName="bg-gray-500/70 flex-1"
    >
      <View className="my-auto min-h-[155] py-6 bg-white mx-5 px-7 justify-center rounded-lg items-center">
        {refundItemResult.isLoading ? (
          <LoadingComponent />
        ) : (
          <>
            <Text className="font-bold text-lg mb-3 text-center">
              Enter your pin to proceed
            </Text>
            <Controller
              name="authorizationCode"
              control={control}
              render={({ field: { onChange, value } }) => (
                <>
                  <TextInput
                    value={value}
                    secureTextEntry={true}
                    keyboardType="numeric"
                    maxLength={6}
                    onChangeText={(text) => {
                      onChange(text);
                      if (text.length === 6) {
                        handleSubmit(onSubmit)();
                      }
                    }}
                    onFocus={() => {
                      refundItemResult.reset();
                    }}
                    className="tracking-widest px-2 pb-1 mb-1 text-xl  text-center border-b-2 w-[100]"
                    placeholder="******"
                  />
                  {errors.authorizationCode?.type === "invalid_string" && (
                    <Text className="text-red-500 text-center text-sm">
                      {errors.authorizationCode.message}
                    </Text>
                  )}
                  {refundItemResult.error &&
                    "data" in refundItemResult.error &&
                    typeof refundItemResult.error.data === "object" &&
                    refundItemResult.error.data !== null &&
                    "message" in refundItemResult.error.data &&
                    typeof refundItemResult.error.data.message === "string" && (
                      <Text className="text-red-500 text-center text-sm">
                        {refundItemResult.error.data.message}
                      </Text>
                    )}
                </>
              )}
            />
            <Text className="text-sm text-gray-500 text-center mt-3">
              Press back to [Cancel]
            </Text>
          </>
        )}
      </View>
    </BasicModal>
  );
};

export default PinModal;

interface PinModalProps
  extends React.ComponentPropsWithoutRef<typeof BasicModal> {
  orderId: number;
}

const Schema = z.object({
  authorizationCode: z
    .string()
    .regex(/^\d*$/, { message: "Invalid (only numeric character allowed)" })
    .length(6),
});

const defaultValues: z.infer<typeof Schema> = {
  authorizationCode: "",
};
