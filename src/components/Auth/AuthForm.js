import { useState, useRef, useContext  } from 'react';
import AuthContext from '../../store/auth-context'
import classes from './AuthForm.module.css';

const AuthForm = () => {
  const emailInputRef = useRef()
  const passwordInputRef = useRef()

  const [isLogin, setIsLogin] = useState(true);
  const [errMsg, setErrMsg] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const fetchAuthContext = useContext(AuthContext)

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  const submitHandler = (e) => {
    e.preventDefault()

    const enteredEmail = emailInputRef.current.value
    const enteredPassword = passwordInputRef.current.value

    setIsLoading(true)
    let url;
    if (isLogin) {
        url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key='
    } else {
      url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key='
    }

    fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        email: enteredEmail,
        password: enteredPassword,
        returnSecureToken: true
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        setIsLoading(false)
        if (res.ok) {
          console.log('res.ok', res)
          return res.json()
        } else {
          return res.json().then(data => {
            setErrMsg(data.error.message)
            console.log(data)
            throw new Error(errMsg)
          })
        }
      }).then(data => {
        fetchAuthContext.login(data.idToken)
      }).catch(err => alert(err.message) )

  }

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor='email'>Your Email</label>
          <input type='email' id='email' required ref={emailInputRef} />
        </div>
        <div className={classes.control}>
          <label htmlFor='password'>Your Password</label>
          <input type='password' id='password' required ref={passwordInputRef} />
          {errMsg && <p>{errMsg}</p>}
        </div>
        <div className={classes.actions}>
          {!isLoading && <button>{isLogin ? 'Login' : 'Create Account'}</button>}
          {isLoading && <p>Loading...</p>}
          <button
            type='button'
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? 'Create new account' : 'Login with existing account'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;
