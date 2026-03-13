// 1. Load express
const express = require('express');
const app = express();
app.use(express.json());//this lets our backend read JSON
// 2. Set a port number
const PORT = 3000;
const bookings = [];//This will hold our bookings
app.post('/bookings', (req, res) => {
    const booking = req.body;
    //giving it a unique ID
    booking.id = Date.now();
    //saveing it in memory
    bookings.push(booking);
    res.status(201).json({
        message: 'Booking created successfully',
        booking: booking
    });
});
//Fake Helpers data
const helpers=[
    {
        id:1,
        name:"Mary Mwende",
        category:"plumber",
        location:"Nairobi, Kenya",
        rating:4.5,
    },
    {
        id:2,
        name:"Kelvin Omondi",
        category:"electrician",
        location:"Westlands Nairobi, Kenya",
        rating:4.7,
    },
    {
        id:3,
        name:"Amina Yusuf",
        category:"Makeup Artist",
        location:"South B, Nairobi, Kenya",
        rating:4.8,
    },
]
//Test route
app.get('/', (req, res) => {
  res.send('Hello from Skillspotter backend!');
});
//Send list of helpers
app.get('/helpers', (req, res) => {
  res.json(helpers);
});
//Show all bookings(all or filtered by user)
app.get('/bookings', (req, res) => {
    const {user} = req.query;
    
    console.log("Requesting bookings for user:", user);
    if (typeof user=== 'string') {
        const filtered = bookings.filter(b=>{
            if(typeof b.user === 'string'){
                return b.user.toLowerCase() === user.toLowerCase();
            }
        });
    res.json(filtered);
    } else {
        res.json(bookings);
    }
});
// 4. Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
//Cancel a booking by ID
app.delete('/bookings/:id', (req, res) => {
    const bookingId = parseInt(req.params.id);
    const index = bookings.findIndex(b => b.id === bookingId);
    if (index !== -1) {
        bookings.splice(index, 1);
        res.json({
            message: 'Booking cancelled successfully'});
    } else {
        res.status(404).json({error: 'Booking not found'});
    }
});
//Update booking status by ID
app.put('/bookings/:id', (req, res) => {
    const bookingId = parseInt(req.params.id);
    const {status} = req.body;
    const booking = bookings.find(b => b.id === bookingId);

    if (!booking) {
        return res.status(404).json({error: 'Booking not found'});
    }
    if (!status) {
        return res.status(400).json({error: 'Status is required'});
    }
    booking.status = status;
    res.json({
        message: 'Booking status updated successfully',
        booking: booking
         });
});