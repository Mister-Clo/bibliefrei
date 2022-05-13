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
    const hash = await bcrypt.hash('"'+password+'"',salt)

    try{
        sequelize.authenticate()
        await sequelize.query("SELECT * FROM user WHERE email LIKE '"+email+"'")
        .then(async ([results,metadata]) => {

          if(results.length != 0) {
          //Si cet email est déjà utilisé, une erreur survient
            res.status(403).json({message:"This user already exists"})
          }
          else{
            //Nous créons l'utilisateur si l'email n'est pas utilise
            await sequelize.query("INSERT INTO `user` (`name`, `email`, `password`) VALUES ('"+ name +"','"+ email +"','"+ hash +"')")
              .then(([results,metadata]) =>{
                  res.status(200).json({results:results})
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
    var email = req.body.email
    var password = req.body.password
    console.log(req.body)
  
    console.log(email)
    console.log(password)
    try{
        sequelize.authenticate();
        
        await sequelize.query("SELECT * FROM user WHERE email LIKE '"+email+"'")
        .then(async ([results,metadata]) => {
          //Vérificatio de l'email
          if(results.length == 0) {res.status(404).json({message:"Password or email invalid email"})}

          //Vérification du mot de passe
          var pwd = '"'+password+'"'
          let compare = await bcrypt.compare(pwd,results[0].password)
          if(compare){
            const user = {id:results[0].id_user, name:results[0].name, email:results[0].email, profil:results[0].profil}

            /** Authentification avec JWT */
           const accessToken =  jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
           const refreshToken =  jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)
           refreshTokens.push(refreshToken)

           req.session.user = {
             "accessToken": accessToken,
             "refreshToken": refreshToken,
             "info": user
           }

           res.status(200).json(req.session.user)
          }
          else {
            res.status(403).json({message:"Password or email invalid password", success:0})
          }        
        })
      }
      catch(error){
        res.status(500).json({message:"rendered error"})
      }
})

/** Fetch the Library Books */
router.get('/books',authenticateToken, async (req,res)=>{
  try {
    sequelize.authenticate()
    await sequelize.query("SELECT * FROM livre")
          .then(([results,metadata])=>{
            res.status(200).json(results)
          })
  } catch (error) {
    res.status(500).json({message:"rendered error"})
  }
})

/** Add a new Book to the Library*/
router.post('/books',authenticateToken, async(req,res)=>{
  const titre = req.body.titre
  const genre = req.body.genre
  const quantite = req.body.quantite
  const image = req.body.image
  try {
    sequelize.authenticate()
    await sequelize.query("INSERT INTO `livre` (`titre`, `genre`, `quantite`, `image`) VALUES ('"+ titre +"','"+ genre +"','"+ quantite +"','"+ image +"')")
          .then(([results,metadata])=>{
            res.status(200).json({
              message : "Ajouté avec succès",
              livre : {id:results, titre: titre, genre: genre, quantite: quantite, image: image}
            })
          })
    
  } catch (error) {
    res.status(500).json({message:"rendered error"})

  }
})


/** Refresh Token */
router.post('/token', (req,res)=>{
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