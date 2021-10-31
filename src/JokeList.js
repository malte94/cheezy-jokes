import axios from 'axios';
import {useEffect, useState} from 'react';
import {v4 as uuidv4} from 'uuid';

/* ----- Components ----- */

import Joke from './Joke.js';

export default function JokeList(props) {

    const[jokes, setJokes] = useState(JSON.parse(window.localStorage.getItem("jokes")) || []); // if local storage --> get this. else empty array.
    const[loading, setLoading] = useState(false);

    const populateJokes = async () => {
        setLoading(true);
        for(let i = 0; i < props.numJokesToGet; i++) {
            await axios.get("https://icanhazdadjoke.com/", {headers: {Accept: "application/json"}})
            .then((res) => setJokes(prev => [...prev, {
                id: uuidv4(),
                joke: res.data.joke, 
                votes: 0
            }]))
        }
        setLoading(false);
    }
            /*initial loading*/ useEffect(() => {
                if(jokes.length === 0) populateJokes()
            }, [])

            /*onChange: jokes*/ useEffect(() => {
                window.localStorage.setItem(
                    "jokes",
                    JSON.stringify(jokes)
                )
                console.log("Updated the Jokes: ");
                console.log(jokes);
            }, [jokes]);

    const handleVote = (id, voteValue) => {
        setJokes(
            jokes.map(j => (
            j.id === id ? {...j, votes: j.votes + voteValue} : j
        )))
    }

    const handleClick = () => {
        populateJokes();
    }

    const handleReset = () => {
        setJokes([]);
        window.localStorage.clear("jokes");
    }

    const isLoading = () => {
        return (
        <div className="JokeList-loading">
            <i className="far fa-8x fa-laugh fa-spin" />
            <h1 className="JokeList-title">Fetching ...</h1>
        </div>
        )
    }

    return (
        <>
        {!loading ? ( 
            <div className="JokeList">
                <div className="JokeList-sidebar">
                    <h1 className="JokeList-title"><span>Cheezy</span> Jokes</h1>
                    <img src='https://assets.dryicons.com/uploads/icon/svg/8927/0eb14c71-38f2-433a-bfc8-23d9c99b3647.svg' />
                    <button className='JokeList-getmore' onClick={handleClick}>Get Jokes</button>
                    <button className='JokeList-delete' onClick={handleReset}>Reset</button>
                </div>
                <div className="JokeList-jokes">
                    {!jokes === undefined || jokes.length == 0 && (
                        <div className="JokeList-nocontent">
                            No content available ☹️
                        </div>
                    )}
                    {jokes.map(j => (
                        <Joke key={j.id} text={j.joke} votes={j.votes} upvote={() => handleVote(j.id, 1)} downvote={() => handleVote(j.id, -1)}  />
                    ))}                 
                </div>
            </div>
        ) : (isLoading())}
        </>
    )
}