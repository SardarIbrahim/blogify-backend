import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'

import cloudinary from 'cloudinary'

const app = express()

// connection to db
import connectDb from './database/db.js'

// global middlewares
dotenv.config()
import 'express-async-errors'

// cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

app.use(express.json({ limit: '20mb' }))
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

// errors
import errorMiddleware from './middlewares/errorMiddleware.js'
import { notFound } from './middlewares/notFound.js'

// routes
import userRoutes from './routes/userRoutes.js'
import postRoutes from './routes/postRoutes.js'

// route middlewares
app.use('/api/v1/users', userRoutes)
app.use('/api/v1/posts', postRoutes)

// error handling middlwares
app.use(errorMiddleware)
app.use(notFound)

const PORT = process.env.PORT || 5000

const spinServer = async () => {
  try {
    await connectDb()
    app.listen(PORT)
    console.log('Server is up')
  } catch (error) {
    console.log(error.message)
  }
}

spinServer()
