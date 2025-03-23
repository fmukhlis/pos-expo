import { View, Text, TextInput, KeyboardAvoidingView } from "react-native";
import React from "react";
import BasicModal from "@/components/BasicModal";
import { SecondaryTouchable } from "@/components/SecondaryTouchable";
import { Icon } from "@/components/Icon";
import { PrimaryTouchable } from "@/components/PrimaryTouchable";
import PrimaryInput from "@/components/PrimaryInput";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const Schema = z
  .object({
    note: z
      .string({ required_error: "Note should not be null" })
      .min(1, { message: "Must contain at least 1 character" })
      .max(200, { message: "Must contain at most 200 characters" }),
  })
  .required();

const ManageNoteModal = ({
  onClose = () => {},
  visible,
  ...props
}: ManageNoteModalProps) => {
  const {
    control,
    formState: { errors, isValid },
    handleSubmit,
    reset,
    watch,
  } = useForm({
    resolver: zodResolver(Schema),
    defaultValues: { note: "" },
  });

  const onSubmit: SubmitHandler<SchemaProps> = (data) => {
    if (isValid) {
      onClose();
    }
  };

  const note = watch("note", "");

  return (
    <BasicModal
      {...props}
      animationType="slide"
      visible={visible}
      containerClassName="flex-1 bg-white p-5"
    >
      <View className="flex-row justify-between mb-5">
        <SecondaryTouchable
          className="w-[45] h-[45]"
          onPress={() => {
            onClose();
          }}
        >
          <Icon name="close" className="text-gray-600 m-auto" />
        </SecondaryTouchable>
        <PrimaryTouchable
          className="w-[45] h-[45]"
          onPress={handleSubmit(onSubmit)}
        >
          <Icon name="save-outline" className="text-gray-100" />
        </PrimaryTouchable>
      </View>
      <Text className="text-2xl font-bold mb-3">Item note</Text>
      <Text className="font-semibold text-lg mb-3">Note</Text>
      <Controller
        name="note"
        control={control}
        render={({ field: { value, onChange, onBlur } }) => {
          return (
            <PrimaryInput
              multiline
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              textAlignVertical="top"
              className="min-h-[100] my-3"
            />
          );
        }}
      />
      <View className="mt-2 px-0.5 space-y-1">
        <View className="flex-row flex-wrap items-center">
          <Text className={`text-xs font-semibold ${"text-gray-500"}`}>
            {note.length} / 200
          </Text>
          {errors.note && (
            <>
              <Icon name="close" size={15} className="mx-1 text-red-500" />
              <Text className="text-red-500 text-xs">
                {errors.note.message}
              </Text>
            </>
          )}
        </View>
      </View>
      <Text className="mt-3 text-gray-400">
        This note will be applied to your RpXXX item
      </Text>
    </BasicModal>
  );
};

export default ManageNoteModal;

interface ManageNoteModalProps
  extends React.ComponentPropsWithoutRef<typeof BasicModal> {
  onClose?: () => void;
}

type SchemaProps = z.infer<typeof Schema>;
