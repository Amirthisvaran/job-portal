import express from 'express'
import cors from 'cors'
import 'dotenv/config'

import connectDB from '../server/config/db.js'
import connectCloudinary from '../server/config/cloudinary.js'

import companyRouter from '../server/routes/companyRoute.js'
import jobRouter from '../server/routes/jobRoute.js'
import userRouter from '../server/routes/userRoute.js'
import { clerkWebHooks } from '../server/controllers/webhooks.js'
import { clerkMiddleware } from '@clerk/express'

const app = express()

await connectDB()
await connectCloudinary()

const allowedOrigins = [
  "http://localhost:5173",
  "https://job-portal30.vercel.app",
]

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true)
      } else {
        callback(new Error("Not allowed by CORS"))
      }
    },
    credentials: true,
  })
)

app.use(express.json())
app.use(clerkMiddleware())

app.get('/', (req, res) => {
  res.send('API Working!')
})

app.post('/webhooks', clerkWebHooks)
app.use('/api/company', companyRouter)
app.use('/api/jobs', jobRouter)
app.use('/api/users', userRouter)

export default app
