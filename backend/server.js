require('dotenv').config()
const mongoose = require('mongoose')
const express = require('express')
const app = express()


app.use('/uploads', express.static('uploads'));

const UserRoutes = require('./routers/UserRoutes')
const CategoriesRouter = require('./routers/CategorisRouter')
const ItemRouter = require('./routers/ItemRoutes')
const donation = require('./routers/DonationROuter')
const cors = require('cors')


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


mongoose.connect(process.env.MONGO_URI)
.then(
    app.listen(process.env.PORT, ()=> {
        console.log('app is listen to port',process.env.PORT)
    })
)
.catch((error) => {
    console.log(error)
})
