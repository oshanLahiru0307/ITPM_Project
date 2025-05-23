require('dotenv').config()
const mongoose = require('mongoose')
const express = require('express')
const bodyParser =require('body-parser')
const app = express()
const cors = require('cors')

app.use(bodyParser.json({limit:'50mb'}))
app.use(bodyParser.urlencoded({limit:'50mb',extended :true}))
app.use('/uploads', express.static('uploads'));

const UserRoutes = require('./routers/UserRoutes')
const CategoriesRouter = require('./routers/CategorisRouter')
const ItemRouter = require('./routers/ItemRoutes')
const donation = require('./routers/DonationROuter')
// const AdminbanneraddRoutes = require('./routers/AdminbanneraddRoutes.js');
const AdminbanneraddRouter = require('./routers/AdminbaneraddRouter.js')

//midlewere...
app.use(cors())
app.use(express.json())
app.use((req,res,next,)=>{
    console.log(req.path)
    next()
})

app.use('/api/user', UserRoutes )
app.use('/api/category', CategoriesRouter )
app.use('/api/item', ItemRouter )
app.use('/api/donation', donation )
app.use('/api/AdminbanneraddRoutes', AdminbanneraddRouter);



mongoose.connect(process.env.MONGO_URI)
.then(
    app.listen(process.env.PORT, ()=> {
        console.log('app is listen to port',process.env.PORT)
    })
)
.catch((error) => {
    console.log(error)
})
