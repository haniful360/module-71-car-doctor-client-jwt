import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../Providers/AuthProviders';
import BookingRow from './BookingRow';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';


const Bookings = () => {
    const [bookings, setBookings] = useState([])
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const url = `https://car-doctor-server-haniful360.vercel.app/bookings?email=${user?.email}`

    const handleDelete = (_id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        })
            .then(result => {
                if (result.isConfirmed) {
                    fetch(`https://car-doctor-server-haniful360.vercel.app/bookings/${_id}`, {
                        method: 'DELETE',
                    })
                        .then(res => res.json())
                        .then(data => {
                            console.log(data);
                            if (data.deletedCount === 1) {
                                Swal.fire(
                                    'Deleted!',
                                    'Your Coffee has been deleted.',
                                    'success'
                                )
                                const remaining = bookings.filter(booking => booking._id !== _id)
                                setBookings(remaining)
                            }
                        })
                }
            })

    }

    const handleConfirm = (_id) => {
        fetch(`https://car-doctor-server-haniful360.vercel.app/bookings/${_id}`, {
            method: 'PATCH',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ status: 'confirm' })
        })
            .then(res => res.json())
            .then(data => {
                console.log(data)
                if (data.modifiedCount > 0) {
                    const remaining = bookings.filter(booking => booking._id !== _id)
                    let updated = bookings.find(booking => booking._id == _id);
                    updated.status = 'confirm';
                    const newBooking = [updated, ...remaining]
                    setBookings(newBooking);
                }
            })
    }

    useEffect(() => {
        fetch(url, {
            method: 'GET',
            headers: {
                authorization: `Bearer ${localStorage.getItem('car-access-token')}`

            }
        })
            .then(res => res.json())
            .then(data => {
                // console.log(data);
                if (!data.error) {
                    setBookings(data)
                }
                else {
                    // logout and then navigate
                    navigate('/')
                    
                }

            })
    }, [url, navigate])
    return (
        <div>
            <h3>bookings:{bookings.length}</h3>
            <div className="overflow-x-auto w-full">
                <table className="table w-full">
                    {/* head */}
                    <thead>
                        <tr>
                            <th>
                                <label>
                                    <input type="checkbox" className="checkbox" />
                                </label>
                            </th>
                            <th>Img</th>
                            <th>service</th>
                            <th>date</th>
                            <th>price</th>
                            <th>status</th>
                        </tr>
                    </thead>
                    <tbody>

                        {
                            bookings.map(booking => <BookingRow
                                key={booking._id}
                                booking={booking}
                                handleDelete={handleDelete}
                                handleConfirm={handleConfirm}
                            ></BookingRow>)
                        }

                    </tbody>


                </table>
            </div>

        </div>
    );
};

export default Bookings;