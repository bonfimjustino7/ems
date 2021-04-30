import { format } from "date-fns";

export const getDateTimeFormatter = (date) => {
  return format(new Date(date), "dd/MM/yyyy HH:mm:ss");
};
