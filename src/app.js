const express = require('express');

const app = express();

app.use("/test", (req, res) => {
    res.send('Hello World');
})

app.use("/", (req, res) => {
    res.send('Welcome to the home page');
})
app.listen(3000, () => {
    console.log('Server is suuccessfully running on port 3000...');
});