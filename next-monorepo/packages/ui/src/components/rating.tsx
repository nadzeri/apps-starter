import React from "react";
import ReactRating, { RatingComponentProps } from "react-rating";

type Props = RatingComponentProps;

export default function Rating(props: Props) {
  const Root = ReactRating as unknown as ((props: Props) => JSX.Element);

  return (
    <Root {...props} />
  );
}