import { useState, useEffect } from 'react'
import axios from 'axios'

const App = () => {
  const [query, setQuery] = useState('')
  const [countries, setCountries] = useState([])
  const [filteredCountries, setFilteredCountries] = useState([])

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        setCountries(response.data)
      })
      .catch(error => console.log(error))
  }, [])

  const handleSearch = (event) => {
    const value = event.target.value
    setQuery(value)
    
    const results = countries.filter(c => 
      c.name.common.toLowerCase().includes(value.toLowerCase())
    )
    setFilteredCountries(results)
  }

  const showCountry = (countryName) => {
    const selected = countries.filter(c => c.name.common === countryName)
    setFilteredCountries(selected)
  }

  return (
    <div>
      <div>
        find countries <input value={query} onChange={handleSearch} />
      </div>
      <Display results={filteredCountries} onShow={showCountry} />
    </div>
  )
}

const Display = ({ results, onShow }) => (
  results.length > 10
    ? <div>Too many matches, specify another filter</div>
    : results.length > 1
      ? <div>
          {results.map(c => (
            <div key={c.cca3}>
              {c.name.common} <button onClick={() => onShow(c.name.common)}>Show</button>
            </div>
          ))}
        </div>
      : results.length === 1
        ? <CountryDetail country={results[0]} />
        : null
)

const CountryDetail = ({ country }) => (
  <div>
    <h1>{country.name.common}</h1>
    <div>Capital {country.capital}</div>
    <div>Area {country.area}</div>
    
    <h3>Languages</h3>
    <ul>
      {Object.values(country.languages).map(lang => (
        <li key={lang}>{lang}</li>
      ))}
    </ul>
    
    <img 
      src={country.flags.png} 
      alt={country.name.common} 
      width="150" 
    />
  </div>
)
export default App