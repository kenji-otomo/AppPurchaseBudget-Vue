import z from "zod"

export const appObject = z.object({
    id: z.number().nullable(),
    name: z.string(),
    last_purchase_at: z.string().nullable(),
  });

export const historyObject = z.object({
  AppID: z.number(),
  Amount: z.number().int().min(1, "課金額は1以上の整数で入力してください"),
  PurchaseDate: z.date(),
});

export const purchaseHistoryObject = z.object({
  id: z.number(),
  app_id: z.number(),
  amount: z.number(),
  purchase_date: z.string(),
  name: z.string(),
})

export const optionObject = z.object({
    value: z.number(),
    label: z.string(),
})

export const appHistoryObject = z.object({
  id: z.number(),
  name: z.string(),
  last_purchase_at: z.string().nullable(),
  amount: z.number(),
})
