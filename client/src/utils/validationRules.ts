import { Rule } from "antd/lib/form";

export const emailRules: Rule[] = [
  {
    type: "email",
    message: "The input is not a valid E-mail!",
  },
  {
    required: true,
    message: "Please input your E-mail!",
  },
];

export const fullNameRules: Rule[] = [
  {
    required: true,
    message: "Please input your Fullname!",
  },
];
