import React, { Component } from "react";
import Post from "./Post.jsx";
import NewPost from "./NewPost.jsx";
class Content extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: []
    };
  }
  reload = async () => {
    let response = await fetch("/all-posts");
    let body = await response.text();
    console.log("/all-posts response", body);
    body = JSON.parse(body);
    this.setState({ posts: body });
  };

  deleteAll = async () => {
    console.log("deleting my posts for ", this.props.myUsername);
    let data = new FormData();
    data.append("username", this.props.myUsername);
    console.log("here");
    await fetch("/delete-my-posts", {
      method: "POST",
      body: data
    });
    this.reload();
  };

  render = () => {
    return (
      <div>
        <button onClick={this.reload}> Load </button>
        <div>
          {this.state.posts.map(p => (
            <Post key={p._id} contents={p} myUsername={this.props.myUsername} />
          ))}
        </div>
        <NewPost myUsername={this.props.myUsername} />
        <button onClick={this.deleteAll}> Delete ALL my posts </button>
      </div>
    );
  };
}
export default Content;
