import { useState, useEffect } from 'react'
import axios from 'axios'

const Weather = ({ city }) => {
  const [weather, setWeather] = useState(null)
  const api_key = import.meta.env.VITE_WEATHER_KEY

  useEffect(() => {
    axios
      .get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${api_key}`)
      .then(response => {
        setWeather(response.data)
      })
      .catch(error => console.log(error))
  }, [city, api_key])

  return (
    weather ? (
      <div>
        <h2>Weather in {city}</h2>
        <div>Temperature {weather.main.temp} Celsius</div>
        <img 
          src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} 
          alt={weather.weather[0].description} 
        />
        <div>Wind {weather.wind.speed} m/s</div>
      </div>
    ) : null
  )
}

const CountryDetail = ({ country }) => (
  <div>
    <h1>{country.name.common}</h1>
    <div>Capital {country.capital[0]}</div>
    <div>Area {country.area}</div>
    
    <h3>Languages</h3>
    <ul>
      {Object.values(country.languages).map(lang => (
        <li key={lang}>{lang}</li>
      ))}
    </ul>
    
    <img src={country.flags.png} alt={country.name.common} width="150" />
    <Weather city={country.capital[0]} />
  </div>
)

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

const App = () => {
  const [query, setQuery] = useState('')
  const [countries, setCountries] = useState([])
  const [filteredCountries, setFilteredCountries] = useState([])

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => setCountries(response.data))
  }, [])

  const handleSearch = (event) => {
    const value = event.target.value
    setQuery(value)
    const results = countries.filter(c => 
      c.name.common.toLowerCase().includes(value.toLowerCase())
    )
    setFilteredCountries(results)
  }

  const showCountry = (name) => {
    setFilteredCountries(countries.filter(c => c.name.common === name))
  }

  return (
    <div>
      <div>find countries <input value={query} onChange={handleSearch} /></div>
      <Display results={filteredCountries} onShow={showCountry} />
    </div>
  )
}
export default App