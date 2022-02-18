import React from "react";
import arrowLeft from "../layout/svg/arrow-left.svg";
import power from "../layout/svg/power.svg";
import minus from "../layout/svg/minus.svg";
import plus from "../layout/svg/plus.svg";

import "../layout/styles/RadioStations.scss";

class RadioStations extends React.Component {
  constructor(props) {
    super(props);
    // declaration of state variables
    this.state = {
      radiolist: [],
      visibility: [],
      currentlyPlaying: "",
      hidePlayer: true
    };
  }

  // initiate fetch request and declare variables on mount
  componentDidMount() {
    this.RadioStations();
  }

  // initiated on mount
  RadioStations() {
    // fetch json from url then fill radiolist with array from API
    fetch("https://jobapi.teclead-ventures.de/recruiting/radios")
      .then((res) => res.json())
      .then((out) => {
        this.setState({
          radiolist: out.radios
        });
      })
      .catch((err) => {
        throw err;
      });
    // fill visibilityArray with false for length of radiolist
    var visibilityArray = new Array(this.state.radiolist.length).fill(false);
    this.setState({
      visibility: visibilityArray
    });
  }

  // if radio name or frequency is clicked do this function
  showControls(index) {
    // if visibility on index is not true go into this statement
    if (!this.state.visibility[index]) {
      // create new Array with true value on index which radio station should be active
      var newVisibility = new Array(this.state.radiolist.length);
      newVisibility[index] = true;
      // declare new variable with value of radio station name for currently playing
      var radioplaying = this.state.radiolist[index].name;
      // set state of which radio station is active and playing
      this.setState({
        visibility: newVisibility,
        currentlyPlaying: radioplaying
      });
    }
    // station is already active / selected put value on index to false and currently playing string to empty
    else if (this.state.visibility[index]) {
      newVisibility = this.state.visibility;
      newVisibility[index] = false;
      this.setState({
        visibility: newVisibility,
        currentlyPlaying: ""
      });
    } else {
      console.log("This state should not happen");
    }
  }

  // function to change the station up or down
  switchRadioStation(index, upordown) {
    if (upordown === "plus") {
      // set current index on false and +1 on true
      var newVisibility = new Array(this.state.radiolist.length);
      newVisibility[index] = false;
      // if index is at the end of radiolist length skip to first entry
      if (index === this.state.radiolist.length - 1) {
        newVisibility[0] = true;
        var radioplaying = this.state.radiolist[0].name;
      } else {
        newVisibility[index + 1] = true;
        radioplaying = this.state.radiolist[index + 1].name;
      }
      // set state foor visibility array
      this.setState({
        visibility: newVisibility,
        currentlyPlaying: radioplaying
      });
    }
    // change the station back if index at 0 change to end of list
    else if (upordown === "minus") {
      newVisibility = new Array(this.state.radiolist.length);
      newVisibility[index] = false;
      // check for index 0
      if (index === 0) {
        newVisibility[this.state.radiolist.length - 1] = true;
        radioplaying = this.state.radiolist[this.state.radiolist.length - 1]
          .name;
      } else {
        newVisibility[index - 1] = true;
        radioplaying = this.state.radiolist[index - 1].name;
      }
      // set state of visibility array
      this.setState({
        visibility: newVisibility,
        currentlyPlaying: radioplaying
      });
    } else {
      console.log("this state also shouldn't happen");
    }
  }

  powerOff() {
    var visibilityArray = new Array(this.state.radiolist.length).fill(false);
    var radioplaying = "";
    this.setState({
      visibility: visibilityArray,
      currentlyPlaying: radioplaying
    });
  }

  hidePlayer() {
    if (this.state.hidePlayer)
      this.setState({
        hidePlayer: false
      });
    else
      this.setState({
        hidePlayer: true
      });
  }

  render() {
    // go through radiolist and create object of radio entry
    const radios = this.state.radiolist.map((item, i) => (
      <div className="Radio-Content">
        {/* if controls should be visible show it else null */}
        {this.state.visibility[i] ? (
          <div className="Controls">
            <button
              className="volume-button"
              onClick={() => this.switchRadioStation(i, "minus")}
            >
              <img
                src={minus}
                draggable="false"
                className="minus"
                alt="minus"
              ></img>
            </button>
            <img
              src={item.image}
              draggable="false"
              className="radio-img"
              alt="radio"
            ></img>
            <button
              className="volume-button"
              onClick={() => this.switchRadioStation(i, "plus")}
            >
              <img
                src={plus}
                draggable="false"
                className="plus"
                alt="plus"
              ></img>
            </button>
          </div>
        ) : null}
        <button onClick={() => this.showControls(i)}>
          <p className="radio-name">{item.name}</p>
          <p className="radio-freq">{item.frequency}</p>
          <div className="clear"></div>
          {i < this.state.radiolist.length - 1 ? <hr></hr> : null}
        </button>
      </div>
    ));

    // create object on bottom of player with currently playing radio station
    const playing = (
      <div className="Current-Content">
        <p className="current-text">CURRENTLY PLAYING</p>
        <p>{this.state.currentlyPlaying}</p>
      </div>
    );

    return (
      <div className="Radio-Container">
        <div className="Top-Bar">
          <button className="arrow-button" onClick={() => this.hidePlayer()}>
            <img src={arrowLeft} className="arrow-left" alt="arrow"></img>
          </button>
          <p>STATIONS</p>
          <button className="power-button" onClick={() => this.powerOff()}>
            <img src={power} alt="power"></img>
          </button>
        </div>
        {this.state.hidePlayer ? (
          <div className="Radio-List">{radios}</div>
        ) : null}
        <div className="Currently-Playing">
          <hr></hr>
          {this.state.currentlyPlaying !== "" ? playing : null}
        </div>
      </div>
    );
  }
}

export default RadioStations;
