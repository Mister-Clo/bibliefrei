require('dotenv').config()
const express = require('express')
const { Sequelize } = require('sequelize')
const router = express.Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const app = require("../server");
const saltRounds = 10
let refreshTokens = [] //Will transfer this to database


const sequelize = new Sequelize("bibliefrei", "root", "",
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
        await sequelize.query("SELECT * FROM bibliefrei.user WHERE user.email LIKE '"+email+"'")
            .then(async ([results,metadata]) => {

                if(results.length != 0) {
                    //Si cet email est déjà utilisé, une erreur survient
                    res.status(403).json({error:"This user already exists"})
                }
                else{
                    //Nous créons l'utilisateur si l'email n'est pas utilise
                    await sequelize.query("INSERT INTO bibliefrei.user (name, email, password) VALUES ('"+ name +"','"+ email +"','"+ hash +"')")
                        .then(([results,metadata]) =>{
                            res.status(200).send("true")
                        })

                }
            })
    }
    catch(error){
        res.status(500).json({message:error})
    }

})



router.post('/panier', async (req, res) => {

    /*const idd = parseInt(req.body.idd)
    const nameE= req.body.nameE
    const priceE = parseInt(req.body.priceE)
    const imgM = req.body.imgM
    const desc = req.body.desc

    var db = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database:"tp1_web"
    })



    db.connect(function(err) {
      if (err) throw err;
      console.log("Connecté à la base de données MySQL!");



      var records = [
        [idd,nameE,desc,priceE,imgM],

      ];
      db.query("INSERT INTO tp1_web.articles (id_articles,name,description,price,image) VALUES ?", [records], function (err, result, fields) {
        // if any error while executing above query, throw error
        if (err) throw err;
        // if there is no error, you have the result
        console.log(result+" l'élément "+records+" a bien été ajouté");
      });
    })*/


    const id = req.body.id
    const desce= req.body.desce
    const genre = req.body.genre
    const imge=req.body.imge

    // vérification de la validité des données d'entrée


    const sequelize = new Sequelize("bibliefrei", "root",
        "", {
            dialect: "mysql",
            host: "localhost",
        });

    try {


        sequelize.authenticate();
        console.log('Connecté à la base de données MySQL!');
        const [results,metadata] = await sequelize.query("INSERT INTO bibliefrei.livre(id_livre,description,genre,image) VALUES ("+id+",'"+desce+"',' "+genre+"','"+imge+"');" , {


            id:id,

            desce:desce,

            genre:genre,

           imge:imge

        });

        console.log(results)

    } catch (error) {
        console.error('Impossible de se connecter, erreur suivante :',
            error);
    }
    /*
        const id= parseInt(req.body.id)
        const quantity =parseInt(req.body.quantity)
        const article = articles.find(a => a.id === id)
        var newArticle = article
        newArticle.quantity=quantity


        if (isNaN(quantity) || quantity<=0){
          res.status(404).json({ message: 'the quantity should be a positif number' })
          return
        }

        if(!article){
          res.status(400).json({ message: 'a object with this id doesnt exist' })
          return
        }



        var alreadyExist= req.session.panier.articles.find(a => a.id === newArticle.id)//regarde dans la liste articles si il y a pas un objet qui possède déja cet id
        if(!alreadyExist){
          for(var i=0; i<quantity;i++)
          {
            req.session.panier.articles.push(newArticle)
            res.status(201).json(req.session.panier)
          }
        }
        res.status(404).json({message:"this id already exist"})*/

})













        router.post('/login',async (req,res) => {
    const email = req.body.email
    const password = req.body.password

    try{
        sequelize.authenticate();
        await sequelize.query("SELECT * FROM bibliefrei.user WHERE user.email LIKE '"+email+"' ")
            .then(async ([results,metadata]) => {
                //Vérificatio de l'email
                if(results.length == 0) {res.status(404).json({message:"Password or email invalid email"})}
                //res.json(results)
                //Vérification du mot de passe
                let compare = await bcrypt.compare(password,results[0].password)
                if(compare){
                    const user = {id:results[0].id_user, name:results[0].name, email:results[0].email, profil:results[0].profil}

                    /** Authentification avec JWT */
                    const accessToken =  jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30m'})
                    const refreshToken =  jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)
                    refreshTokens.push(refreshToken)
                    res.status(200).send({
                        message:"Login successful",
                        data:"true",
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


router.post('/panier/login',async (req, res) => {

    const email = req.body.email
    const password=req.body.password




    const sequelize = new Sequelize("bibliefrei", "root",
        "", {
            dialect: "mysql",
            host: "localhost",
        });

    try {
        sequelize.authenticate();
        console.log('Connecté à la base de données MySQL!');
        const [results, metadata] = await sequelize.query("SELECT id_user FROM bibliefrei.user WHERE user.email= '"+email+"' and user.password='"+password+"'")
        console.log(results)
        if(results.length==0){
            res.status(404).send({message:"password or email invalid"})}




        if (results.length > 0) {
            let user = results[0]
            req.session.user_id = user.id_user;
            res.status(200).send({message:"true"})
        } else {
            res.status(200).send({message:"false"})
        }


    /* db.connect(function (err) {
       if (err) throw err;

       db.query(sql, function (err, result) {
         if (err) throw err, console.log("connection impossinle");
         if (result.length > 0) {
           let user = result[0]
           req.session.user_id = user.id_user;
           res.status(200).send("true")
         } else {
           res.status(200).send("false")
         }

         console.log(result);


       });*/
}catch(err){
    }
    }
)














module.exports = router