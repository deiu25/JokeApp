import "./App.css";
import robot from "./robot.gif";
import React, { Component } from "react";
import VoiceRSS from "./components/VoiceRSS";

class JokeApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      joke: "",
    };
  }

  renderJoke = (joke) => {
    this.setState({ joke });
  };

  getJokes = async () => {
    const url = "https://v2.jokeapi.dev/joke/Any";

    let joke = "";

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.setup) {
        joke = `${data.setup} ... ${data.delivery}`;
      } else {
        joke = data.joke;
      }
      console.log(data);
      console.log(joke);
    } catch (e) {
      console.log(e);
    }
    this.renderJoke(joke);
    this.tellMeAJoke(joke);
  };

  tellMeAJoke = (joke) => {
    VoiceRSS.speech({
      key: "5ff4b1b6ab8143f488a977bc3a2f2a9c",
      src: joke,
      hl: "en-us",
      v: "Linda",
      r: 0,
      c: "mp3",
      f: "44khz_16bit_stereo",
      ssml: false,
    });
  };

  render() {
    const { joke } = this.state;

    return (
      <div className="container">
        <button id="button" onClick={this.getJokes}>
          Get Jokes
        </button>
        <p id="speech" className="speech-bubble">
          {joke} Hello!
        </p>
        <img className="robo" src={robot} alt="robo" />
      </div>
    );
  }
}

export default JokeApp;
