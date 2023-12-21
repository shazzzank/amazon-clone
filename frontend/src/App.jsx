import {useEffect, useState} from 'react';
import {
   BrowserRouter as
   Router,
   Route,
   Routes
} from 'react-router-dom';
import {useSelector} from 'react-redux';
import axios from 'axios';
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
//Other
import './App.css';
import store from './store';
import {loadUser} from './actions/userActions';
import ProtectedRoute from './routes/ProtectedRoute';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './components/Home';
import ProductDetails from './components/product/ProductDetails';
//Cart
import Cart from './components/cart/Cart';
import Shipping from './components/cart/Shipping';
import ConfirmOrder from './components/cart/ConfirmOrder';
import Payment from './components/cart/Payment';
import OrderSuccess from './components/cart/OrderSuccess';
//Order
import ListOrders from './components/order/ListOrders';
import OrderDetails from './components/order/OrderDetails';
//Auth or User
import Login from './components/user/Login';
import Register from './components/user/Register';
import Profile from './components/user/Profile';
import UpdateProfile from './components/user/UpdateProfile';
import UpdatePassword from './components/user/UpdatePassword';
import ForgotPassword from './components/user/ForgotPassword';
import NewPassword from './components/user/NewPassword';
//Admin
import Dashboard from './components/admin/Dashboard';
import ProductsList from './components/admin/ProductsList';
import NewProduct from './components/admin/NewProduct';
import UpdateProduct from './components/admin/UpdateProduct';
import OrdersList from './components/admin/OrdersList';
import ProcessOrder from './components/admin/ProcessOrder';
import UsersList from './components/admin/UsersList';
import UpdateUser from './components/admin/UpdateUser';
import ProductReviews from './components/admin/ProductReviews';

function App() {
   const [stripeApiKey, setStripeApiKey] = useState('');

   useEffect(()=>{
      store.dispatch(loadUser());
      async function getStripeApiKey(){
         try {
            const {data} = await axios.get('/api/v1/stripeapi');
            setStripeApiKey(data.stripeApiKey);
         }
         catch(error){
             console.error('Error fetching Stripe API key:', error);
         }
      }
      getStripeApiKey();
   }, []);

   const {
      isAuthenticated,
      user, 
      loading
   } = useSelector(state=>state.auth);

   return (
      <Router>
         <div className="App">
            <Header/>
            <Routes>
               <Route 
                  path='/'
                  element={<Home/>}
               />
               <Route 
                  path='/product/:id'
                  element={<ProductDetails/>}
               />
               <Route 
                  path='/cart'
                  element={<Cart/>}
               />
               <Route 
                  path='/shipping'
                  element={
                     <ProtectedRoute element={<Shipping/>}/>
                  }
               />
               <Route 
                  path='/order/confirm'
                  element={
                     <ProtectedRoute element={<ConfirmOrder/>}/>
                  }
               />
               <Route 
                  path='/success'
                  element={
                     <ProtectedRoute element={<OrderSuccess/>}/>
                  }
               />
               {stripeApiKey && 
                  <Route
                     path="/payment"
                     element={
                        <Elements stripe={loadStripe(stripeApiKey)}>
                           <ProtectedRoute element={<Payment />} />
                        </Elements>
                     }
                  />
               }
               <Route 
                  path='/search/:keyword'
                  element={<Home/>}
               />
               <Route 
                  path='/login/:redirect?'
                  element={<Login/>}
               />
               <Route 
                  path='/register'
                  element={<Register/>}
               />
               <Route 
                  path='/me'
                  element={
                     <ProtectedRoute element={<Profile/>}/>
                  }
               />
               <Route 
                  path='/me/update'
                  element={
                     <ProtectedRoute element={<UpdateProfile/>}/>
                  }
               />
               <Route 
                  path='/password/update'
                  element={
                     <ProtectedRoute element={<UpdatePassword/>}/>
                  }
               />
               <Route 
                  path='/orders/me'
                  element={
                     <ProtectedRoute element={<ListOrders/>}/>
                  }
               />
               <Route 
                  path='/order/:id'
                  element={
                     <ProtectedRoute element={<OrderDetails/>}/>
                  }
               />
               <Route 
                  path='/dashboard'
                  element={
                     <ProtectedRoute 
                        element={<Dashboard/>}
                        isAdmin={true}
                     />
                  }
               />
               <Route 
                  path='/admin/products'
                  element={
                     <ProtectedRoute 
                        element={<ProductsList/>}
                        isAdmin={true}
                     />
                  }
               />
               <Route 
                  path='/admin/product'
                  element={
                     <ProtectedRoute 
                        element={<NewProduct/>}
                        isAdmin={true}
                     />
                  }
               />
               <Route 
                  path='/admin/product/:id'
                  element={
                     <ProtectedRoute 
                        element={<UpdateProduct/>}
                        isAdmin={true}
                     />
                  }
               />
               <Route 
                  path='/admin/orders'
                  element={
                     <ProtectedRoute 
                        element={<OrdersList/>}
                        isAdmin={true}
                     />
                  }
               />
               <Route 
                  path='/admin/order/:id'
                  element={
                     <ProtectedRoute 
                        element={<ProcessOrder/>}
                        isAdmin={true}
                     />
                  }
               />
               <Route 
                  path='/admin/users'
                  element={
                     <ProtectedRoute 
                        element={<UsersList/>}
                        isAdmin={true}
                     />
                  }
               />
               <Route 
                  path='/admin/user/:id'
                  element={
                     <ProtectedRoute 
                        element={<UpdateUser/>}
                        isAdmin={true}
                     />
                  }
               />
               <Route 
                  path='/admin/reviews'
                  element={
                     <ProtectedRoute 
                        element={<ProductReviews/>}
                        isAdmin={true}
                     />
                  }
               />
               <Route 
                  path='/password/forgot'
                  element={<ForgotPassword/>}
               />
               <Route 
                  path='/password/reset/:token'
                  element={<NewPassword/>}
               />
            </Routes>
            {!loading && (!isAuthenticated || user && user.role !== 'admin') &&
               <Footer/>
            }
         </div>
      </Router>
   );
}

export default App;
