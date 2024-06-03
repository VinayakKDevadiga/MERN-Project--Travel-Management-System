import React, { useState, useEffect } from 'react';
import PackageCard from './PackageCard';
import './assets/packages.css';
import './assets/bookdialogue.css'
import { Link } from 'react-router-dom';
import Trcomponent from './trcomponent';
const usernameimage = require('./assets/IMAGES/image.png');

const PackagesComponent = ({ islogin, setlogin, istokenvalid, settokenvalid }) => {
    const [packages, setPackages] = useState([]);
    const [booked, setbooked] = useState(false)

    const fetchPackages = async () => {
        try {
            const response = await fetch('http://localhost:5002/api/travel/all/packages');
            if (response.ok) {
                const data = await response.json();
                setPackages(data);
            } else {
                console.error('Failed to fetch packages:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching packages:', error);
        }
    };
    useEffect(() => {
        fetchPackages();
    }, []);


    //for booking dialogue
    const [isOpen, setIsOpen] = useState(false);
    const toggleDialog = () => {
        setIsOpen(!isOpen);
        setbooked(false)
    };

    const [formDatabook, setFormDatabook] = useState({
        packageName: '',
        dateOfTrip: '',
        mobilenumber: ''

    });


    const handleChangebook = (e) => {
        const { name, value } = e.target;
        setFormDatabook({
            ...formDatabook,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            const accessToken = localStorage.getItem('accessToken');
            if (accessToken !== "") {
                // Make the fetch request with the access token and package name
                const response = await fetch(`http://localhost:5002/api/userbooking/book`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        formData: formDatabook
                        // Other booking details if needed
                    })
                });

                // Check if the response is successful (status code 200-299)
                if (response.ok) {
                    setlogin(true)

                    // for displaying updated package count after booking
                    fetchPackages()

                    // Handle the response data (if needed)
                    console.log('Booking successful:');

                    // Optionally, clear the form fields
                    setFormDatabook({
                        packageName: '',
                        dateOfTrip: '',
                        mobilenumber: ''
                    });

                    // display booked succcessfully
                    setbooked(true)

                } else {
                    setlogin(false)

                    // Handle error response
                    console.error('Booking failed:', response.statusText);
                    // return null; // Or throw an error
                }
            }
        } catch (error) {
            // Handle fetch error
            console.error('Fetch error:', error);
            // return null; // Or throw an error
        }


    };


    // for displaying your bookings
    const [bookingData, setBookingData] = useState([]);
    const [btnfetchbooking, setbtnfetchbooking] = useState(false)
    const togglefetchbooking = async () => {
        await setbtnfetchbooking(!btnfetchbooking)
    }

    const fetchyourbooking = async () => {
        await togglefetchbooking()
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken !== "") {
            try {
                // Make the fetch request with the access token and package name
                const response = await fetch('http://localhost:5002/api/userbooking/yourbookings', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    }
                });
                const data = await response.json();
                setBookingData(data); // Set the booking data after the response is received

            }
            catch (error) {
                // Handle fetch error
                console.error('Fetch error:', error);
                // return null; // Or throw an error
            }
        }
    }


    //for handling review

    const [reviewdata, setreviewdata] = useState({
        message: '',
    });
    const handlreviewchange = (e) => {
        const { name, value } = e.target;
        setreviewdata({
            ...reviewdata,
            [name]: value
        });
    };

    const handereviewsubmit = async (e) => {
        try {
            e.preventDefault();
            const accessToken = localStorage.getItem('accessToken');
            if (accessToken !== "") {
                const response = await fetch('http://localhost:5002/api/travel/Reviews', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        message: reviewdata.message // Assuming reviewdata contains the message field
                    })
                });

                if (response.ok) {
                    setlogin(true);
                    setreviewdata({ message: '' }); // Clear the form by resetting reviewdata
                } else {
                    setlogin(false);
                }
            }
        } catch (error) {
            console.error('Fetch error:', error);
        }
    };

    //for getting all reviews
    const [getreviewdata, segettreviewdata] = useState([]);
    const getallReviews = async () => {
        try {
            const response = await fetch('http://localhost:5002/api/travel/getallReviews', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            });

            if (response.ok) {
                const jsondata = await response.json();
                segettreviewdata(jsondata); // Assuming setgettreviewdata is a typo and should be setgetreviewdata
            } else {
                // Handle non-200 response
            }
        } catch (error) {
            console.error('Fetch error:', error);
        }
    };


    useEffect(() => {
        getallReviews();
    }, []);

    return (

        <div className="packages-container">
            <div className='userbookingdiv'>
                {islogin && <div className='mainbookingdiv'>
                    <div><button onClick={() => fetchyourbooking()} >Your Bookings</button></div>
                    {btnfetchbooking &&
                        <div> <table id='yourbookings'>
                            <thead>
                                <tr>
                                    <th>Package Name</th>
                                    <th>Username</th>
                                    <th>Mobile</th>
                                    <th>Date of Trip</th>
                                    <th>Approved</th>
                                    <th>Rejected</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookingData.map(booking => (
                                    <tr key={booking._id}>
                                        <td>{booking.packageName}</td>
                                        <td>{booking.username}</td>
                                        <td>{booking.mobile}</td>
                                        <td>{new Date(booking.dateOfTrip).toLocaleDateString()}</td>
                                        <td div style={{ backgroundColor: booking.approved ? 'greenyellow' : 'red' }}>{booking.approved ? 'Yes' : 'No'}</td>
                                        <td style={{ backgroundColor: booking.rejected ? 'greenyellow' : 'red' }}>{booking.rejected ? 'Yes' : 'No'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        </div>
                    }
                </div>


                }
            </div>

            <div className='bookingdialogue'>
                {isOpen && (
                    <div className="dialog-box">
                        <h2>Book Now</h2>
                        {islogin && !booked &&
                            <form onSubmit={(e) => handleSubmit(e)}>
                                <div id="bookform">
                                    <label htmlFor="packageName">Package Name:</label><br />
                                    <input type="text" id="packageName" name="packageName" value={formDatabook.packageName} onChange={(e) => handleChangebook(e)} readOnly /><br />
                                    <label htmlFor="mobilenumber">Mobile :</label><br />
                                    <input type="number" id="mobilenumber" name="mobilenumber" onChange={(e) => handleChangebook(e)} required /><br />
                                    <label htmlFor="dateOfTrip">Date of Trip:</label><br />
                                    <input type="date" id="dateOfTrip" name="dateOfTrip" value={formDatabook.dateOfTrip} onChange={(e) => handleChangebook(e)} required /><br /><br />
                                    <div className='submit-btn'><button type="submit">Submit</button></div>
                                </div>
                            </form>}
                        {!islogin && (<div><h4>Please Login to Book</h4>
                            <Link to="/login" ><button>Login</button></Link>
                        </div>)}
                        {booked && <h4>BOOKED SUCCESSFULLY</h4>}
                        <button className="close-btn" onClick={() => toggleDialog()}>Close</button>
                    </div>
                )}
            </div>

            <h2>Packages</h2>


            <div className='Packageitems'>
                {packages.map((packageData) => (
                    <PackageCard
                        key={packageData._id}
                        package_name={packageData.package_name}
                        package_description={packageData.package_description}
                        package_count={packageData.package_count}
                        package_cost={packageData.package_cost}
                        file_name={packageData.imagename}
                        is_Open={isOpen}
                        set_IsOpen={setIsOpen}
                        setForm_Databook={setFormDatabook}
                        setlogin={setlogin}
                        islogin={islogin}
                        istokenvalid={istokenvalid}
                        settokenvalid={settokenvalid}
                    />
                ))}
            </div>
            <div id="h3" >
                <h3>Note: For cancellation please contact: 7878787878</h3>
            </div>
            {/*  for making and  displaying reviews */}
            <div className='reviews'>
                <h2>Here are reviews</h2>
            </div>
            {islogin && (
                <form onSubmit={(e) => handereviewsubmit(e)} >
                    <label htmlFor="make">Make your Review</label>
                    <input id="make" name="message" required value={reviewdata.message} onChange={(e) => handlreviewchange(e)} />
                    <button type='submit'>Submit</button>
                </form>)
            }

            <div className='Reviews'>


                <table className='review'>
                    <tbody>
                        {getreviewdata.map((packageData, index) => (
                            <tr className="tr" key={index}>
                                <div className="reviewdiv">
                                    <div className='imagediv'>
                                        <td className='imagetd'>  <img src={usernameimage}></img></td>
                                        <td>{packageData.username}</td>

                                    </div>
                                    <td><Trcomponent message={packageData.message} /></td>
                                </div>

                            </tr>
                        ))}
                    </tbody>
                </table>


            </div>
        </div >
    );
};

export default PackagesComponent;
