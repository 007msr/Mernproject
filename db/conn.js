const mongoose=require("mongoose");

const db=" mongodb+srv://msr:iitianmukesh@cluster0.q442r.mongodb.net/merndatabase?retryWrites=true&w=majority";
mongoose.connect(db,{
   useNewUrlParser:true,
   useCreateIndex:true,
   useUnifiedTopology:true,
   useFindAndModify:false
}).then(()=>console.log("connection successful")).catch((err)=>console.log("no connection"));