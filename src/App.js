import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail, updateProfile } from "firebase/auth";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Col, Container, Form, Row, Button, Stack } from 'react-bootstrap';
import './App.css';
import initializeAuthentication from './Firebase/firebase.initialize';
import { useState } from "react";

// Authentication Call
initializeAuthentication();


function App() {

  // useState
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState('');
  const [error, setError] = useState(false);

  const auth = getAuth();

  const handleUserName = e => {
    setName(e.target.value);
  }

  const handleUserEmail = e => {
    setEmail(e.target.value);
  }

  const handleUserPassword = e => {
    setPassword(e.target.value);
  }

  const toggleLogin = e => {
    setIsLogin(e.target.checked);
  }

  const handleUser = e => {
    e.preventDefault();
    console.log(email, password);

    if (password.length < 6) {
      setError('Password should be at least 6 characters ')
      return;
    }
    // else if (!/(?=.*[A-Z].*[A-Z])/.test(password)) {
    //   setError('Password should be at least 2 uppercase')
    //   return;
    // }
    else if (!/(?=.*[!@#$%^&*])/.test(password)) {
      setError('Password should be at least 1 special character')
      return;
    }

    isLogin ? loginUser(email, password) : registerUser(email, password);
  }

  const registerUser = (email, password) => {
    createUserWithEmailAndPassword(auth, email, password)
      .then(result => {
        const user = result.user;
        console.log(user);
        setUserName();
        setError('');
        userEmailVerifying();
      })
      .catch(error => {
        setError(error.message);
      })
  }

  const setUserName = () => {
    updateProfile(auth.currentUser, { displayName: name })
      .then(result => { })
  }

  const userEmailVerifying = () => {
    sendEmailVerification(auth.currentUser)
      .then(result => {
        const verifyUser = result.user;
        console.log(verifyUser);
      })
  }

  const loginUser = (email, password) => {
    signInWithEmailAndPassword(auth, email, password)
      .then(result => {
        const user = result.user;
        console.log(user);
        setError('');
      })
      .catch(error => {
        setError(error.message);
      })
  }

  const handleForgetPassword = () => {
    sendPasswordResetEmail(auth, email)
      .then(result => { })
      .catch(error => {
        setError(error.message);
      })
  }

  return (
    <>
      <Container className="pt-5 form-container">
        <Row>
          <h1 className="text-center fw-bold heading">Travel Agency</h1>
          <hr />
          <Col>
            <h2 className="text-center text-primary mb-3 form-heading">Please {isLogin ? 'Log in' : 'Register'}</h2>
            <Form onSubmit={handleUser}>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                {!isLogin &&
                  <div>
                    <Form.Label>
                      <Stack direction="horizontal">
                        <img src="https://img.icons8.com/color/48/000000/name--v2.png" alt="..." />
                        <span className="text-center fw-bold">Name :</span>
                      </Stack>
                    </Form.Label>
                    <Form.Control onBlur={handleUserName} className="border-0 rounded-pill field" type="name" placeholder="Enter name" required />
                  </div>
                }
                <Form.Label>
                  <Stack direction="horizontal">
                    <img src="https://img.icons8.com/color/48/000000/email.png" alt="..." />
                    <span className="text-center fw-bold">Email Address :</span>
                  </Stack>
                </Form.Label>
                <Form.Control onBlur={handleUserEmail} className="border-0 rounded-pill field" type="email" placeholder="Enter email" required />
                <Form.Text className="text-muted">
                  We'll never share your email with anyone else.
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>
                  <Stack direction="horizontal">
                    <img src="https://img.icons8.com/color/48/000000/password.png" alt=".." />
                    <span className="text-center fw-bold">Password :</span>
                  </Stack>
                </Form.Label>
                <Form.Control onBlur={handleUserPassword} className="border-0 rounded-pill field" type="password" placeholder="Password" required />
                <Form.Text className="text-muted">
                  The password must be more than six characters long and have a special character.
                </Form.Text>
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicCheckbox">
                <Form.Check onChange={toggleLogin} type="checkbox" label="Already Registered?" />
              </Form.Group>
              <div className="text-danger fw-bold mb-3">
                {error}
              </div>
              {
                isLogin ?
                  <Button variant="outline-success" type="submit" value="submit">
                    <img src="https://img.icons8.com/color/48/000000/login-rounded-right.png" className="icons" alt="..." />
                    Log In
                  </Button>
                  :
                  <Button variant="outline-warning" type="submit" value="submit">
                    <img src="https://img.icons8.com/color/48/000000/registered-trademark.png" className="icons" alt="..." />
                    Register
                  </Button>
              }
              <Button onClick={handleForgetPassword} variant="outline-secondary" className="mx-2">
                <img src="https://img.icons8.com/plumpy/48/000000/re-enter-pincode.png" className="icons" alt=".." />Forget Password
              </Button>
              <br />
              <br />
            </Form>
          </Col>
          <Col>
            <img src="./auth.jpg" className="poster" alt="" />
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default App;