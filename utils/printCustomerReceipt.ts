import dayjs from "dayjs";

import {
  BLEPrinter,
  ColumnAlignment,
  COMMANDS,
  IBLEPrinter,
  INetPrinter,
  NetPrinter,
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
  paperWidth,
}: {
  store: DetailedStore;
  order: DetailedOrder;
  printer: IBLEPrinter | INetPrinter;
  base64Logo: string;
  paperWidth: "58mm" | "80mm";
}) => {
  // 58mm = 36 chars
  // 80mm = 46 chars
  // To ensure consistent layout, limit column length to 35 or 45 characters (e.g., by using slice() method).
  const width = paperWidth === "58mm" ? 32 : 48;
  const col1 = width / 2;
  const col2 = 1;
  const col3 = (width - 6) / 2;

  if (!printer) {
    return;
  }

  const createdAt = dayjs(order.createdAt);

  let subtotal = 0;
  let totalDiscount = 0;

  if ("port" in printer) {
    if (base64Logo) {
      NetPrinter.printImageBase64(base64Logo, {
        imageWidth: 250,
        imageHeight: 150,
      });
      await sleep(100);
    } else {
      NetPrinter.printImageBase64(logoExample, {
        imageWidth: 250,
        imageHeight: 150,
      });
      await sleep(100);
    }

    NetPrinter.printText(
      `<C>${COMMANDS.TEXT_FORMAT.TXT_BOLD_ON}${store.name}${
        COMMANDS.TEXT_FORMAT.TXT_BOLD_OFF
      }</C>${COMMANDS.LINE_SPACING.LS_SET}\x30\n<C>${store.address}</C>${
        COMMANDS.LINE_SPACING.LS_SET
      }\x30\n<C>${store.phone}</C>${COMMANDS.LINE_SPACING.LS_SET}\x35\n${
        paperWidth === "58mm"
          ? "--------------------------------"
          : COMMANDS.HORIZONTAL_LINE.HR3_80MM
      }${COMMANDS.LINE_SPACING.LS_DEFAULT}`
    );
    await sleep(100);

    NetPrinter.printColumnsText(
      [
        `${createdAt.format("DD MMM YYYY")}`,
        "",
        `${createdAt.format("HH:mm")}`,
      ],
      [col1, col2, col3],
      [ColumnAlignment.LEFT, ColumnAlignment.CENTER, ColumnAlignment.RIGHT],
      ["", "", ""]
    );
    await sleep(100);

    NetPrinter.printColumnsText(
      ["ORDER ID", "", `${order.id}`],
      [col1, col2, col3],
      [ColumnAlignment.LEFT, ColumnAlignment.CENTER, ColumnAlignment.RIGHT],
      ["", "", ""]
    );
    await sleep(100);

    NetPrinter.printColumnsText(
      ["Processed By", "", `${order.processedBy.name.slice(0, col3 - 1)}`],
      [col1, col2, col3],
      [ColumnAlignment.LEFT, ColumnAlignment.CENTER, ColumnAlignment.RIGHT],
      ["", "", ""]
    );
    await sleep(100);

    NetPrinter.printText(
      paperWidth === "58mm"
        ? "--------------------------------"
        : COMMANDS.HORIZONTAL_LINE.HR3_80MM
    );
    await sleep(100);

    for (const item of order.orderedProducts) {
      const itemTotal = Number(item.quantity) * Number(item.price);
      const itemDiscount = (Number(item.discount) * itemTotal) / 100;

      subtotal += itemTotal;
      totalDiscount += itemDiscount;

      NetPrinter.printText(
        `${COMMANDS.TEXT_FORMAT.TXT_BOLD_ON}${item.name.slice(0, width)}`
      );
      await sleep(100);

      NetPrinter.printColumnsText(
        [
          `${item.quantity}x   @${currencyFormat
            .format(Number(item.price))
            .replace(/[^\d.]/g, "")}`,
          "",
          `${currencyFormat.format(itemTotal).replace(/[^\d.]/g, "")}`,
        ],
        [col1, col2, col3],
        [ColumnAlignment.LEFT, ColumnAlignment.CENTER, ColumnAlignment.RIGHT],
        ["", "", ""]
      );
      await sleep(100);

      if (Number(item.discount)) {
        NetPrinter.printColumnsText(
          [
            `Disc. (${item.discount}%)`,
            "",
            `-${currencyFormat.format(itemDiscount).replace(/[^\d.]/g, "")}`,
          ],
          [col1, col2, col3],
          [ColumnAlignment.LEFT, ColumnAlignment.CENTER, ColumnAlignment.RIGHT],
          ["", "", ""]
        );
        await sleep(100);
      }
    }

    NetPrinter.printText(
      paperWidth === "58mm"
        ? "--------------------------------"
        : COMMANDS.HORIZONTAL_LINE.HR3_80MM
    );
    await sleep(100);

    NetPrinter.printColumnsText(
      [
        `Subtotal`,
        "",
        `${currencyFormat.format(subtotal).replace(/\u00A0/g, "")}`,
      ],
      [col1, col2, col3],
      [ColumnAlignment.LEFT, ColumnAlignment.CENTER, ColumnAlignment.RIGHT],
      ["", "", ""]
    );
    await sleep(100);

    NetPrinter.printColumnsText(
      [
        `Total Discount`,
        "",
        `-${currencyFormat.format(totalDiscount).replace(/\u00A0/g, "")}`,
      ],
      [col1, col2, col3],
      [ColumnAlignment.LEFT, ColumnAlignment.CENTER, ColumnAlignment.RIGHT],
      ["", "", ""]
    );
    await sleep(100);

    NetPrinter.printColumnsText(
      [`Tax`, "", ``],
      [col1, col2, col3],
      [ColumnAlignment.LEFT, ColumnAlignment.CENTER, ColumnAlignment.RIGHT],
      ["", "", ""]
    );
    await sleep(100);

    NetPrinter.printText(
      paperWidth === "58mm"
        ? "--------------------------------"
        : COMMANDS.HORIZONTAL_LINE.HR3_80MM
    );
    await sleep(100);

    NetPrinter.printColumnsText(
      [
        `Total`,
        "",
        `${currencyFormat
          .format(Number(order.totalAmount))
          .replace(/\u00A0/g, "")}`,
      ],
      [col1, col2, col3],
      [ColumnAlignment.LEFT, ColumnAlignment.CENTER, ColumnAlignment.RIGHT],
      [`${COMMANDS.TEXT_FORMAT.TXT_BOLD_ON}`, "", ""]
    );
    await sleep(100);

    NetPrinter.printText(
      paperWidth === "58mm"
        ? "--------------------------------"
        : COMMANDS.HORIZONTAL_LINE.HR3_80MM
    );
    await sleep(100);

    NetPrinter.printColumnsText(
      [
        `Payment (${order.paymentMethod.name})`,
        "",
        `${currencyFormat
          .format(Number(order.cashAmount))
          .replace(/\u00A0/g, "")}`,
      ],
      [col1, col2, col3],
      [ColumnAlignment.LEFT, ColumnAlignment.CENTER, ColumnAlignment.RIGHT],
      ["", "", ""]
    );
    await sleep(100);

    NetPrinter.printColumnsText(
      [
        `Change`,
        "",
        `${currencyFormat
          .format(Number(order.cashAmount) - Number(order.totalAmount))
          .replace(/\u00A0/g, "")}`,
      ],
      [col1, col2, col3],
      [ColumnAlignment.LEFT, ColumnAlignment.CENTER, ColumnAlignment.RIGHT],
      ["", "", ""]
    );
    await sleep(100);

    NetPrinter.printText(
      paperWidth === "58mm"
        ? "--------------------------------"
        : COMMANDS.HORIZONTAL_LINE.HR3_80MM
    );
    await sleep(100);

    NetPrinter.printBill(
      `\n${
        COMMANDS.TEXT_FORMAT.TXT_ALIGN_CT
      }Thank you for your purchase!\n\n\n\n${
        COMMANDS.TEXT_FORMAT.TXT_ALIGN_CT
      }Printed on: ${dayjs().format("DD MMM YYYY - HH:mm")}`,
      {
        beep: false,
      }
    );
    await sleep(100);
  } else {
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
      `<C>${COMMANDS.TEXT_FORMAT.TXT_BOLD_ON}${store.name}${
        COMMANDS.TEXT_FORMAT.TXT_BOLD_OFF
      }</C>${COMMANDS.LINE_SPACING.LS_SET}\x30\n<C>${store.address}</C>${
        COMMANDS.LINE_SPACING.LS_SET
      }\x30\n<C>${store.phone}</C>${COMMANDS.LINE_SPACING.LS_SET}\x35\n${
        paperWidth === "58mm"
          ? "--------------------------------"
          : COMMANDS.HORIZONTAL_LINE.HR3_80MM
      }${COMMANDS.LINE_SPACING.LS_DEFAULT}`
    );
    await sleep(100);

    BLEPrinter.printColumnsText(
      [
        `${createdAt.format("DD MMM YYYY")}`,
        "",
        `${createdAt.format("HH:mm")}`,
      ],
      [col1, col2, col3],
      [ColumnAlignment.LEFT, ColumnAlignment.CENTER, ColumnAlignment.RIGHT],
      ["", "", ""]
    );
    await sleep(100);

    BLEPrinter.printColumnsText(
      ["ORDER ID", "", `${order.id}`],
      [col1, col2, col3],
      [ColumnAlignment.LEFT, ColumnAlignment.CENTER, ColumnAlignment.RIGHT],
      ["", "", ""]
    );
    await sleep(100);

    BLEPrinter.printColumnsText(
      ["Processed By", "", `${order.processedBy.name.slice(0, col3 - 1)}`],
      [col1, col2, col3],
      [ColumnAlignment.LEFT, ColumnAlignment.CENTER, ColumnAlignment.RIGHT],
      ["", "", ""]
    );
    await sleep(100);

    BLEPrinter.printText(
      paperWidth === "58mm"
        ? "--------------------------------"
        : COMMANDS.HORIZONTAL_LINE.HR3_80MM
    );
    await sleep(100);

    for (const item of order.orderedProducts) {
      const itemTotal = Number(item.quantity) * Number(item.price);
      const itemDiscount = (Number(item.discount) * itemTotal) / 100;

      subtotal += itemTotal;
      totalDiscount += itemDiscount;

      BLEPrinter.printText(
        `${COMMANDS.TEXT_FORMAT.TXT_BOLD_ON}${item.name.slice(0, width)}`
      );
      await sleep(100);

      BLEPrinter.printColumnsText(
        [
          `${item.quantity}x   @${currencyFormat
            .format(Number(item.price))
            .replace(/[^\d.]/g, "")}`,
          "",
          `${currencyFormat.format(itemTotal).replace(/[^\d.]/g, "")}`,
        ],
        [col1, col2, col3],
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
          [col1, col2, col3],
          [ColumnAlignment.LEFT, ColumnAlignment.CENTER, ColumnAlignment.RIGHT],
          ["", "", ""]
        );
        await sleep(100);
      }
    }

    BLEPrinter.printText(
      paperWidth === "58mm"
        ? "--------------------------------"
        : COMMANDS.HORIZONTAL_LINE.HR3_80MM
    );
    await sleep(100);

    BLEPrinter.printColumnsText(
      [
        `Subtotal`,
        "",
        `${currencyFormat.format(subtotal).replace(/\u00A0/g, "")}`,
      ],
      [col1, col2, col3],
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
      [col1, col2, col3],
      [ColumnAlignment.LEFT, ColumnAlignment.CENTER, ColumnAlignment.RIGHT],
      ["", "", ""]
    );
    await sleep(100);

    BLEPrinter.printColumnsText(
      [`Tax`, "", ``],
      [col1, col2, col3],
      [ColumnAlignment.LEFT, ColumnAlignment.CENTER, ColumnAlignment.RIGHT],
      ["", "", ""]
    );
    await sleep(100);

    BLEPrinter.printText(
      paperWidth === "58mm"
        ? "--------------------------------"
        : COMMANDS.HORIZONTAL_LINE.HR3_80MM
    );
    await sleep(100);

    BLEPrinter.printColumnsText(
      [
        `Total`,
        "",
        `${currencyFormat
          .format(Number(order.totalAmount))
          .replace(/\u00A0/g, "")}`,
      ],
      [col1, col2, col3],
      [ColumnAlignment.LEFT, ColumnAlignment.CENTER, ColumnAlignment.RIGHT],
      [`${COMMANDS.TEXT_FORMAT.TXT_BOLD_ON}`, "", ""]
    );
    await sleep(100);

    BLEPrinter.printText(
      paperWidth === "58mm"
        ? "--------------------------------"
        : COMMANDS.HORIZONTAL_LINE.HR3_80MM
    );
    await sleep(100);

    BLEPrinter.printColumnsText(
      [
        `Payment (${order.paymentMethod.name})`,
        "",
        `${currencyFormat
          .format(Number(order.cashAmount))
          .replace(/\u00A0/g, "")}`,
      ],
      [col1, col2, col3],
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
      [col1, col2, col3],
      [ColumnAlignment.LEFT, ColumnAlignment.CENTER, ColumnAlignment.RIGHT],
      ["", "", ""]
    );
    await sleep(100);

    BLEPrinter.printText(
      paperWidth === "58mm"
        ? "--------------------------------"
        : COMMANDS.HORIZONTAL_LINE.HR3_80MM
    );
    await sleep(100);

    BLEPrinter.printBill(
      `\n${
        COMMANDS.TEXT_FORMAT.TXT_ALIGN_CT
      }Thank you for your purchase!\n\n\n\n${
        COMMANDS.TEXT_FORMAT.TXT_ALIGN_CT
      }Printed on: ${dayjs().format("DD MMM YYYY - HH:mm")}`,
      {
        beep: false,
      }
    );
    await sleep(100);
  }
  return true;
};

export default printCustomerReceipt;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
