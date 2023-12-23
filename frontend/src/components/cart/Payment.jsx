import React, {
	useEffect,
	useRef
} from 'react';
import {
	useStripe,
	useElements,
	CardNumberElement,
	CardExpiryElement,
	CardCvcElement
} from '@stripe/react-stripe-js';
import {createOrder, clearErrors} from '../../actions/orderActions';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import Toast from '../Toast';
import MetaData from '../layout/MetaData';
import CheckoutSteps from './CheckoutSteps';
const options = {
	style: {
		base: {fontSize: '16px'},
		invalid: {color: '#9e2146'}
	}
}

const Payment = ()=>{
	const toastRef = useRef();
	const navigate = useNavigate();
	const stripe = useStripe();
	const elements = useElements();
	const dispatch = useDispatch();
	const {user} = useSelector(state=>state.auth);
	const {cartItems, shippingInfo} = useSelector(state=>state.cart);
	const { error } = useSelector(state => state.newOrder || {});
	useEffect(()=>{
		if(error){
			toastRef.current.setMessage(error);
			dispatch(clearErrors());
		}
	}, [dispatch, error]);
	const order = {
		orderItems: cartItems,
		shippingInfo
	}
	const orderInfo = JSON.parse(sessionStorage.getItem('orderInfo'));
	if(orderInfo){
		order.itemsPrice = orderInfo.itemsPrice
		order.shippingPrice = orderInfo.shippingPrice
		order.taxPrice = orderInfo.taxPrice
		order.totalPrice = orderInfo.totalPrice
	}
	const paymentData = {
		amount: Math.round(orderInfo.totalPrice * 100)
	};

	const submitHandler = async (e)=>{
		e.preventDefault();
		document.querySelector('#pay_btn').disabled = true;
		let res;

		try{
			const config = {
				headers: {
					'Content-Type': 'application/json'
				}
			}
			res = await axios.post('/api/v1/payment/process', paymentData, config);

			const clientSecret = res.data.client_secret;

			if(!stripe || !elements){
				return;
			}

			const result = await stripe.confirmCardPayment(clientSecret, {
				payment_method:{
					card: elements.getElement(CardNumberElement),
					billing_details: {
						name: user.name,
						email: user.email
					}
				}
			});

			if(result.error){
				toastRef.current.setMessage(result.error.message);
				document.querySelector('#pay_btn').disabled = false;
			} else{
				// The payment is process or not
				if(result.paymentIntent.status === 'succeeded'){

					order.paymentInfo = {
						id: result.paymentIntent.id,
						status: result.paymentIntent.status
					}
					dispatch(createOrder(order));
					navigate('/success');
				} else{
					toastRef.current.setMessage('There is some issue while processing payment');
				}
			}

		} catch(error){
			document.querySelector('#pay_btn').disabled = false;
			toastRef.current.setMessage(error.response.data.message);
		}
	}
	return(
		<div className="container container-fluid">
			<Toast ref={toastRef}/>
			<MetaData title="Payment"/>
			<CheckoutSteps shipping confirmOrder payment/>
			<div className="row wrapper">
			    <div className="col-10 col-lg-5">
			        <form className="shadow-lg" onSubmit={submitHandler}>
			            <h1 className="mb-4">Card Info</h1>
			            <div className="form-group">
			                <label htmlFor="card_num_field">Card Number</label>
			                <CardNumberElement
			                    type="text"
			                    id="card_num_field"
			                    className="form-control"
			                    options={options}
			                    />
			            </div>
			            <div className="form-group">
			                <label htmlFor="card_exp_field">Card Expiry</label>
			                <CardExpiryElement
			                    type="text"
			                    id="card_exp_field"
			                    className="form-control"
			                    options={options}
			                    />
			            </div>
			            <div className="form-group">
			                <label htmlFor="card_cvc_field">Card CVC</label>
			                <CardCvcElement
			                    type="text"
			                    id="card_cvc_field"
			                    className="form-control"
			                    options={options}
			                    />
			            </div>
			            <button
			                id="pay_btn"
			                type="submit"
			                className="btn btn-block py-3"
		                >
			            	Pay {` - ${orderInfo && orderInfo.totalPrice}`}
			            </button>
			        </form>
			    </div>
			</div>
		</div>
	);
}

export default Payment;


// NOTE: Card number valid for testing : 4000 0027 6000 3184