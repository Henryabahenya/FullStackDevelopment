export const getAll = async () => {
  return [
    {
      id: '1',
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      blogs: [{}, {}, {}],
    },
    {
      id: '2',
      username: 'ousavola',
      name: 'Outi Savolainen',
      blogs: [{}, {}],
    },
    {
      id: '3',
      username: 'hellas',
      name: 'Arto Hellas',
      blogs: [{}],
    },
  ]
}

export default { getAll }
