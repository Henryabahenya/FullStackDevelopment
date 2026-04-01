const Header = ({ name }) => {
  console.log('Header props:', name)
  return <h1>{name}</h1>
}

const Part = ({ part }) => {
  console.log('Part props:', part)
  return (
    <p>
      {part.name} {part.exercises}
    </p>
  )
}

const Content = ({ parts }) => {
  console.log('Content props (array):', parts)
  return (
    <div>
      {parts.map(part => {
        // Logging inside the map to see each iteration
        console.log('Mapping part ID:', part.id)
        return <Part key={part.id} part={part} />
      })}
    </div>
  )
}

const Course = ({ course }) => {
  console.log('Course props:', course)
  return (
    <div>
      <Header name={course.name} />
      <Content parts={course.parts} />
    </div>
  )
}

const App = () => {
  const course = {
    id: 1,
    name: 'Half Stack application development',
    parts: [
      { name: 'Fundamentals of React', exercises: 10, id: 1 },
      { name: 'Using props to pass data', exercises: 7, id: 2 },
      { name: 'State of a component', exercises: 14, id: 3 }
    ]
  }

  console.log('App is rendering with course:', course.name)
  return <Course course={course} />
}

export default App