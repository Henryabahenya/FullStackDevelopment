import React from "react";

interface Part {
  name: string;
  exercises: number;
}

interface TotalProps {
  parts: Part[];
}

const Total: React.FC<TotalProps> = ({ parts }) => {
  const sum = parts.reduce((s, p) => s + p.exercises, 0);
  return <p>Total exercises: {sum}</p>;
};

export default Total;
