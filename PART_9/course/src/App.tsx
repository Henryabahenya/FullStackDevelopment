interface CoursePartBase {
  name: string;
  exerciseCount: number;
}

interface CoursePartWithDescription extends CoursePartBase {
  description: string;
}

interface CoursePartBasic extends CoursePartWithDescription {
  kind: "basic";
}

interface CoursePartBackground extends CoursePartWithDescription {
  kind: "background";
  backgroundMaterial: string;
}

interface CoursePartAnalysis extends CoursePartWithDescription {
  kind: "analysis";
  exercises: string[];
}

interface CoursePartSpecial extends CoursePartBase {
  kind: "special";
  requirements: string[];
}

type CoursePart =
  | CoursePartBasic
  | CoursePartBackground
  | CoursePartAnalysis
  | CoursePartSpecial;

interface HeaderProps {
  name: string;
}

interface ContentProps {
  parts: CoursePart[];
}

interface TotalProps {
  totalExercises: number;
}

interface PartProps {
  part: CoursePart;
}

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`,
  );
};

const Header: React.FC<HeaderProps> = ({ name }) => {
  return <h1>{name}</h1>;
};

const Part: React.FC<PartProps> = ({ part }) => {
  switch (part.kind) {
    case "basic":
      return (
        <div>
          <p>
            <strong>{part.name}</strong> {part.exerciseCount}
          </p>
          <p>{part.description}</p>
        </div>
      );
    case "background":
      return (
        <div>
          <p>
            <strong>{part.name}</strong> {part.exerciseCount}
          </p>
          <p>{part.description}</p>
          <p>Material: {part.backgroundMaterial}</p>
        </div>
      );
    case "analysis":
      return (
        <div>
          <p>
            <strong>{part.name}</strong> {part.exerciseCount}
          </p>
          <p>{part.description}</p>
          <p>Exercises: {part.exercises.join(", ")}</p>
        </div>
      );
    case "special":
      return (
        <div>
          <p>
            <strong>{part.name}</strong> {part.exerciseCount}
          </p>
          <p>Requirements: {part.requirements.join(", ")}</p>
        </div>
      );
    default:
      return assertNever(part);
  }
};

const Content: React.FC<ContentProps> = ({ parts }) => {
  return (
    <>
      {parts.map((part) => (
        <Part key={part.name} part={part} />
      ))}
    </>
  );
};

const Total: React.FC<TotalProps> = ({ totalExercises }) => {
  return <p>Number of exercises {totalExercises}</p>;
};

function App() {
  const courseName = "Half Stack application development";
  const courseParts: CoursePart[] = [
    {
      name: "Fundamentals of React",
      exerciseCount: 10,
      description: "Your journey to React mastery starts here",
      kind: "basic",
    },
    {
      name: "Using props to pass data",
      exerciseCount: 7,
      description: "Passing data is fundamental",
      kind: "basic",
    },
    {
      name: "Basics of type Narrowing",
      exerciseCount: 7,
      description: "Eliminating union types with JavaScript is vital",
      kind: "background",
      backgroundMaterial:
        "https://www.typescriptlang.org/docs/handbook/2/narrowing.html",
    },
    {
      name: "Deeper type usage",
      exerciseCount: 14,
      description: "Confusing at first, but powerful once you get it",
      kind: "analysis",
      exercises: [
        "myObject.next = anotherObject",
        "myString.endsWith(searching)",
        "ismbeijä.random() > 0.5",
      ],
    },
    {
      name: "TypeScript in frontend",
      exerciseCount: 10,
      description: "a must-have for modern web development",
      kind: "basic",
    },
    {
      name: "Backend development",
      exerciseCount: 21,
      kind: "special",
      requirements: ["nodejs", "jest", "postgres"],
    },
  ];

  const totalExercises = courseParts.reduce(
    (sum, part) => sum + part.exerciseCount,
    0,
  );

  return (
    <>
      <Header name={courseName} />
      <Content parts={courseParts} />
      <Total totalExercises={totalExercises} />
    </>
  );
}

export default App;
