interface CoursePart {
  name: string;
  exerciseCount: number;
}

interface HeaderProps {
  name: string;
}

interface ContentProps {
  parts: CoursePart[];
}

interface TotalProps {
  totalExercises: number;
}

const Header: React.FC<HeaderProps> = ({ name }) => {
  return <h1>{name}</h1>;
};

const Content: React.FC<ContentProps> = ({ parts }) => {
  return (
    <>
      {parts.map((part) => (
        <p key={part.name}>
          {part.name} {part.exerciseCount}
        </p>
      ))}
    </>
  );
};

const Total: React.FC<TotalProps> = ({ totalExercises }) => {
  return <p>Number of exercises {totalExercises}</p>;
};

function App() {
  const courseName = "Half Stack application development";
  const parts: CoursePart[] = [
    {
      name: "Fundamentals of React",
      exerciseCount: 10,
    },
    {
      name: "Using props to pass data",
      exerciseCount: 7,
    },
    {
      name: "State of a component",
      exerciseCount: 14,
    },
  ];

  const totalExercises = parts.reduce(
    (sum, part) => sum + part.exerciseCount,
    0,
  );

  return (
    <>
      <Header name={courseName} />
      <Content parts={parts} />
      <Total totalExercises={totalExercises} />
    </>
  );
}

export default App;
