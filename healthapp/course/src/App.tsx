import React from "react";
import "./App.css";
import Header from "./components/Header";
import Content from "./components/Content";
import Total from "./components/Total";

type Part = {
  name: string;
  exercises: number;
};

const App: React.FC = () => {
  const courseName = "Half Stack application development";
  const courseParts: Part[] = [
    { name: "Fundamentals of React", exercises: 10 },
    { name: "Using props to pass data", exercises: 7 },
    { name: "State of a component", exercises: 14 },
  ];

  return (
    <div>
      <Header courseName={courseName} />
      <Content parts={courseParts} />
      <Total parts={courseParts} />
    </div>
  );
};

export default App;
