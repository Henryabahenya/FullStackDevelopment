const Header = ({ name }) => {
  console.log('Header rendering for course:', name)
  return <h2>{name}</h2>
}


const Part = ({ part }) => {
  console.log('  Part rendering:', part.name)
  return (
    <p>
      {part.name} {part.exercises}
    </p>
  )
}

const Content = ({ parts }) => {
  console.log(' Content rendering with', parts.length, 'parts')
  return (
    <div>
      {parts.map(part => (
        <Part key={part.id} part={part} />
      ))}
    </div>
  )
}

const Total = ({ parts }) => {
  const sum = parts.reduce((s, p) => {
    console.log('   Calculating total: adding', p.exercises, 'to current sum', s)
    return s + p.exercises
  }, 0)
  
  return (
    <p><strong>total of {sum} exercises</strong></p>
  )
}

const Course = ({ course }) => {
  console.log('Course Component starting for ID:', course.id)
  return (
    <div>
      <Header name={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
   
    </div>
  )
}

const App = () => {
  const courses = [
    {
      name: 'Half Stack application development',
      id: 1,
      parts: [
        { name: 'Fundamentals of React', exercises: 10, id: 1 },
        { name: 'Using props to pass data', exercises: 7, id: 2 },
        { name: 'State of a component', exercises: 14, id: 3 },
        { name: 'Redux', exercises: 11, id: 4 }
      ]
    }, 
    {
      name: 'Node.js',
      id: 2,
      parts: [
        { name: 'Routing', exercises: 3, id: 1 },
        { name: 'Middlewares', exercises: 7, id: 2 }
      ]
    }
  ]

  console.log('App rendering. Total courses to map:', courses.length)

  return (
    <div>
      <h1>Web development curriculum</h1>
      {courses.map(course => {
        console.log('Mapping Course:', course.name)
        return <Course key={course.id} course={course} />
      })}
    </div>
  )
}

export default App