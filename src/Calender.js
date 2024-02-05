import React, { useEffect, useState } from 'react';
import moment from 'moment';
import './calender.css'
import { Navbar, Dropdown, Button, Form, Col, Row, Modal } from "react-bootstrap";
// import ApiClient from '../../methods/api/apiClient';
// import loader from '../../methods/loader';


function CalendarWithSlots({ user, HandleSubmit }) {
   
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedPostDate, setSelectedPostDate] = useState(null);
    const [currentDate, setCurrentDate] = useState(moment());
    const [filteredData, setFilteredData] = useState([]);
    const [show, setShow] = useState(false);
    const [showput, setShowput] = useState(false);
    const [data, setData] = useState([])
    const [filterData, setFilterData] = useState([])
    const [id, setId] = useState("")

    const [selectedSlots, setSelectedSlots] = useState(filterData ? filterData : []);
    useEffect(() => {
        const filter = data.filter(item => {
            if (item.date == selectedPostDate?.replace(/\//g, '-')) {
                return item
            }
        })
        setFilterData(filter?.[0]?.time || []);
        setId(filter?.[0]?._id)

    }, [selectedPostDate])

    useEffect(() => {
        setSelectedSlots(filterData)
    }, [filterData])

    console.log(selectedSlots, "selectedSlots")

    const transformedData = data.map(item => ({
        date: item?.date?.replace(/\-/g, '/'),
        time: item?.time
    }));

    const handleClose = () => {
        setShow(false)
        setSelectedSlots(filterData)
    };
    const handleShow = () => {
        setShow(true)
        setSelectedSlots(filterData)
    };
    const handlePutClose = () => setShowput(false);
    const handlePutShow = () => setShowput(true);
    const [dateData, setDateData] = useState(transformedData);

    useEffect(() => {
        setDateData(transformedData)
    }, [data])

    const timeSlots = [
        '09-10 AM',
        '10-11 AM',
        '11-12 AM',
        '12-13 PM',
        '14-15 PM',
        '15-16 PM',
        '16-17 PM',
        ,
        '18-19 PM',
    ];

    const sendAvaibility = {
        schedule: [
            {
                date: selectedPostDate?.replace(/\//g, '-'),
                time: selectedSlots
            }
        ]
    }

    // const postData = () => {
    //     if (selectedSlots > 0) {
    //         return
    //     }
    //     ApiClient.post('availability', sendAvaibility).then((res) => {
    //         if (res.success) {
    //             handleClose()
    //             getData()
    //             // setData(res?.data)
    //             window.location.reload(true);
    //         }
    //     })
    // }

    const updateData = {
        "id": id,
        "time": selectedSlots
    }

//     const putData = () => {
// loader(true)
//         ApiClient.put('availability', updateData).then((res) => {
//             if (res.success) {
//                 handlePutClose()
//                 getData()
//                 window.location.reload(true);
//                 // setData(res?.data)
//             }
//             loader(false)
//         })
//     }

    const handleSummit = () => {
        if (selectedSlots > 0) {
            return
        }
        // postData()
    }

    const handlePutSummit = () => {
        if (selectedSlots > 0) {
            return
        }
        // putData()
    }

    // const getData = () => {
    //     // loader(true)
    //     ApiClient.get('admin/availabilitylist').then((res) => {
    //         if (res.success) {
    //             // console.log(res.data,"This is my data that we need ")
    //             setData(res?.data)
    //         }
    //         // loader(false)

    //     })
    // }    

    useEffect(() => {
        // getData()
    }, [])

    const handleCheckboxChange = (slot) => {
        console.log(slot, '==Slot');
        const isSelected = selectedSlots?.includes(slot);
        console.log(isSelected, '=IS Selevted');
        if (isSelected) {
            const updatedSlots = selectedSlots?.filter(selectedSlot => selectedSlot !== slot);
            setSelectedSlots(updatedSlots);
        } else {
            setSelectedSlots([...selectedSlots, slot]);
        }
    };


    const handleDateHover = (date) => {
        setSelectedDate(date);
    };

    const handleDateClick = (formattedDate, slots) => {
        if (slots.length > 0) {
            setSelectedPostDate(formattedDate)
            handlePutShow()
        } else {
            setSelectedPostDate(formattedDate)
            handleShow()
            // setSelectedSlots(filteredData)
            // setSelectedSlots([])}
        };
        // getData()
    }

    const nextMonth = () => {
        setCurrentDate(moment(currentDate).add(1, 'months'));
    };

    const prevMonth = () => {
        setCurrentDate(moment(currentDate).subtract(1, 'months'));
    };

    const today = moment(currentDate);
    const daysInMonth = today.daysInMonth();
    const firstDayOfMonth = moment(today).startOf('month').day();
    const monthYear = today.format('MMMM YYYY');

    const calendarDays = [];
    let dayCounter = 1;

    for (let i = 0; i < 6; i++) {
        const weekDays = [];

        for (let j = 0; j < 7; j++) {
            if ((i === 0 && j < firstDayOfMonth) || dayCounter > daysInMonth) {
                weekDays.push(<td key={`${i}-${j}`}></td>);
            } else {
                const currentDate = moment(today).date(dayCounter);
                const formattedDate = currentDate.format('DD/MM/YYYY');
                const slotsForDate = dateData.find((data) => data.date === formattedDate);
                const slots = slotsForDate ? slotsForDate.time : [];

                let buttonClass = '';
                if (slots.length > 0) {
                    buttonClass = 'has-slots';
                } else {
                    buttonClass = 'no-slots';
                }

                // Compare the current date with the date being generated
                const isPastDate = currentDate.isBefore(moment(), 'day');

                weekDays.push(
                    <td key={`${i}-${j}`} className={`${selectedDate === formattedDate ? 'selected' : ''} ${buttonClass}`}
                        onClick={isPastDate || currentDate.isAfter(currentDate.clone().endOf('day'))? '' :() => handleDateClick(formattedDate, slots)}
                        onMouseEnter={() => handleDateHover(formattedDate)}
                        onMouseLeave={() => handleDateHover(null)}
                       >
                        <button
                         disabled={isPastDate || currentDate.isAfter(currentDate.clone().endOf('day'))}
                        >
                            {dayCounter}
                        </button>
                        {selectedDate === formattedDate && (<>
                          { slots.length > 0 &&  <div className="slots-popup">
                                <>
                               <div className='w-100'>
                                <p className='mb-2 fs16'>Time Slot</p>
                                </div>
                                {slots.length > 0 ? (
                                    <ul className='slot_popsdata'>
                                      
                                        {slots.map((slot, index) => (<>    
                                            <li key={index}>{slot}</li>
                                            </>
                                        ))}
                                    </ul>
                                ) : (
                                    <p></p>
                                )}
                                </>
                            </div>}
                            </>
                        )}
                    </td>
                );
                dayCounter++;
            }
        }
        calendarDays.push(<tr key={i}>{weekDays}</tr>);
    }


    const HandleCheckBox = (request) => {
        console.log(request, "This is the data that we want -----------")
    }
    return (
        <>

            <div className="calendar-container">
                <div className=" pprofile1">
                    <h4 className='ViewUser'>Add Availability</h4>
                    <div className='row'>
                        <div className='col-12 col-sm-12 col-md-12'>
                            <div>
                                <div className="calendar-nav">
                                    <button className='btn btn-primary' onClick={prevMonth}> <i className='fa fa-angle-left'></i> Previous</button>
                                    <h6 className='m-0 colorblue'>{monthYear}</h6>
                                    <button className='btn btn-primary' onClick={nextMonth}>Next <i className='fa fa-angle-right'></i></button>
                                </div>
                                <table className='height300'>
                                    <thead>
                                        <tr>
                                            <th>Sun</th>
                                            <th>Mon</th>
                                            <th>Tue</th>
                                            <th>Wed</th>
                                            <th>Thu</th>
                                            <th>Fri</th>
                                            <th>Sat</th>
                                        </tr>
                                    </thead>
                                    <tbody>{calendarDays}</tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* modal */}
            {/* <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Select Slots</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='slots_lists px-5'>
                        {timeSlots.map(slot => {
                            console.log({ slot, selectedSlots }, "This is the slot data")

                            return (
                                <div className='timeslots'>

                                    <label class="checkbox_new" key={slot}>
                                   
                                        <input className='mr-2' type="checkbox" onChange={() => handleCheckboxChange(slot)} checked={selectedSlots && selectedSlots.includes(slot)} /> 
                                        <div class="checkmark"></div>
                                        <span className='ml-2 fs12'>{slot}</span>
                                    </label>
                                </div>
                            )
                        })}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSummit}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal> */}

            {/* put modal */}
            {/* <Modal show={showput} onHide={handlePutClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Select Slots</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='slots_lists'>
                        {timeSlots.map(slot => (

                            <div className='timeslots'>

                                <label class="checkbox_new" key={slot}>

                                    <input className='mr-2' type="checkbox" onChange={() => handleCheckboxChange(slot)} checked={selectedSlots && selectedSlots.includes(slot)} />
                                    <div class="checkmark"></div>
                                    <span className='ml-2 fs12'>{slot}</span>
                                </label>
                            </div>
                        ))}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handlePutClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handlePutSummit}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal> */}
        </>
    );
}
export default CalendarWithSlots;
