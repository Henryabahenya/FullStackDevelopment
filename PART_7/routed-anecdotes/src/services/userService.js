export const getAll = async () => {
  return [
    {
      id: '1',
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      blogs: [
        { id: 'b1', title: 'React patterns' },
        { id: 'b2', title: 'Using props to pass data' },
        { id: 'b3', title: 'Component composition' },
      ],
    },
    {
      id: '2',
      username: 'ousavola',
      name: 'Outi Savolainen',
      blogs: [
        { id: 'b4', title: 'State management' },
        { id: 'b5', title: 'Form handling' },
      ],
    },
    {
      id: '3',
      username: 'hellas',
      name: 'Arto Hellas',
      blogs: [{ id: 'b6', title: 'Testing components' }],
    },
  ]
}

export default { getAll }
