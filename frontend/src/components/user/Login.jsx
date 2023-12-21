import React, {Fragment, useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Link, useLocation} from 'react-router-dom';
import {login, clearErrors} from '../../actions/userActions';
import Toast from '../Toast';
import Loader from '../layout/Loader';
import MetaData from '../layout/MetaData';

const Login = ()=>{
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const {
		isAuthenticated,
		error,
		loading
	} = useSelector(state=>state.auth);
	const toastRef = useRef();
	const dispatch = useDispatch();
	const location = useLocation();
	const queryParams = new URLSearchParams(location.search);
	const redirect = queryParams.get('redirect');
	const goTo = redirect === 'shipping' ? '/shipping' : '/';

	useEffect(()=>{
		if(isAuthenticated){
			toastRef.current.setMessage('Login successful');
		}
		if(error){
			toastRef.current.setMessage(error);
			dispatch(clearErrors());
		}
	}, [dispatch, isAuthenticated, error]);
	const submitHandler = (e)=>{
		e.preventDefault();
		dispatch(login(email, password));
	}
	return(
		<div className="container container-fluid">
			{loading ? 
				<Loader/> : 
				<Fragment>
					<MetaData title="Login"/>
					<Toast ref={toastRef} redirect={goTo}/>
					<div className="row wrapper">
					    <div className="col-10 col-lg-5">
					        <form className="shadow-lg" onSubmit={submitHandler}>
					            <h1 className="mb-3">Login</h1>
					            <div className="form-group">
					                <label htmlFor="email_field">Email</label>
					                <input
					                    type="email"
					                    id="email_field"
					                    className="form-control"
					                    value={email}
					                    onChange={e=>setEmail(e.target.value)}
					                    />
					            </div>
					            <div className="form-group">
					                <label htmlFor="password_field">Password</label>
					                <input
					                    type="password"
					                    id="password_field"
					                    className="form-control"
					                    value={password}
					                    onChange={e=>setPassword(e.target.value)}
					                    />
					            </div>
					            <Link to="/password/forgot" className="float-right mb-4">Forgot Password?</Link>
					            <button
					                id="login_button"
					                type="submit"
					                className="btn btn-block py-3"
					                >
					            LOGIN
					            </button>
					            <Link to="/register" className="float-right mt-3">New User?</Link>
					        </form>
					    </div>
					</div>
				</Fragment>
			}
		</div>
	);
}

export default Login;