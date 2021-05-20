const jwt=require("jsonwebtoken");
const user=require("../models/userschema");
const authenticate=async(req,res,next)=>{
    try{
        const token=req.cookies.jwtoken;
        const verifyToken= jwt.verify(token,`${process.env.SECRET_KEY}`);
        const rootuser= await user.findOne({_id:verifyToken._id,"tokens.token":token});
       //console.log("chal rha hai");
        if(!rootuser)
        {
            throw new Error("User not found");
        }
        req.token=token;
        req.rootuser=rootuser;
        req.userId=rootuser._id;
        //res.json({ jwt: token });
        next();
    }
    catch(err){
        res.status(401).send("unauthorized:NO token provided");
        console.log(err);

    }
}
module.exports=authenticate;