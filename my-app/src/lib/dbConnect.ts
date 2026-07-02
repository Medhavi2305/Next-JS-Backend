import mongoose from "mongoose";

type connectionObject = {
    isConnected?: number
}

const connection: connectionObject = {}

async function dbConnect(): Promise<void> {
    if(connection.isConnected){
        console.log('Databse Already Connected')
        return
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || '', {})
        console.log(`Data Base Connected: ${db}`)
        connection.isConnected = db.connections[0].readyState
        console.log(`Connection: ${db.connections[0]}`)
        console.log('Data base cconnected successfully')
    } catch (error) {
        console.log(`Database connection failed ${error}`)
        process.exit(1)
    }
}

export default dbConnect