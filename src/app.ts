

import express, { Request, Response } from "express";
import {Db, ObjectId} from "mongodb";
import mongodb from "mongodb"
import {MongoClient} from "mongodb" 
import engines from "consolidate"
import bcrypt from "bcryptjs"
//import bodyParser from "body-Parser"
import path from "path"
import flash from "express-flash"
import session from "express-session"



// Our Express APP config
const app = express();
app.use(express.json());
const PORT=3000
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine','html')
app.engine('html',engines.mustache)
app.use(express.urlencoded({extended: false}))


app.use(flash())
app.use(session({
    secret: 'somevalue',
    resave: false,
    saveUninitialized: false
}))


//listen to port
app.listen(process.env.PORT ||PORT,()=>{
        
    console.log(`Port is open at ${PORT}`)

})
 

//connecting to mongodb
const url='mongodb://user:abc123@localhost:27017/?authMechanism=DEFAULT&authSource=users'
const Dbname="users"
const client= new MongoClient(url)

let db:Db
const connect= async(dbName: string=Dbname)=>{
    const conn=await client.connect()
    db=conn.db(dbName)
    return client
    console.log("Connection successsful")
}
connect()

//Get main page
app.get('/',(req,res)=>{
    res.render('index')
    })
//GET login page
app.get('/login',(req,res)=>{
    res.render('login')
})

// GET register page 
app.get('/register',(req,res)=>{
    res.render('register')
})

//POST method for login page
app.post('/login', async(req,res)=> {
    const user={
        email: req.body.email,
        password: await bcrypt.hash(req.body.password,10)    }
        const hashedpwd=JSON.stringify(db.collection('regusers').findOne({password: {$eq: user.password}}))
        const passw=  JSON.stringify(bcrypt.compare(user.password,hashedpwd) )
        let email=db.collection('regusers').findOne({email:{$eq: user.email}})
     
     // const result =  db.collection('regusers').find({},{ projection: { _id: 0, firstname:0,lastname:0,email: 1, password: 1 } }).toArray          
   res.render('login',{hashedpwd:hashedpwd,passw:passw,email:email})
  
    })
//register user using POST method with encrypted password
app.post('/register',async(req,res)=>{ 


    const data =({
        id: Date.now().toString(),
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: await bcrypt.hash(req.body.password,10)
    })

       db.collection('regusers').findOne({email: req.body.email})
       .then((email)=>{
    
        if(email){
            let errors='Email already exists'
           
            res.render('register',{
               errors:errors
            })

        console.log("User already exist")
           
        }
        else{
            db.collection('regusers').insertOne(data)
            const success='Successfully registered'
            res.render('index',{success:success})
        }

       })
        
       })
             
    

app.get('/Events',(req,res)=>{
    db.collection('Events').find({},{ projection: { _id: 0, Event: 1, Time: 1 } }).toArray((err:any, result:any)=>{
        if(err)
        console.log("Error")
        else
        result=JSON.stringify(result)
        res.render('Events',{result:result})
    })
})

app.close('/close',(req,res)=>{
console.log("Process is complete")
process.exit()

})


       





    
    
