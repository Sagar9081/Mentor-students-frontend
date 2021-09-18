import React from "react";
import axios from "axios";

import { Table, Button, Form, Row, Col } from "react-bootstrap";
import { RiDeleteBin6Fill, RiEdit2Line } from "react-icons/ri";

const API_URL = "https://mentor-students-data.herokuapp.com/students-data";

class PostApp extends React.Component {
  constructor() {
    super();
    this.state = {
      posts: [],

      _id: "",
      id: "",
      Mentor_Name: "",
      Students: "",
    };
  }

  componentDidMount = () => {
    this.getPosts();
  };

  getPosts = async () => {
    // API Call to server and get all posts
    try {
      const { data } = await axios.get(API_URL);
      this.setState({ posts: data });
      // console.log(this.state.posts);
    } catch (err) {
      console.error(err);
    }
  };

  createPost = async () => {
    // API Call to server and add new post
    try {
      const { Mentor_Name, Students } = this.state;
      const { data } = await axios.post(API_URL, {
        Mentor_Name,
        Students,
      });
      const posts = [...this.state.posts];
      posts.push(data);
      this.setState({
        posts: [...posts],
        _id: "",
        Mentor_Name: "",
        Students: "",
        id: Math.floor(Math.random * 100),
      });
      //this.setState([...posts, { Mentor_Name, Students }]);
      // this.setState({
      //  posts: [...posts, Mentor_Name, Students],
      // });
      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  };

  updatePost = async () => {
    // API Call to server and update an existing post
    try {
      const { _id, Mentor_Name, Students, posts } = this.state;
      const { data } = await axios.put(`${API_URL}/${_id}`, {
        Mentor_Name,
        Students,
      });
      const index = posts.findIndex((post) => post._id === _id);
      posts[index] = data;

      this.setState({ posts, _id: "", Mentor_Name: "", Students: "" });
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  deletePost = async (postId) => {
    // API Call to server and delete post
    try {
      await axios.delete(`${API_URL}/${postId}`);

      let posts = [...this.state.posts];
      posts = posts.filter(({ _id }) => _id !== postId);

      this.setState({ posts });
    } catch (err) {
      console.error(err);
    }
  };

  selectPost = (post) => this.setState({ ...post });

  handleChange = ({ target: { name, value } }) => {
    this.setState({ [name]: value });
  };

  handleSubmit = (e) => {
    e.preventDefault();

    console.log("Submitted...");
    if (this.state._id) {
      this.updatePost();
    } else {
      this.createPost();
    }
  };

  render() {
    return (
      <>
        <div className="container">
          <h1> Mentors And Students Assigning UI</h1>
          <hr />
          <Form onSubmit={this.handleSubmit}>
            <Form.Group as={Row} className="mb-3" controlId="formHorizontal">
              <Form.Label column sm={2}>
                Mentor-Name :
              </Form.Label>
              <Col sm={5}>
                <Form.Control
                  type="text"
                  name="Mentor_Name"
                  value={this.state.Mentor_Name}
                  onChange={this.handleChange}
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3" controlId="formHorizontal">
              <Form.Label column sm={2}>
                Students :
              </Form.Label>
              <Col sm={5}>
                <Form.Control
                  type="text"
                  name="Students"
                  value={this.state.Students}
                  onChange={this.handleChange}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3">
              <Col sm={{ span: 10, offset: 2 }}>
                <Button onClick={this.handleSubmit}>Submit</Button>
              </Col>
            </Form.Group>
          </Form>
          <Table className="datatable" striped bordered hover>
            <thead>
              <tr>
                <th>Id</th>
                <th>Mentor Name</th>
                <th>Students</th>

                <th colSpan="2">Action</th>
              </tr>
            </thead>
            <tbody>
              {this.state.posts.map((post) => {
                return (
                  <tr key={post.id}>
                    <td>{post._id}</td>
                    <td>{post.Mentor_Name}</td>
                    <td>{post.Students}</td>

                    <td>
                      <button
                        className="editbtn"
                        onClick={() => this.selectPost(post)}
                      >
                        <RiEdit2Line />
                      </button>
                    </td>
                    <td>
                      <button
                        className="deletebtn"
                        onClick={() => this.deletePost(post._id)}
                      >
                        <RiDeleteBin6Fill />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
      </>
    );
  }
}

export default PostApp;
