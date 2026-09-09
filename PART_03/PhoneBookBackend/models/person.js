const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.set('strictQuery', false)
mongoose.connect(url)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })


const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true
  },
  number: {
  type: String,
  required: true,
  // 1. Enforce a minimum length (adjusted to 9 to account for the '+' character)
  minlength: [9, 'Phone number with country code must have at least 9 characters'],

  // 2. Use the updated custom validator with the new Country Code Regex
  validate: {
    validator: function(v) {
      // Regex broken down:
      // ^\+        -> Must start with a literal '+' sign
      // \d{1,3}    -> Followed by a 1 to 3 digit country code (e.g., +254, +1, +44)
      // -          -> Followed by a single hyphen
      // \d+$       -> Ends with one or more digits until the end of the string
      return /^\+\d{1,3}-\d+$/.test(v)
    },
    message: props => `${props.value} is not a valid phone number! Format must start with '+' followed by the country code and a hyphen (e.g., +254-712345678).`
  }
}
})


personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)