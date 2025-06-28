import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDb from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import adminRouter from './routes/adminroute.js'
import doctorRouter from './routes/doctorRoute.js'
import userRouter from './routes/userRoute.js'
//app config
const app = express()
const port = process.env.PORT || 4000
connectDb()
connectCloudinary()
//middlewares
app.use(express.json())
app.use(cors()) //connect frontend with backend

//api endpoints
app.use('/api/admin',adminRouter)
app.use('/api/doctor',doctorRouter)
app.use('/api/user',userRouter)
app.use('/api/payment',userRouter)
//localhost:4000/api/admin/add-doctor
app.get('/', (req, res) => {
    res.send('Hello World!')
})
app.listen(port,()=>console.log('server started!', port))