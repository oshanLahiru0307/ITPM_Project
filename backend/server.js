require('dotenv').config()
const mongoose = require('mongoose')
const express = require('express')
const app = express()
const UserRoutes = require('./routers/UserRoutes')
const CategoriesRouter = require('./routers/CategorisRouter')

//midlewere...
app.use(express.json())
app.use((req,res,next,)=>{
    console.log(req.path)
    next()
})

app.use('/api/user', UserRoutes )
app.use('/api/category', CategoriesRouter )

mongoose.connect(process.env.MONGO_URI)
.then(
    app.listen(process.env.PORT, ()=> {
        console.log('app is listen to port',process.env.PORT)
    })
)
.catch((error) => {
    console.log(error)
})

