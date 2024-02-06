/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-unused-vars */
/* eslint-disable react/self-closing-comp */
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { Grid, Typography, Card, CardContent, Box } from '@mui/material';
import FeatherIcon from 'feather-icons-react';

import { fetchConToken } from '../../../helpers/fetch';

import 'moment/locale/es';
import DynamicTable from '../../../components/dynamic-table/DynamicTable';

// import headerImg from '../../../assets/images/project/header.jpg';
import plan1 from '../../../assets/images/project/plan-1.jpg';
import plan2 from '../../../assets/images/project/plan-2.jpg';
import plan3 from '../../../assets/images/project/plan-3.jpg';
import lounge1 from '../../../assets/images/project/lounge-1.jpg';
import lounge2 from '../../../assets/images/project/lounge-2.jpg';

import Swal from 'sweetalert2';

import './landing-page.css';

const columns = [
    { id: "img", label: "Product Image" },
    { id: "name", label: "Name" },
    { id: "price", label: "Price" },
    { id: "stock", label: "Stock" },
    { id: "marketplace", label: "Marketplace" },
    { id: "nsn", label: "Nsn" },
    { id: "partNumber", label: "Part Number" },
    { id: "itemNumber", label: "Item Number" },
];

function LandingPage() {

    const { token } = useSelector( state => state.auth) || {};

    const [charging, setCharging] = useState(true);
    const [products, setProducts] = useState([]);
  
    const [actualPage, setActualPage] = useState(1);
    const [pageCount, setPageCount] = useState(1);
    const [total, setTotal] = useState(0);
    const [tempTotal, setTempTotal] = useState(0);
    const withoutImage = 'https://res.cloudinary.com/dsteu2frb/image/upload/v1706025798/samples/ecommerce/engine-153649_1280_nmko40.webp';

    const mapProducts = (data) => {
        const result = data.map((item) => ({
            ...item,
            img: ( <img src={item?.img ? item?.img : withoutImage} alt="img" width={100} height={100} className='product-image' /> ),
        }));
        setProducts(result);
    }

    const getProducts = async( page = 1 ) => {

        try {

            setCharging(true);
            const resp = await fetchConToken( `product?page=${page}`, token );

            if( resp?.success ){
                mapProducts(resp.data?.products);
                setTotal(resp.data?.dataCount);
                setTempTotal(resp.data?.dataCount);
                setPageCount(Math.ceil(resp.data?.dataCount / 20));
            }

            setCharging(false);
            
        } catch (error) {
            Swal.fire('Error', 'Error al cargar datos, por favor intente nuevamente.', 'error' );
        }

    }

    const handlePageClick = (event, value) => {
        setActualPage(value);
        getProducts(value);
    };

    useEffect(() => {
        getProducts(actualPage);
    }, []);

    return (
        <>
            <nav>
                <div className="nav__logo">Flivan</div>
                <ul className="nav__links">
                    <li className="link"><a href="#">Home</a></li>
                    <li className="link"><a href="#">About</a></li>
                    <li className="link"><a href="#">Offers</a></li>
                    <li className="link"><a href="#">Seats</a></li>
                    <li className="link"><a href="#">Destinations</a></li>
                </ul>
                <button className="btn">Contact</button>
            </nav>

            {/* <header className="section__container header__container">
                <h1 className="section__header">Find And Book<br />A Great Experience</h1>
                <img src={headerImg} className="header-image" alt="header" />
            </header> */}

            <section className="section__container plan__container">
                <p className="subheader">TRAVEL SUPPORT</p>
                <h2 className="section__header">Plan your travel with confidence</h2>
                <p className="description">
                    Find help with your bookings and travel plans, and seee what to expect
                    along your journey.
                </p>
                <div className="plan__grid">
                    <div className="plan__content">
                    <span className="number">01</span>
                    <h4>Travel Requirements for Dubai</h4>
                    <p>
                        Stay informed and prepared for your trip to Dubai with essential
                        travel requirements, ensuring a smooth and hassle-free experience in
                        this vibrant and captivating city.
                    </p>
                    <span className="number">02</span>
                    <h4>Multi-risk travel insurance</h4>
                    <p>
                        Comprehensive protection for your peace of mind, covering a range of
                        potential travel risks and unexpected situations.
                    </p>
                    <span className="number">03</span>
                    <h4>Travel Requirements by destinations</h4>
                    <p>
                        Stay informed and plan your trip with ease, as we provide up-to-date
                        information on travel requirements specific to your desired
                        destinations.
                    </p>
                    </div>
                    <div className="plan__image">
                    <img src={plan1} alt="plan" />
                    <img src={plan2} alt="plan" />
                    <img src={plan3} alt="plan" />
                    </div>
                </div>
            </section>

            <section className="memories">
                <div className="section__container memories__container">
                    <div className="memories__header">
                    <h2 className="section__header">
                        Travel to make memories all around the world
                    </h2>
                    <button className="view__all">View All</button>
                    </div>
                    <div className="memories__grid">
                    <div className="memories__card">
                        <span>
                            <FeatherIcon
                                icon="calendar"
                                size="50"
                            />
                        </span>
                        <h4>Book & relax</h4>
                        <p>
                        With "Book and Relax," you can sit back, unwind, and enjoy the
                        journey while we take care of everything else.
                        </p>
                    </div>
                    <div className="memories__card">
                        <span>
                            <FeatherIcon
                                icon="check"
                                size="50"
                            />
                        </span>
                        <h4>Smart Checklist</h4>
                        <p>
                        Introducing Smart Checklist with us, the innovative solution
                        revolutionizing the way you travel with our airline.
                        </p>
                    </div>
                    <div className="memories__card">
                        <span>
                            <FeatherIcon
                                icon="pocket"
                                size="50"
                            />
                        </span>
                        <h4>Save More</h4>
                        <p>
                        From discounted ticket prices to exclusive promotions and deals,
                        we prioritize affordability without compromising on quality.
                        </p>
                    </div>
                    </div>
                </div>
            </section>

            <Grid container spacing={0} sx={{ padding: '100px' }}>
                <Box sx={{ marginBottom: '50px', textAlign: 'center' }}>
                    <Typography sx={{ fontSize: '40px', fontWeight: '600' }}>Total items: {total}</Typography>
                </Box>
                <Box>
                    <Card variant="outlined">
                        <CardContent>
                            <Typography variant="h3">Products</Typography>
                            <Box
                                sx={{
                                    overflow: {
                                        xs: "auto",
                                        sm: "unset",
                                    },
                                }}
                            >
                                <DynamicTable
                                    columns={columns}
                                    currentData={products}
                                    isLoading={charging}
                                    actualPage={actualPage}
                                    handlePageClick={handlePageClick}
                                    totalPages={pageCount}
                                />
                            </Box>
                        </CardContent>
                    </Card>
                </Box>
            </Grid>

            <section className="loungee">

                <div className="section__container lounge__container">
                    
                    <div className="lounge__image">
                        <img src={lounge1} alt="lounge" />
                        <img src={lounge2} alt="lounge" />
                    </div>

                    <div className="lounge__content">
                        <h2 className="section__header">Unaccompanied Minor Lounge</h2>
                        <div className="lounge__grid">
                        <div className="lounge__details">
                            <h4>Experience Tranquility</h4>
                            <p>
                            Serenity Haven offers a tranquil escape, featuring comfortable
                            seating, calming ambiance, and attentive service.
                            </p>
                        </div>
                        <div className="lounge__details">
                            <h4>Elevate Your Experience</h4>
                            <p>
                            Designed for discerning travelers, this exclusive lounge offers
                            premium amenities, assistance, and private workspaces.
                            </p>
                        </div>
                        <div className="lounge__details">
                            <h4>A Welcoming Space</h4>
                            <p>
                            Creating a family-friendly atmosphere, The Family Zone is the
                            perfect haven for parents and children.
                            </p>
                        </div>
                        <div className="lounge__details">
                            <h4>A Culinary Delight</h4>
                            <p>
                            Immerse yourself in a world of flavors, offering international
                            cuisines, gourmet dishes, and carefully curated beverages.
                            </p>
                        </div>
                        </div>
                    </div>

                </div>

            </section>

            <footer className="footer">
                <div className="section__container footer__container">
                    <div className="footer__col">
                    <h3>Flivan</h3>
                    <p>
                        Where Excellence Takes Flight. With a strong commitment to customer
                        satisfaction and a passion for air travel, Flivan Airlines offers
                        exceptional service and seamless journeys.
                    </p>
                    <p>
                        From friendly smiles to state-of-the-art aircraft, we connect the
                        world, ensuring safe, comfortable, and unforgettable experiences.
                    </p>
                    </div>
                    <div className="footer__col">
                    <h4>INFORMATION</h4>
                    <p>Home</p>
                    <p>About</p>
                    <p>Offers</p>
                    <p>Seats</p>
                    <p>Destinations</p>
                    </div>
                    <div className="footer__col">
                    <h4>CONTACT</h4>
                    <p>Support</p>
                    <p>Media</p>
                    <p>Socials</p>
                    </div>
                </div>
                <div className="section__container footer__bar">
                    <p>Copyright © 2023 Web Design Mastery. All rights reserved.</p>
                    <div className="socials">
                    <span><i className="ri-facebook-fill"></i></span>
                    <span><i className="ri-twitter-fill"></i></span>
                    <span><i className="ri-instagram-line"></i></span>
                    <span><i className="ri-youtube-fill"></i></span>
                    </div>
                </div>
            </footer>
        </>
    )
}

export default LandingPage;