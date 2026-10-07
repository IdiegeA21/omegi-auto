/**
 * How a car can be paid for. Lives on each car in data/cars.json as `payment`.
 *
 *  price           Full price in naira. Leave null until known. Shown only when set.
 *  downPayment     A down payment the caption or owner STATED, in naira.
 *  downPaymentBy   Where that figure came from: "caption" or "owner".
 *  installment     true when instalment financing is open on this car (caption or owner said so).
 *  outright        true when it can be bought outright (default true).
 *
 * If the owner later decides a car sells at a different price, or stops offering financing,
 * change these fields in cars.json. No code changes needed.
 */
export type PaymentInput = {
  price?: number | null;
  downPayment?: number | null;
  downPaymentBy?: "caption" | "owner" | null;
  installment?: boolean;
  outright?: boolean;
};

export type MoneyFigure = {
  amount: number;
  /** "stated": from caption/owner. "rule": computed from the 40% offer. Rule figures are labelled as such. */
  basis: "stated" | "rule";
};

export type PaymentView = {
  /** Which treatment the UI uses. */
  mode: "installment" | "outright" | "ask";
  installment: boolean;
  downPayment: MoneyFigure | null;
  /** Full price, or null when unknown (UI shows "Ask for price"). */
  price: number | null;
  /** Share of price paid up front (0..1). Only set when BOTH figures are known, so the bar never implies a ratio we can't back. */
  downRatio: number | null;
};
