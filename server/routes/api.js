require('dotenv').config()
const express = require('express')
const { Sequelize } = require('sequelize')
const router = express.Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const saltRounds = 10
const refreshTokens = [] //Will transfer this to database


const sequelize = new Sequelize("bibli_efrei", "root", "",
{
  dialect: "mysql",
  host: "localhost"
})

//Gérer l'erreur unhandledRejection du serveur
process.on('unhandledRejection', function(err) {
    console.log(err);
});


/** Registration */
router.post('/register',async (req,res) => {
    const name = req.body.name
    const email = req.body.email
    const password = req.body.password
    const salt = await bcrypt.genSalt(saltRounds)
    const hash = await bcrypt.hash(password,salt)

    try{
        sequelize.authenticate()
        await sequelize.query("SELECT * FROM user WHERE email LIKE "+email)
        .then(async ([results,metadata]) => {

          if(results.length != 0) {
          //Si cet email est déjà utilisé, une erreur survient
            res.status(403).json({error:"This user already exists"})
          }
          else{
            //Nous créons l'utilisateur si l'email n'est pas utilise
            await sequelize.query("INSERT INTO `user` (`name`, `email`, `password`) VALUES ("+ name +","+ email +",'"+ hash +"')")
              .then(([results,metadata]) =>{
                  res.status(200).json({message:results})
              })
            
          }
        })
      }
      catch(error){
        res.status(500).json({message:error})
      }
})


/** Login */
router.post('/login',async (req,res) => {
    const email = req.body.email
    const password = req.body.password

    try{
        sequelize.authenticate();
        await sequelize.query("SELECT * FROM user WHERE email LIKE "+email)
        .then(async ([results,metadata]) => {
          //Vérificatio de l'email
          if(results.length == 0) {res.status(404).json({message:"Password or email invalid email"})}
          //res.json(results)
          //Vérification du mot de passe
          let compare = await bcrypt.compare(password,results[0].password)
          if(compare){
            const user = {id:results[0].id_user, name:results[0].name, email:results[0].email, profil:results[0].profil}
            req.session.user = user
            /** Authentification avec JWT */
           const accessToken =  jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30m'})
           const refreshToken =  jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)
           refreshTokens.push(refreshToken)
           res.status(200).json({
                message:"Login successful",
                accessToken : accessToken, //needed to access resources
                refreshToken : refreshToken, //needed to refresh accessToken
                user: user
           })
          }
          else {
            res.status(403).json({message:"Password or email invalid password", success:0})
          }        
        })
      }
      catch(error){
        res.status(500).json({message:"error"})
      }
})

/** Refresh Token */
router.post('token', (req,res)=>{
    const refreshToken = req.body.token
    if (refreshToken == null) return res.sendStatus(401)
    if (!refreshTokens.includes(refreshToken)) return sendStatus(403)
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err,user)=>{
        if(err) return res.sendStatus(403) //Forbidden
        const accessToken =  jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30m'})
        res.json({
            message:"Refresh successful",
            accessToken : accessToken, //needed to access resources
            user: user
       })
    })
})

/** Delete Refresh Tokens */
router.delete('/logout',(req,res)=>{
    refreshTokens = refreshTokens.filter(token => token !== req.body.token)
    res.sendStatus(204)
} )

/** Middleware to authenticate user with JWT and enable access to resources */
function authenticateToken(req,res,next){
  const authHeader = req.headers['authorization']
  const token =  authHeader && authHeader.split(' ')[1]
  if (token == null) return res.sendStatus(401) //UnAuthenticated

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err,user)=>{
      if(err) return res.sendStatus(403) //Forbidden
      req.user = user
      next()
  })
}















module.exports = router