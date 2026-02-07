import { IconDimension } from "@c_types/icon-dimension.type";

export interface NavItem {
  label: string,
  route: string,
  icon?: {
    name: string,
    dimension: IconDimension
  },
}