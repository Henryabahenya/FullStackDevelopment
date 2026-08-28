import React from "react";

interface Part {
  name: string;
  exercises: number;
}

interface ContentProps {
  parts: Part[];
}

const Content: React.FC<ContentProps> = ({ parts }) => (
  <div>
    {parts.map((p) => (
      <p key={p.name}>
        {p.name} {p.exercises}
      </p>
    ))}
  </div>
);

export default Content;
