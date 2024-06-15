import mongoose from "mongoose"

const express = require("express")

const app = express()


async function start() {
    try {
      mongoose
        .connect("mongodb://localhost:27017/app")
        .then(() => console.log("Connected to DB"))
        .catch((e: any) => console.error("Failed to connect to DB", e))
  
      app.listen(8888, () => console.log("Server is running on port 8888"))
    } catch (e: any) {
      console.log("Server Error", e.message)
      process.exit(1)
    }
  }
  
  start()