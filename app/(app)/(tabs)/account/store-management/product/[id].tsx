import React from "react";

import { useLocalSearchParams, useNavigation, router } from "expo-router";
import { View, Text, ScrollView, Alert, TouchableOpacity } from "react-native";

import Option from "@/components/Product/Option";
import Variant from "@/components/Product/Variant";
import PrimaryInput from "@/components/PrimaryInput";
import Modifier from "@/components/Product/Modifier";
import LoadingComponent from "@/components/LoadingComponent";
import CurrencyTextInput from "@/components/CurrencyTextInput";
import ManageOptionModal from "@/components/Product/ManageOptionModal";
import ManageModifierModal from "@/components/Product/ManageModifierModal";
import ManageVariantModal from "@/components/Product/ManageVariantModal";

import { Icon } from "@/components/Icon";
import { ProductPayload } from "@/types/product";
import { useAppSelector } from "@/components/reduxHooks";
import { PrimaryButton } from "@/components/PrimaryButton";
import { SecondaryButton } from "@/components/SecondaryButton";
import { DangerTouchable } from "@/components/DangerTouchable";
import {
  useDestroyProductMutation,
  useLazyGetProductQuery,
  useStoreProductMutation,
  useUpdateProductMutation,
} from "@/components/services/product";

const ManageProduct = () => {
  const { id } = useLocalSearchParams<{ id: string }>();

  const shouldGoBackRef = React.useRef(false);

  const navigation = useNavigation();

  const storeId = useAppSelector(({ store }) => store.selectedStoreId)!;

  const productId = parseInt(id, 10);

  const [triggerGetProduct, { data: product }] = useLazyGetProductQuery();
  const [createProduct, createResult] = useStoreProductMutation();
  const [updateProduct, updateResult] = useUpdateProductMutation();
  const [deleteProduct, deleteResult] = useDestroyProductMutation();

  const [initialLoading, setInitialLoading] = React.useState(true);

  const [data, dispatchData] = React.useReducer(dataReducer, initialData);

  const changeName = (newName: string) => {
    dispatchData({ type: "SET_NAME", value: newName });
  };
  const changeSku = (newSku: string) => {
    dispatchData({
      type: "UPDATE_VARIANT",
      index: 0,
      value: { sku: newSku.toUpperCase() },
    });
  };
  const changePrice = (value: { raw: string; formatted: string }) => {
    dispatchData({
      type: "UPDATE_VARIANT",
      index: 0,
      value: { price: value.raw },
    });
  };
  const changeStock = (newStock: string) => {
    dispatchData({
      type: "UPDATE_VARIANT",
      index: 0,
      value: {
        stock: `${isNaN(parseInt(newStock, 10)) ? "" : parseInt(newStock, 10)}`,
      },
    });
  };

  const submit = () => {
    if (validateData(data)) {
      if (productId) {
        updateProduct({ storeId, productId, ...data })
          .unwrap()
          .then(() => {
            if (!updateResult.isError) {
              shouldGoBackRef.current = true;
            }
          })
          .catch((error) => {
            Alert.alert(
              "Error " + error.status,
              "Oops... Something went wrong, please try again later.",
              [{ text: "Ok" }]
            );
          });
      } else {
        createProduct({ storeId, ...data })
          .unwrap()
          .then(() => {
            if (!createResult.isError) {
              shouldGoBackRef.current = true;
            }
          })
          .catch((error) => {
            Alert.alert(
              "Error " + error.status,
              "Oops... Something went wrong, please try again later.",
              [{ text: "Ok" }]
            );
          });
      }
    }
  };

  const destroy = () => {
    Alert.alert(
      "Delete Product",
      "This will delete product permanently. Are you sure?",
      [
        { text: "Cancel" },
        {
          text: "Confirm",
          onPress: () => {
            if (productId) {
              deleteProduct({ productId, storeId })
                .unwrap()
                .then(() => {
                  if (!deleteResult.isError) {
                    shouldGoBackRef.current = true;
                  }
                });
            }
          },
        },
      ]
    );
  };

  const [modalVisibility, setModalVisibility] = React.useState({
    manageModifier: false,
    manageOption: false,
    manageVariant: false,
  });

  const [selectedModifierIndex, setSelectedModifierIndex] = React.useState<
    null | number
  >(null);
  const hideManageModifierModal = () => {
    setModalVisibility((prev) => ({ ...prev, manageModifier: false }));
  };
  const showManageModifierModal = () => {
    setModalVisibility((prev) => ({ ...prev, manageModifier: true }));
  };
  const handleManageModifierModalSave = (
    value: Exclude<ProductPayload["availableModifiers"], null>[number]
  ) => {
    if (typeof selectedModifierIndex === "number") {
      dispatchData({
        type: "UPDATE_MODIFIER",
        index: selectedModifierIndex,
        value,
      });
    } else {
      dispatchData({ type: "ADD_MODIFIER", value });
    }
    hideManageModifierModal();
  };

  const [selectedOptionIndex, setSelectedOptionIndex] = React.useState<
    null | number
  >(null);
  const hideManageOptionModal = () => {
    setModalVisibility((prev) => ({ ...prev, manageOption: false }));
  };
  const showManageOptionModal = () => {
    setModalVisibility((prev) => ({ ...prev, manageOption: true }));
  };
  const handleManageOptionModalSave = (
    value: Exclude<ProductPayload["availableOptions"], null>[number]
  ) => {
    if (typeof selectedOptionIndex === "number") {
      dispatchData({
        type: "UPDATE_OPTION",
        index: selectedOptionIndex,
        value,
      });
    } else {
      dispatchData({ type: "ADD_OPTION", value });
    }
    hideManageOptionModal();
  };

  const [selectedVariantIndex, setSelectedVariantIndex] =
    React.useState<number>(0);
  const hideManageVariantModal = () => {
    setModalVisibility((prev) => ({ ...prev, manageVariant: false }));
  };
  const showManageVariantModal = () => {
    setModalVisibility((prev) => ({ ...prev, manageVariant: true }));
  };
  const handleManageVariantModalSave = (
    value: ProductPayload["availableVariants"][number]
  ) => {
    dispatchData({
      type: "UPDATE_VARIANT",
      index: selectedVariantIndex,
      value,
    });
    hideManageVariantModal();
  };

  React.useEffect(() => {
    if (shouldGoBackRef.current) {
      router.back();
    }
  }, [shouldGoBackRef.current]);

  React.useEffect(() => {
    if (productId) {
      triggerGetProduct({ storeId, productId })
        .unwrap()
        .then((product) => {
          if (product) {
            const {
              name,
              availableModifiers,
              availableOptions,
              availableVariants,
            } = product;
            dispatchData({
              type: "SET",
              value: {
                name,
                availableModifiers: availableModifiers.length
                  ? availableModifiers
                      .filter(({ status }) => status === "Active")
                      .map(({ name, values }) => ({
                        categoryName: name,
                        values: values
                          .filter(({ status }) => status === "Active")
                          .map(({ name }) => ({ name })),
                      }))
                  : null,
                availableOptions: availableOptions.length
                  ? availableOptions
                      .filter(({ status }) => status === "Active")
                      .map(({ name, values }) => ({
                        categoryName: name,
                        values: values
                          .filter(({ status }) => status === "Active")
                          .map(({ name }) => ({ name })),
                      }))
                  : null,
                availableVariants: availableVariants
                  .filter(({ status }) => status === "Active")
                  .map(({ price, productOptions, sku, stock }) => ({
                    options: productOptions.length
                      ? productOptions.map(({ name }) => name)
                      : null,
                    price: `${price}`,
                    sku,
                    stock: `${stock}`,
                  })),
              },
            });
          }
        })
        .finally(() => {
          setInitialLoading(false);
        });
    } else {
      setInitialLoading(false);
    }

    const unsubscribe = navigation.addListener("beforeRemove", (e) => {
      if (shouldGoBackRef.current) {
        return;
      }
      e.preventDefault();
      Alert.alert(
        "Unsaved changes",
        "You have unsaved changes. Leaving now may result in losing your progress",
        [
          { text: "RESUME", style: "cancel" },
          {
            text: "DISCARD",
            onPress: () => {
              navigation.dispatch(e.data.action);
            },
          },
        ]
      );
    });

    return unsubscribe;
  }, []);

  if (initialLoading) {
    return <LoadingComponent />;
  }

  return (
    <View className="flex-1">
      <ScrollView className="flex-1 bg-white px-4">
        <ManageModifierModal
          visible={modalVisibility.manageModifier}
          initialData={
            typeof selectedModifierIndex === "number"
              ? data.availableModifiers?.[selectedModifierIndex]
              : null
          }
          onSave={handleManageModifierModalSave}
          onClose={hideManageModifierModal}
        />
        <ManageOptionModal
          visible={modalVisibility.manageOption}
          initialData={
            typeof selectedOptionIndex === "number"
              ? data.availableOptions?.[selectedOptionIndex]
              : null
          }
          onSave={handleManageOptionModalSave}
          onClose={hideManageOptionModal}
        />
        <ManageVariantModal
          productName={data.name}
          initialData={data.availableVariants[selectedVariantIndex]}
          visible={modalVisibility.manageVariant}
          onSave={handleManageVariantModalSave}
          onClose={hideManageVariantModal}
        />
        <View className="flex-row items-center mt-4">
          <TouchableOpacity
            onPress={() => {
              router.back();
            }}
            className="w-[40] h-[40] rounded bg-gray-200"
          >
            <Icon name="arrow-back" size={25} className="m-auto" />
          </TouchableOpacity>
          <Text className="mx-auto text-lg font-semibold">
            {product ? "Edit Product" : "Create Product"}
          </Text>
          <DangerTouchable
            isProcessing={deleteResult.isLoading}
            onPress={destroy}
            disabled={!productId}
            className="w-[40] h-[40] rounded"
          >
            <Icon name="trash" size={25} className="text-rose-50" />
          </DangerTouchable>
        </View>
        <View className="mt-5">
          <Text className="text-base font-medium">Details</Text>
        </View>
        <View className="mt-3">
          <PrimaryInput
            autoCapitalize="words"
            placeholder="Product name..."
            className="h-[40] text-sm"
            value={data.name}
            onChangeText={changeName}
          />
        </View>
        <View className="mt-5">
          <Text className="text-base font-medium mb-2">Modifier sets</Text>
          {data.availableModifiers?.length ? (
            data.availableModifiers.map((availableModifier, index) => (
              <Modifier
                key={`${index}`}
                modifier={availableModifier}
                onPressEdit={() => {
                  setSelectedModifierIndex(index);
                  showManageModifierModal();
                }}
                onPressRemove={() => {
                  Alert.alert(
                    "Remove modifier set",
                    "Are you sure want to remove this modifier set?",
                    [
                      { text: "CANCEL" },
                      {
                        text: "REMOVE",
                        onPress: () => {
                          dispatchData({ type: "REMOVE_MODIFIER", index });
                        },
                      },
                    ]
                  );
                }}
              />
            ))
          ) : (
            <Text className="mt-1 text-gray-400">
              You don't set the modifier sets yet.
            </Text>
          )}
        </View>
        <View className="mt-4">
          <SecondaryButton
            onPress={() => {
              setSelectedModifierIndex(null);
              showManageModifierModal();
            }}
            className="h-[40]"
          >
            Add Modifiers
          </SecondaryButton>
        </View>
        <View className="mt-5">
          <Text className="text-base font-medium">Options</Text>
          <Text className="mt-1 mb-2">
            Add a custom set of options to create variations for an item. For
            example, add a size option to create variations for small, medium
            and large.
          </Text>
          {data.availableOptions?.length ? (
            data.availableOptions.map((availableOption, index) => (
              <Option
                key={`${index}`}
                option={availableOption}
                onPressEdit={() => {
                  setSelectedOptionIndex(index);
                  showManageOptionModal();
                }}
                onPressRemove={() => {
                  Alert.alert(
                    "Remove option set",
                    "Are you sure want to remove this option set?",
                    [
                      { text: "CANCEL" },
                      {
                        text: "REMOVE",
                        onPress: () => {
                          dispatchData({ type: "REMOVE_OPTION", index });
                        },
                      },
                    ]
                  );
                }}
              />
            ))
          ) : (
            <Text className="mt-1 text-gray-400">
              You don't set the options yet.
            </Text>
          )}
        </View>
        <View className="mt-4">
          <SecondaryButton
            onPress={() => {
              setSelectedOptionIndex(null);
              showManageOptionModal();
            }}
            className="h-[40]"
          >
            Add Options
          </SecondaryButton>
        </View>
        {data.availableOptions?.length ? (
          <View className="mt-5">
            <Text className="text-base font-medium mb-1.5">Variants</Text>
            {data.availableVariants.map((availableVariant, index) => (
              <Variant
                key={`${index}`}
                variant={availableVariant}
                onPress={() => {
                  setSelectedVariantIndex(index);
                  showManageVariantModal();
                }}
              />
            ))}
          </View>
        ) : (
          <View>
            <View className="mt-5">
              <Text className="text-base font-medium">Price and Inventory</Text>
            </View>
            <PrimaryInput
              autoCapitalize="characters"
              containerClassName="mt-3"
              className="h-[40] text-sm"
              placeholder="SKU"
              value={data.availableVariants[0].sku}
              onChangeText={changeSku}
            />
            <CurrencyTextInput
              autoCapitalize="none"
              keyboardType="numeric"
              containerClassName="mt-3"
              className="h-[40] text-sm"
              placeholder="Price"
              value={data.availableVariants[0].price}
              onValueChange={changePrice}
            />
            <PrimaryInput
              autoCapitalize="none"
              keyboardType="numeric"
              containerClassName="mt-3"
              className="h-[40] text-sm"
              placeholder="Stock"
              value={data.availableVariants[0].stock}
              onChangeText={changeStock}
            />
          </View>
        )}
        <View className="mt-7 py-3 border-t border-gray-300">
          <PrimaryButton
            disabled={!validateData(data)}
            isProcessing={createResult.isLoading || updateResult.isLoading}
            onPress={submit}
            className="h-[45]"
          >
            Save
          </PrimaryButton>
        </View>
      </ScrollView>
    </View>
  );
};

