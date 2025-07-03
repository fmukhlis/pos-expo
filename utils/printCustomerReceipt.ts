import dayjs from "dayjs";

import {
  BLEPrinter,
  ColumnAlignment,
  COMMANDS,
  IBLEPrinter,
} from "react-native-thermal-receipt-printer-image-qr";

import { DetailedOrder } from "@/types/order";
import { DetailedStore } from "@/types/store";
import { currencyFormat } from "./defaultFormat";
import { logoExample } from "@/assets/images/base64images/logo-example";

const printCustomerReceipt = async ({
  store,
  order,
  printer,
  base64Logo,
}: {
  store: DetailedStore;
  order: DetailedOrder;
  printer: IBLEPrinter;
  base64Logo: string;
}) => {
  if (!printer) {
    return;
  }

  const createdAt = dayjs(order.createdAt);

  let subtotal = 0;
  let totalDiscount = 0;

  if (base64Logo) {
    BLEPrinter.printImageBase64(base64Logo, {
      imageWidth: 250,
      imageHeight: 150,
    });
    await sleep(100);
  } else {
    BLEPrinter.printImageBase64(logoExample, {
      imageWidth: 250,
      imageHeight: 150,
    });
    await sleep(100);
  }

  BLEPrinter.printText(
    `<C>${store.name}</C>\n<C>${store.address}</C>\n<C>${store.phone}</C>\n\n--------------------------------`
  );
  await sleep(100);

  BLEPrinter.printColumnsText(
    [`${createdAt.format("DD MMM YYYY")}`, "", `${createdAt.format("HH:mm")}`],
    [15, 1, 14],
    [ColumnAlignment.LEFT, ColumnAlignment.CENTER, ColumnAlignment.RIGHT],
    ["", "", ""]
  );
  await sleep(100);

  BLEPrinter.printColumnsText(
    ["ORDER ID", "", `${order.id}`],
    [15, 1, 14],
    [ColumnAlignment.LEFT, ColumnAlignment.CENTER, ColumnAlignment.RIGHT],
    ["", "", ""]
  );
  await sleep(100);

  BLEPrinter.printColumnsText(
    ["Processed By", "", `${order.processedBy.name.slice(0, 10)}`],
    [15, 1, 14],
    [ColumnAlignment.LEFT, ColumnAlignment.CENTER, ColumnAlignment.RIGHT],
    ["", "", ""]
  );
  await sleep(100);

  BLEPrinter.printText("--------------------------------");
  await sleep(100);

  for (const item of order.orderedProducts) {
    const itemTotal = Number(item.quantity) * Number(item.price);
    const itemDiscount = (Number(item.discount) * itemTotal) / 100;

    subtotal += itemTotal;
    totalDiscount += itemDiscount;

    BLEPrinter.printText(`${COMMANDS.TEXT_FORMAT.TXT_BOLD_ON}${item.name}`);
    await sleep(100);

    BLEPrinter.printColumnsText(
      [
        `${item.quantity}x   @${currencyFormat
          .format(Number(item.price))
          .replace(/[^\d.]/g, "")}`,
        "",
        `${currencyFormat.format(itemTotal).replace(/[^\d.]/g, "")}`,
      ],
      [17, 1, 12],
      [ColumnAlignment.LEFT, ColumnAlignment.CENTER, ColumnAlignment.RIGHT],
      ["", "", ""]
    );
    await sleep(100);

    if (Number(item.discount)) {
      BLEPrinter.printColumnsText(
        [
          `Disc. (${item.discount}%)`,
          "",
          `-${currencyFormat.format(itemDiscount).replace(/[^\d.]/g, "")}`,
        ],
        [17, 1, 12],
        [ColumnAlignment.LEFT, ColumnAlignment.CENTER, ColumnAlignment.RIGHT],
        ["", "", ""]
      );
      await sleep(100);
    }
  }

  BLEPrinter.printText("--------------------------------");
  await sleep(100);

  BLEPrinter.printColumnsText(
    [
      `Subtotal`,
      "",
      `${currencyFormat.format(subtotal).replace(/\u00A0/g, "")}`,
    ],
    [17, 1, 12],
    [ColumnAlignment.LEFT, ColumnAlignment.CENTER, ColumnAlignment.RIGHT],
    ["", "", ""]
  );
  await sleep(100);

  BLEPrinter.printColumnsText(
    [
      `Total Discount`,
      "",
      `-${currencyFormat.format(totalDiscount).replace(/\u00A0/g, "")}`,
    ],
    [17, 1, 12],
    [ColumnAlignment.LEFT, ColumnAlignment.CENTER, ColumnAlignment.RIGHT],
    ["", "", ""]
  );
  await sleep(100);

  BLEPrinter.printColumnsText(
    [`Tax`, "", ``],
    [17, 1, 12],
    [ColumnAlignment.LEFT, ColumnAlignment.CENTER, ColumnAlignment.RIGHT],
    ["", "", ""]
  );
  await sleep(100);

  BLEPrinter.printText("--------------------------------");
  await sleep(100);

  BLEPrinter.printColumnsText(
    [
      `Total`,
      "",
      `${currencyFormat
        .format(Number(order.totalAmount))
        .replace(/\u00A0/g, "")}`,
    ],
    [17, 1, 12],
    [ColumnAlignment.LEFT, ColumnAlignment.CENTER, ColumnAlignment.RIGHT],
    [`${COMMANDS.TEXT_FORMAT.TXT_BOLD_ON}`, "", ""]
  );
  await sleep(100);

  BLEPrinter.printText("--------------------------------");
  await sleep(100);

  BLEPrinter.printColumnsText(
    [
      `Payment (${order.paymentMethod.name})`,
      "",
      `${currencyFormat
        .format(Number(order.cashAmount))
        .replace(/\u00A0/g, "")}`,
    ],
    [17, 1, 12],
    [ColumnAlignment.LEFT, ColumnAlignment.CENTER, ColumnAlignment.RIGHT],
    ["", "", ""]
  );
  await sleep(100);

  BLEPrinter.printColumnsText(
    [
      `Change`,
      "",
      `${currencyFormat
        .format(Number(order.cashAmount) - Number(order.totalAmount))
        .replace(/\u00A0/g, "")}`,
    ],
    [17, 1, 12],
    [ColumnAlignment.LEFT, ColumnAlignment.CENTER, ColumnAlignment.RIGHT],
    ["", "", ""]
  );
  await sleep(100);

  BLEPrinter.printText("--------------------------------");
  await sleep(100);

  BLEPrinter.printBill(
    `\n${
      COMMANDS.TEXT_FORMAT.TXT_ALIGN_CT
    }Thank you for your purchase!\n\n\n\n${
      COMMANDS.TEXT_FORMAT.TXT_ALIGN_CT
    }Printed on: ${createdAt.format("DD MMM YYYY - hh:mm")}`,
    {
      beep: false,
    }
  );
  await sleep(100);

  return true;
};

export default printCustomerReceipt;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
