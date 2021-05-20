const mongoose=require("mongoose");
const validator=require("validator");
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const userSchema=new mongoose.Schema({
    name:
    {
        type:String,
        minlength:[2,"minimum 2 letters"],
        maxlength:100,
        required:true
    },
    email:
    {
        type:String,
        validate(value){
            if(!validator.isEmail(value)){
           alert("Email is Invalid");
            }
        },
        required:true
    },
    phone:
    {
        type:Number,
        minlength:[10,"make sure it is 10 digits"],
        maxlength:100,
        required:true
    },
    work:
    {
        type:String,
        required:true
    },
    password:
    {
        type:String,
        required:true
    },
    cpassword:
    {
        type:String,
        required:true
    },
    date:{
        type:Date,
       default:Date.now

    },
    messages:[
        {
            name:
            {
             type:String,
             required:true
            },
            email:
            {
            type:String,
           required:true
            },
            phone:
           {
           type:Number,
           required:true
           },
             message:
            {
            type:String,
            required:true
           },
        }
    ],
    tokens:[
        {
            token:{
                type:String,
                required:true
            }
        }
    ]
})

//password hashing//
userSchema.pre('save',async function(next){
    if(this.isModified('password'))
    {
        this.password=await bcrypt.hash(this.password,12);
        this.cpassword=await bcrypt.hash(this.cpassword,12);
    }
    next();
})
//*password hashing*//

//*token generation*//
userSchema.methods.generateAuthToken=async function(){
   const SECRET_KEY="mynameismukeshkumarsinghimprofessionalwebdevelpoerhdiugyggwefryguyegrfuygrekufygerkufyg";
    try{
        let token=jwt.sign({_id:this._id},`${process.env.SECRET_KEY}`);
        this.tokens=this.tokens.concat({token:token});
        await this.save();
        return token;
    }
    catch(e){
        console.log(e);
    }
}
userSchema.methods.addMessage=async function(name,email,phone,message){
    try{
        this.messages=this.messages.concat({name,email,phone,message});
        await this.save();
        return this.messages;
    }catch(error)
    {
        console.log(error);
    }
}

const User=new mongoose.model("merndatabase",userSchema);
module.exports=User;