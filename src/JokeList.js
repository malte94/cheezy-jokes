import axios from 'axios';
import {useEffect, useState} from 'react';

export default function JokeList() {

    const[jokes, setJokes] = useState([]);

    const getJokes = async () => {
        for(let i = 0; i < 10; i++) {
            await axios.get("https://icanhazdadjoke.com/", {headers: {Accept: "application/json"}})
            .then((res) => setJokes(prev => [...prev, res.data.joke]))
            }
        /* As an alternative approach: Set an empty array (let x = []) to the beginning of this function.
        Popoluate setJokes(x) HERE, 'await' will wait for it,
        and use another useEffect, which listens to [jokes] to output
            1. the console.log only once and
            2. the DOM only once.
        (The API is quite slow, so with the currently implemented method a rendering is visible) */
        }
            useEffect(() => {
                getJokes();
            },[])

            useEffect(() => {
                console.log("Updated the Jokes: ");
                console.log(jokes);
            }, [jokes]);

    return (
      <div className="JokeList">
        <h1>Cheezy Jokes</h1>
        {jokes.map(j => (
            <div>{j}</div>
        ))}
        <div className="JokeList-jokes">

        </div>
      </div>
    );
  }