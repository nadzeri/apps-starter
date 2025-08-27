"use client";
import React from "react";
import { api } from "../../trpc/react";

const TempClient: React.FC<TempClientProps> = ({}) => {
  const { data, isLoading } = api.temp.first.useQuery();
  if (isLoading) return <div>Loading...</div>;
  return (
    <div>
      <span>From Client:</span> {data}
    </div>
  );
};

interface TempClientProps {}

export default TempClient;
