import * as yup from "yup";
import { validationMessage } from "@/config/validationMessage.js";

const { REQUIRED } = validationMessage;

export const validationSchema = yup
.object({
  name: yup.string().required(REQUIRED),
  surname: yup.string().required(REQUIRED),
  region: yup.number()
    .default(null)
    .nullable(),
  description: yup.string()
    .transform(currentValue => currentValue.trim() ? currentValue : null)
    .trim()
    .nullable(),
})