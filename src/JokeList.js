import axios from 'axios';
import {useEffect, useState} from 'react';
import {v4 as uuidv4} from 'uuid';

/* ----- Components ----- */
import Joke from './Joke.js';

export default function JokeList(props) {

    const[jokes, setJokes] = useState([]);

    const getJokes = async () => {
        for(let i = 0; i < props.numJokesToGet; i++) {
            await axios.get("https://icanhazdadjoke.com/", {headers: {Accept: "application/json"}})
            .then((res) => setJokes(prev => [...prev, {
                id: uuidv4(),
                joke: res.data.joke, 
                votes: 0
            }]))
        }
        /* As an alternative approach: Set an empty array (let x = []) to the beginning of this function.
        Popoluate setJokes(x) HERE, 'await' will wait for it,
        and use another useEffect, which listens to [jokes] to output
            1. the console.log only once and
            2. the DOM only once.
        (The API is quite slow, so with the currently implemented method a rendering is visible) */
    }
            useEffect(() => {
                setJokes([]); // clear jokes
                getJokes();
            },[])

            useEffect(() => {
                console.log("Updated the Jokes: ");
                console.log(jokes);
            }, [jokes]);

    const handleVote = (id, voteValue) => {
        setJokes(
            jokes.map(j => (
            j.id === id ? {...j, votes: j.votes + voteValue} : j
        )))
    }

    return (
      <div className="JokeList">
            <div className="JokeList-sidebar">
                <h1 className="JokeList-title"><span>Cheezy</span> Jokes</h1>
                <img src='https://assets.dryicons.com/uploads/icon/svg/8927/0eb14c71-38f2-433a-bfc8-23d9c99b3647.svg' />
                <button className='JokeList-getmore'>New Jokes</button>
            </div>
            <div className="JokeList-jokes">
            {jokes.map(j => (
                <Joke key={j.id} text={j.joke} votes={j.votes} upvote={() => handleVote(j.id, 1)} downvote={() => handleVote(j.id, -1)}  />
            ))}
            </div>
      </div>
    );
  }