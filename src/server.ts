// import 'reflect-metadata'
// import express from 'express'
// import './database'
import { app } from './app'

const PORT = 3333

app.listen(PORT, () => {console.log(`Listening on  http://localhost:${PORT}/`)})