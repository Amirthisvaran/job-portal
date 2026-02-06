import express from 'express'
import cors from 'cors'
import 'dotenv/config'

import connectDB from './config/db.js'
import connectCloudinary from './config/cloudinary.js'

import companyRouter from './routes/companyRoute.js'
import jobRouter from './routes/jobRoute.js'
import userRouter from './routes/userRoute.js'
import { clerkWebHooks } from './controllers/webhooks.js'
import { clerkMiddleware } from '@clerk/express'

const app = express()

// Connect services (safe for serverless)
await connectDB()
await connectCloudinary()

// Allowed origins
const allowedOrigins = [
  "http://localhost:5173",
  "https://job-portal30.vercel.app",
]

// Middlewares
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

// Routes
app.get('/', (req, res) => {
  res.status(200).send('API Working!')
})

app.post('/webhooks', clerkWebHooks)
app.use('/api/company', companyRouter)
app.use('/api/jobs', jobRouter)
app.use('/api/users', userRouter)

// Fallback route (prevents 404 on unknown paths)
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" })
})

// Export for Vercel serverless
export default app
