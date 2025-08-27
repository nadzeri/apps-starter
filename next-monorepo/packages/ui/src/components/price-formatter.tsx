import React from "react";

const PriceFormatter: React.FC<PriceFormatterProps> = ({ price }) => {
  const format = (priceInCents: number): number => {
    return priceInCents / 100;
  };

  return <>${format(price)}</>;
};

interface PriceFormatterProps {
  price: number;
}

export default PriceFormatter;
