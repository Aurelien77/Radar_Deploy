import React, { Component } from "react";
import ReactPlayer from "react-player";


class Video extends Component {
  render() {
    return (
      <div className="videoplayer">
        <ReactPlayer
          width="45vw"
          height="100%"
          muted
          url={this.props.url} 
          controls
          autoPlay={false}
         loop
        />
      </div>
    );
  }
}

export default Video;
