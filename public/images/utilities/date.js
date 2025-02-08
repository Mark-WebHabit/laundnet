import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import updateLocale from "dayjs/plugin/updateLocale";

dayjs.extend(customParseFormat);
dayjs.extend(updateLocale);

dayjs.updateLocale("en", {
  formats: {
    LT: "h:mm A",
    LLL: "MMMM D, YYYY h:mm A",
  },
});

export function DbformatDateTime(value) {
  return dayjs(value).format("MMMM D, YYYY h:mm A");
}
