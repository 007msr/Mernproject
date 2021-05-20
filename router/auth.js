const express=require("express");
const bcrypt=require("bcryptjs");
const mongoose=require("mongoose");
const jwt=require("jsonwebtoken");
const router=express.Router();
const User=require("../models/userschema");
const authenticate=require("../middleware/authenticate");

require("../db/conn");

router.get("/",(req,res)=>{
    res.send(req.userId);
});



router.post("/register", async (req,res)=>{
   

try{
   // console.log(req.body);
   const {name,email,phone,work,password,cpassword}=req.body;
   if(!name ||  !email || !phone || !work|| !password || !cpassword )
   {
       
      return res.status(422).json({error:"Fields can't be left empty"});
   }
   const userExist=await User.findOne({email:email});
   if (userExist) {
      
    return res.status(422).json({ error: "Email already Exist" });
} else if (password != cpassword) {
    
    return res.status(422).json({ error: "password are not matching" });

} else {
    const user = new User({ name, email, phone, work, password, cpassword });
   // yeha pe 
   await user.save();
   res.status(201).json({ message: "user registered successfuly" });
}
    //res.send(req.body);
}
catch(e){
    console.log(e);
}
})


router.post("/signin",async (req,res)=>{
    
    try{
        let token;
        const { email,password }=req.body;
        if(!email || !password)
        return res.status(400).json({err:"fields can't be empty"});
        
       const userlogin= await User.findOne({email: email})
        console.log(userlogin);
      // console.log(userlogin.name);
       //console.log(password);

       if(userlogin)
       {
           const isMatch=await bcrypt.compare(password,userlogin.password)
           //*token generation*//
        
          // if(userlogin.password===password)
          if(isMatch){
          token = await userlogin.generateAuthToken();
          console.log(token);

          res.cookie("jwtoken", token, {
              expires: new Date(Date.now() + 25892000000),
              httpOnly:true
          });
          
          res.json({ message: "user Signin Successfully" });
        }
           else
           return res.status(400).json({err:"invalid credientials"});

       }
       else{
        res.status(400).json({err:"invalid credientials"});
       }
      
    //res.status(200).json({message:"got it"});
    }
    
    catch(err){
        console.log(err);
    }

})

router.get("/about",authenticate,(req,res)=>{
    
    res.send(req.rootuser)

})
router.get("/getdata",authenticate,(req,res)=>{
    res.send(req.rootuser);
})
router.post("/contact",authenticate,async(req,res)=>{

    try{
        const { name , email , phone, message }=req.body;
       // console.log(name);
        //console.log(email);
        //console.log(phone);
       // console.log(message);
        if(!name || !email || !phone || !message)
        {
            console.log("error in contact form");
            res.status(400).json({error:"fill properly"});
        }
        const usermatching=await User.findOne({_id:req.userId});
        if(usermatching)
        {
            const usermessage= await usermatching.addMessage(name,email,phone,message);
            await usermatching.save();
            res.status(200).json({msg:"message sent successfully"});
        }

    }catch(err){
        console.log(error);
    }
});

    router.get("/logout",(req,res)=>{
        console.log("LOGGED OUT");
        res.clearCookie('jwtoken',{path:"/"});
        res.status(200).send("user logged out");
    });

module.exports=router;
