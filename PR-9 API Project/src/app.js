const express = require('express')
const port = 9090;
const app = express();

const dbconnect = require('./config/db.connection')
dbconnect();

//middlware

app.use(express.urlencoded())
app.use(express.json())
app.use('/uploads', express.static('src/uploads'))

app.use('/api',require('./routes/index.routes'))



app.listen(port, () => {
    console.log(`server Start At http://localhost:${port}`);
})