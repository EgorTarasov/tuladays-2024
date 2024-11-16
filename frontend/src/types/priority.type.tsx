import PriorityHighIcon from "@/assets/priority-high.svg?react";
import PriorityMediumIcon from "@/assets/priority-medium.svg?react";
import PriorityLowIcon from "@/assets/priority-low.svg?react";
import PriorityHighAlternateIcon from "@/assets/priority-alternate-high.svg?react";
import PriorityMediumAlternateIcon from "@/assets/priority-alternate-medium.svg?react";
import PriorityLowAlternateIcon from "@/assets/priority-alternate-low.svg?react";

export enum Priority {
  HIGH = 3,
  MEDIUM = 2,
  LOW = 1,
}

export const PriorityLocaleMap = {
  [Priority.HIGH]: {
    locale: "Высокий",
    alternateLocale: "Высокая",
    color: "#EF4444",
    backgroundColor: "rgba(239, 68, 68, 0.2)",
    icon: <PriorityHighIcon />,
    alternateIcon: <PriorityHighAlternateIcon />,
  },
  [Priority.MEDIUM]: {
    locale: "Средний",
    alternateLocale: "Средняя",
    color: "# #0EA5E9",
    backgroundColor: "rgba(14, 165, 233, 0.2)",
    icon: <PriorityMediumIcon />,
    alternateIcon: <PriorityMediumAlternateIcon />,
  },
  [Priority.LOW]: {
    locale: "Низкий",
    alternateLocale: "Низкая",
    color: "#16A34A",
    backgroundColor: "rgba(247, 119, 0, 0.2)",
    icon: <PriorityLowIcon />,
    alternateIcon: <PriorityLowAlternateIcon />,
  },
};
