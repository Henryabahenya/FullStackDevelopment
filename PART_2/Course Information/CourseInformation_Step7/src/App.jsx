const Header = ({ name }) => {
  console.log('Header rendering with name:', name)
  return <h1>{name}</h1>
}

const Part = ({ part }) => {
  console.log('Part rendering:', part.name, part.exercises)
  return (
    <p>
      {part.name} {part.exercises}
    </p>
  )
}

const Content = ({ parts }) => {
  console.log('Content rendering with parts array:', parts)
  return (
    <div>
      {parts.map(part => (
        <Part key={part.id} part={part} />
      ))}
    </div>
  )
}

const Total = ({ parts }) => {
  let sum = 0
  console.log('--- Starting Calculation ---')
  
  parts.forEach((part, index) => {
    sum += part.exercises
    console.log(`Step ${index + 1}: Added ${part.exercises}, current sum is ${sum}`)
  })
  
  console.log('Final Total:', sum)
  console.log('--- Calculation Complete ---')

  return (
    <p><strong>total of {sum} exercises</strong></p>
  )
}

const Course = ({ course }) => {
  console.log('Course component received data for:', course.name)
  return (
    <div>
      <Header name={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
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
      { name: 'State of a component', exercises: 14, id: 3 },
      { name: 'Redux', exercises: 11, id: 4 }
    ]
  }

  return <Course course={course} />
}

export default App