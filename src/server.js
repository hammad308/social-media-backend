require("dotenv").config();
const http= require("http");
const app=require("./app");
const connectDB=require("./config/db");
const initializeSocket= require("./config/socket");

connectDB();


const PORT= process.env.PORT || 3000;

const server= http.createServer(app);

initializeSocket(server);

server.listen(PORT,()=>{
    console.log(`Server is listening on PORT ${PORT}`);
})
