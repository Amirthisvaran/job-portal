import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from '../config/db.js'
import { clerkWebHooks } from '../controllers/webhooks.js'
import companyRouter from '../routes/companyRoute.js'
import connectCloudinary from '../config/cloudinary.js'
import jobRouter from '../routes/jobRoute.js'
import userRouter from '../routes/userRoute.js'
import { clerkMiddleware } from '@clerk/express'

const app = express()

// Connect services (safe for serverless)
await connectDB()
await connectCloudinary()

// Middlewares
const allowedOrigins = [
  "http://localhost:5173",
  "https://job-portal30.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json())
app.use(clerkMiddleware())

// Routes
app.get('/', (req, res) => {
  res.send('API Working!')
})

app.post('/webhooks', clerkWebHooks)
app.use('/api/company', companyRouter)
app.use('/api/jobs', jobRouter)
app.use('/api/users', userRouter)

// Export for Vercel
export default app