export default ManageProduct;

type Action =
  | { type: "SET"; value: ProductPayload }
  | { type: "SET_NAME"; value: ProductPayload["name"] }
  | {
      type: "ADD_MODIFIER";
      value: Exclude<ProductPayload["availableModifiers"], null>[number];
    }
  | {
      type: "UPDATE_MODIFIER";
      index: number;
      value: Partial<
        Exclude<ProductPayload["availableModifiers"], null>[number]
      >;
    }
  | { type: "REMOVE_MODIFIER"; index: number }
  | {
      type: "ADD_OPTION";
      value: Exclude<ProductPayload["availableOptions"], null>[number];
    }
  | {
      type: "UPDATE_OPTION";
      index: number;
      value: Partial<Exclude<ProductPayload["availableOptions"], null>[number]>;
    }
  | { type: "REMOVE_OPTION"; index: number }
  | {
      type: "UPDATE_VARIANT";
      index: number;
      value: Partial<ProductPayload["availableVariants"][number]>;
    }
  | { type: "RESET_VARIANT" };

const initialData: ProductPayload = {
  name: "",
  availableModifiers: null,
  availableOptions: null,
  availableVariants: [
    {
      stock: "",
      price: "",
      sku: "",
      options: null,
    },
  ],
};

const dataReducer = (state: ProductPayload, action: Action): ProductPayload => {
  switch (action.type) {
    case "SET":
      return action.value;
    case "SET_NAME":
      return { ...state, name: action.value };
    case "ADD_MODIFIER": {
      const dirtyModifiers = [
        ...(state.availableModifiers ?? []),
        action.value,
      ];
      // This will ensures that the modifier category is unique.
      // The duplicated one will be overwritten.
      const cleanedModifiers = Array.from(
        new Map(
          dirtyModifiers.map((modifier) => [modifier.categoryName, modifier])
        ).values()
      );
      return { ...state, availableModifiers: cleanedModifiers };
    }
    case "UPDATE_MODIFIER": {
      if (state.availableModifiers?.length) {
        const dirtyModifiers = state.availableModifiers.map(
          (availableModifier, index) =>
            index === action.index
              ? {
                  categoryName:
                    action.value.categoryName ?? availableModifier.categoryName,
                  values: action.value.values ?? availableModifier.values,
                }
              : availableModifier
        );
        // This will ensures that the modifier category is unique.
        // The duplicated one will be overwritten.
        const cleanedModifiers = Array.from(
          new Map(
            dirtyModifiers.map((modifier) => [modifier.categoryName, modifier])
          ).values()
        );
        return { ...state, availableModifiers: cleanedModifiers };
      }
    }
    case "REMOVE_MODIFIER":
      if (state.availableModifiers && state.availableModifiers.length > 1) {
        return {
          ...state,
          availableModifiers: state.availableModifiers.filter(
            (_, index) => index !== action.index
          ),
        };
      }
      return { ...state, availableModifiers: null };
    case "ADD_OPTION": {
      const dirtyOptions = [...(state.availableOptions ?? []), action.value];
      // This will ensures that the option category is unique.
      // The duplicated one will be overwritten.
      const cleanedOptions = Array.from(
        new Map(
          dirtyOptions.map((option) => [option.categoryName, option])
        ).values()
      );
      return {
        ...state,
        availableOptions: cleanedOptions,
        availableVariants: generateVariants(cleanedOptions),
      };
    }
    case "UPDATE_OPTION": {
      if (state.availableOptions?.length) {
        const dirtyOptions = state.availableOptions.map(
          (availableOption, index) =>
            index === action.index
              ? {
                  categoryName:
                    action.value.categoryName ?? availableOption.categoryName,
                  values: action.value.values ?? availableOption.values,
                }
              : availableOption
        );
        // This will ensures that the option category is unique.
        // The duplicated one will be overwritten.
        const cleanedOptions = Array.from(
          new Map(
            dirtyOptions.map((option) => [option.categoryName, option])
          ).values()
        );
        return {
          ...state,
          availableOptions: cleanedOptions,
          availableVariants: generateVariants(cleanedOptions),
        };
      }
    }
    case "REMOVE_OPTION":
      if (state.availableOptions && state.availableOptions.length > 1) {
        const options = state.availableOptions.filter(
          (_, index) => index !== action.index
        );

        return {
          ...state,
          availableOptions: options,
          availableVariants: generateVariants(options),
        };
      }
      return {
        ...state,
        availableOptions: null,
        availableVariants: [{ options: null, price: "", sku: "", stock: "" }],
      };
    case "UPDATE_VARIANT":
      return {
        ...state,
        availableVariants: state.availableVariants.map(
          (availableVariant, index) =>
            index === action.index
              ? {
                  options: action.value.options ?? availableVariant.options,
                  price: action.value.price ?? availableVariant.price,
                  sku: action.value.sku ?? availableVariant.sku,
                  stock: action.value.stock ?? availableVariant.stock,
                }
              : availableVariant
        ),
      };
    default:
      throw Error("Unknown action");
  }
};

const validateData = (value: ProductPayload) => {
  if (!value.name) {
    return false;
  }
  for (const variant of value.availableVariants) {
    const { price, stock } = variant;
    if (!price.length || parseInt(price) <= 0) {
      return false;
    }
    if (!stock.length) {
      return false;
    }
  }
  return true;
};

const generateVariants = (
  options: Exclude<ProductPayload["availableOptions"], null>
) => {
  if (options.length) {
    const optionCombinations = options.reduce<string[][]>(
      (accumulator, current) =>
        accumulator.flatMap((acc) =>
          current.values.map((value) => [...acc, value.name])
        ),
      [[]]
    );

    return optionCombinations.map((combination) => ({
      options: combination,
      price: "",
      sku: "",
      stock: "",
    }));
  } else {
    return [{ options: [], price: "", sku: "", stock: "" }];
  }
};
