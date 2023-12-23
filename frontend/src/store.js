import {
	createStore,
	combineReducers,
	applyMiddleware
} from 'redux';
import {composeWithDevTools} from 'redux-devtools-extension';
import {
	newReviewReducer,
	newProductReducer,
	productReducer, 
	productsReducer, 
	productReviewsReducer, 
	productDetailsReducer,
	reviewReducer
} from './reducers/productReducers';
import {
	allUsersReducer,
	authReducer,
	forgotPasswordReducer,
	userDetailsReducer,
	userReducer
} from './reducers/userReducers';
import {cartReducer} from './reducers/cartReducers';
import {
	newOrderReducer,
	myOrderReducer,
	orderReducer,
	orderDetailsReducer,
	allOrdersReducer,
} from './reducers/orderReducers';
import thunk from 'redux-thunk';

const reducer = combineReducers({
	auth: authReducer,
	allOrders: allOrdersReducer,
	allUsers: allUsersReducer,
	cart: cartReducer,
	forgotPassword: forgotPasswordReducer,
	myOrders: myOrderReducer,
	newReview: newReviewReducer,
	newProduct: newProductReducer,
	newOrder: newOrderReducer,
	order: orderReducer,
	orderDetails: orderDetailsReducer,
	product: productReducer,
	products: productsReducer,
	productDetails: productDetailsReducer,
	productReviews: productReviewsReducer,
	review: reviewReducer,
	user: userReducer,
	userDetails: userDetailsReducer
});

let initialState = {
	cart: {
		cartItems: localStorage.getItem('cartItems') ?
			JSON.parse(localStorage.getItem('cartItems')) : [],
		shippingInfo: localStorage.getItem('shippingInfo') ?
			JSON.parse(localStorage.getItem('shippingInfo')) : [],
	},
	user: {}
};
const middleware = [thunk];
const store = createStore(
	reducer,
	initialState,
	composeWithDevTools(applyMiddleware(...middleware))
);

export default store;