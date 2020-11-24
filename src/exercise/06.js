// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
// fetchPokemon: the function we call to get the pokemon info
// PokemonInfoFallback: the thing we show while we're loading the pokemon info
// PokemonDataView: the stuff we use to display the pokemon info
import {PokemonForm, fetchPokemon, PokemonInfoFallback, PokemonDataView} from '../pokemon'

class ErrorBoundry extends React.Component {
  state = {
    error: null
  }
  static getDerivedStateFromError(error) {
    return {error}
  }
  render() {
    const {error} = this.state
    if (error){
      return <this.props.FallbackComponent error={error} />
    }
    return this.props.children
  }
}

function PokemonInfo({pokemonName}) {
  const [state, setState] = React.useState({status: 'idle', pokemon: null, error: null})

  const {status, pokemon, error} = state

  React.useEffect(() => {
    if(!pokemonName){
      return
    }
    setState({status: 'pending'})
    fetchPokemon(pokemonName).then(
      pokemon => {
        setState({status: 'resolved', pokemon})},
      error => {
        setState({status: 'rejected', error})
      }
    )
  },[pokemonName])

  if(status === 'idle'){
    return 'Submit a pokemon'
  } else if(status === 'pending'){
    return <PokemonInfoFallback name={pokemonName} />
  } else if(status === 'rejected'){
    throw error
  } else if(status === 'resolved') {
    return <PokemonDataView pokemon={pokemon} />
  }

  if(!pokemonName){
    return 'Submit a pokemon'
  } else if(!pokemon){
    return <PokemonInfoFallback name={pokemonName} />
  } else {
    return <PokemonDataView pokemon={pokemon} />
  }
}

function ErrorFallback(error) {
  return (
    <div role="alert">
      There was an error: <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
    </div>
  )
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <ErrorBoundry FallbackComponent={ErrorFallback}>
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundry>
      </div>
    </div>
  )
}

export default App
