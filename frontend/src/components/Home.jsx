import React, {Fragment, useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useParams} from 'react-router-dom';
import Pagination from 'react-js-pagination';
import Toast from './Toast';
import Loader from './layout/Loader';
import MetaData from './layout/MetaData';
import Product from './product/Product';
import {getProducts} from '../actions/productActions';
import {RangeSlider} from 'rsuite';

const Home = ()=>{
	const toastRef = useRef();
	const dispatch = useDispatch();
	const {keyword} = useParams();
	const [currentPage, setCurrentPage] = useState(1);
	const [price, setPrice] = useState([0, 2000]);
	const [category, setCategory] = useState('');
	const [rating, setRating] = useState(0);
	const categories = [
		'Electronics',
		'Cameras',
		'Laptop',
		'Accessories',
		'Headphones',
		'Food',
		'Books',
		'Clothes/Shoes',
		'Beauty/Health',
		'Sports',
		'Outdoor',
		'Home'
	];
	const {
		error,
		filteredProductsCount,
		loading,
		resultPerPage,
		products,
		productsCount
	} = useSelector(state=>state.products);
	const count = keyword ? filteredProductsCount : productsCount;

	useEffect(()=>{
		if(error){
			return toastRef.current.setMessage(error);
		}
		setTimeout(()=>{
			dispatch(getProducts(currentPage, keyword, price, category, rating));
		}, 500);
	}, [dispatch, error, currentPage, keyword, price, category, rating]);

	return(
		<div className="container container-fluid">
			<Toast ref={toastRef}/>
			{loading ? <Loader/> : (
				<Fragment>
					<MetaData title="Sale sale sale! Welcome to Ecommerce store"/>
					<h1 id="product_heading" className="mt-5">Latest Product</h1>
					<section id="products" className="container mt-5">
					    <div className="row">
						    {keyword ?
					    		<Fragment>
					    			<div className="col-6 col-md-3 mt-5 mb-5">
					    				<div className="px-5">
					    					<RangeSlider
												value={price}
												max={2000}
												min={1}
												onChange={setPrice}
											/>
											<hr className="my-5"/>
											<div className="mt-5">
												<h4 className="mb-3">
													Categories
												</h4>
												<ul className="pl-0">
													{categories && categories.map(category=>
														<li key={category}
															style={{cursor: 'pointer',
															listStyleType: 'none'}}
															onClick={()=>setCategory(category)}>
															{category}
														</li>
													)}
												</ul>
											</div>
											<hr className="my-3"/>
											<div className="mt-5">
												<h4 className="mb-3">
													Ratings
												</h4>
												<ul className="pl-0">
													{[5, 4, 3, 2, 1].map(star=>
														<li key={star}
															style={{cursor: 'pointer',
															listStyleType: 'none'}}
															onClick={()=>setRating(star)}>
															<div className="rating-outer">
																<div className="rating-inner" style={{width: `${star * 20}%`}}>
																</div>
															</div>
														</li>
													)}
												</ul>
											</div>
					    				</div>
					    			</div>
					    			<div className="col-6 col-md-9">
					    				<div className="row">
					    					{products && products.map(product=>
									        	<Product 
									        		key={product._id}
									        		product={product}
									        		col="4"
								        		/>
									        )}
					    				</div>
					    			</div>
					    		</Fragment> :
					    		products && products.map(product=>
						        	<Product 
						        		key={product._id}
					        			product={product}
					        			col="3"
				        			/>
		        			)}
					    </div>
					</section>
					{resultPerPage <= count && (
						<div className="d-flex justify-content-center mt-5">
							<Pagination
								activePage={currentPage}
								itemsCountPerPage={resultPerPage}
								totalItemsCount={count}
								onChange={page=>setCurrentPage(page)}
								nextPageText="Next"
								prevPageText="Prev"
								firstPageText="First"
								lastPageText="Last"
								itemClass="page-item"
								linkClass="page-link"
							/>
						</div>
					)}
				</Fragment>
			)}
		</div>
	);
}

export default Home;