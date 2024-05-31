import { atom } from "recoil";

export const selectedDepartmentRecoil = atom({
  key: "selectedDepartmentRecoil", // unique ID (with respect to other atoms/selectors)
  default: null as null | { name: string; id: number }, // default value (aka initial value)
});
