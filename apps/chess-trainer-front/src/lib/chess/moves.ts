import { Square } from "./squares";
type PromotionType = "q" | "r" | "b" | "n";
export type Move = {
  from: Square;
  to: Square;
  promotion?: PromotionType;
};
