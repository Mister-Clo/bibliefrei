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


/*********************************************************************
 *                                                                   *
 *                 AUTHENTIFICATION                                  *
 * *******************************************************************/

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
            const user = {id:results[0].id_user, name:results[0].name, email:results[0].email, profil:results[0].profil, role:results[0].role}

            /** Authentification avec JWT */
           const accessToken =  jwt.sign(user, process.env.ACCESS_TOKEN_SECRET,{ expiresIn: '30m'})
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


/** Logout Deconnexion */
router.delete('/logout/', authenticateToken, async(req,res)=>{
  
  req.session.destroy()

  res.status(200).json({message:"Déconnecté(e) avec succès. Merci et à bientôt"})

})


/*********************************************************************
 *                                                                   *
 *                     PANIER                                        *
 * *******************************************************************/
 

/** Get Panier */
router.get('/panier',authenticateToken, async(req,res)=>{
  try {
    await sequelize.query("SELECT * FROM panier WHERE user_id ='"+req.user.id+"'")
    .then(async ([results,metadata])=>{
      if(results.length == 0){
        await sequelize.query("INSERT INTO `panier` (`user_id`) VALUES ('"+req.user.id+"')")
            .then(async ([result,metadata])=>{
              await sequelize.query("SELECT livre.id_livre AS id_livre,livre.titre AS titre,livre.genre AS genre,livre.image AS image,panier.id_panier AS id_panier,quantity,user_id,date_creation "+ 
              "FROM " +
              "(panier_item JOIN panier ON panier_item.id_panier=panier.id_panier) JOIN livre ON livre.id_livre = panier_item.id_livre WHERE user_id = '"+req.user.id+"'")
              .then(([items,metadata])=>{
                res.status(200).json(items)
              })
            })
      }

      else{
        await sequelize.query("SELECT livre.id_livre AS id_livre,livre.titre AS titre,livre.genre AS genre,livre.image AS image,panier.id_panier AS id_panier,quantity,user_id,date_creation"+ 
              " FROM " +
              "(panier_item JOIN panier ON panier_item.id_panier=panier.id_panier) JOIN livre ON livre.id_livre = panier_item.id_livre WHERE user_id = '"+req.user.id+"'")
              .then(([items,metadata])=>{
                res.status(200).json(items)
              })
      }
    })
    
  } catch (error) {
    res.status(500).json({message:error.response.data})
  }

})


/** Add a book in cart */
router.post('/panier',authenticateToken, async(req,res)=>{
  const quantite = parseInt(req.body.quantite)
  const id_livre = req.body.idLivre
  try {
    sequelize.authenticate()
    await sequelize.query("SELECT * FROM panier WHERE user_id ='"+req.user.id+"'")
          .then(async ([results,metadata])=>{
          
          //Le panier est inexistant et vide
          if(results.length == 0) {
            await sequelize.query("INSERT INTO `panier` (`user_id`) VALUES ('"+req.user.id+"')")
                  .then(async ([resul,metadata])=>{
                     await sequelize.query("INSERT INTO `panier_item` (`id_panier`, `id_livre`, `quantity`) VALUES ('"+resul+"', '"+id_livre+"', '"+quantite+"')")
                            .then(([results,metadata])=>{
                              res.status(200).json({message:"Ajouté avec succès", success:resul})
                            })
                  })
          }

          //Le panier existe
          else{
            await sequelize.query("SELECT * FROM panier_item WHERE id_livre ='"+id_livre+"'")
                  .then(async ([items,metadata])=>{
                    
                    //Si le livre est déjà dans le panier, on modifie sa quantité
                    if(items.length != 0){
                        await sequelize.query("UPDATE `panier_item` SET `quantity` = quantity+'"+ quantite +"' WHERE `id_item` ='"+items[0].id_item+"'")
                        .then(([success,metadata])=>{
                          res.status(200).json({message:"Ajouté avec succès", success:success})
                        }) 
                    }

                    //Si le livre n'est pas encore dans le panier on le rajoute
                    else{
                      await sequelize.query("INSERT INTO `panier_item` (`id_panier`, `id_livre`, `quantity`) VALUES ('"+results[0].id_panier+"', '"+id_livre+"', '"+quantite+"')")
                            .then(([results,metadata])=>{
                              res.status(200).json({message:"Ajouté avec succès", success:results})
                            })
                    }
                  })

            
          }
          })
    
  } catch (error) {
    res.status(500).json({message:"rendered error"})

  }
})


/** Delete a Book from the Cart */
router.delete('/panier', authenticateToken, async(req,res)=>{
  const id_livre = parseInt(req.body.idLivre)

  try {
    sequelize.authenticate()
    await sequelize.query("DELETE FROM `panier_item` WHERE `id_livre` ='"+id_livre+"'")
          .then(([results,metadata])=>{
            res.status(200).json(results)
          })
  } catch (error) {
    res.status(500).json({message:"rendered error"})
  }
})

/** Validate Cart */
router.delete('/validate', authenticateToken, async(req,res)=>{

  try {
    await sequelize.query("SELECT * FROM panier WHERE user_id ='"+req.user.id+"'")
          .then(async([results,metadata])=>{

            await sequelize.query("SELECT livre.id_livre AS id_livre,livre.titre AS titre,livre.genre AS genre,livre.image AS image,panier.id_panier AS id_panier,quantity,user_id,date_creation"+ 
            " FROM " +
            "(panier_item JOIN panier ON panier_item.id_panier=panier.id_panier) JOIN livre ON livre.id_livre = panier_item.id_livre WHERE user_id = '"+req.user.id+"'")
            .then(async ([items,metadata])=>{
              
              //Update the quantities in the database
              items.forEach(async (item) => {
                await sequelize.query("UPDATE `livre` SET `quantite` = quantite-'"+item.quantity +"' WHERE `id_livre` ='"+item.id_livre+"'")
              });
              await sequelize.query("DELETE FROM `panier_item` WHERE `id_panier` ='"+results[0].id_panier+"'")
                    .then(([results,metadata])=>{
                       res.status(200).json({message:"Validé avec Succès"})
                    })
            })

          })
  } catch (error) {
    res.status(500).json({message:"rendered error"})
  }
})


/*********************************************************************
 *                                                                   *
 *                 BIBLIOTHÈQUE                                      *
 * *******************************************************************/


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
  const quantite = parseInt(req.body.quantite)
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

/** Delete a Book from the library */
router.delete('/books', authenticateToken, async(req,res)=>{
    const id_livre = parseInt(req.body.idLivre)

    try {
      sequelize.authenticate()
      await sequelize.query("DELETE FROM `livre` WHERE `livre`.`id_livre` ='"+id_livre+"'")
            .then(([results,metadata])=>{
              res.status(200).json(results)
            })
    } catch (error) {
      res.status(500).json({message:"rendered error"})
    }

})


/*********************************************************************
 *                                                                   *
 *                 JWT AUTHENTIFICATION                              *
 * *******************************************************************/

/** Middleware to authenticate user with JWT and enable access to resources */
function authenticateToken(req,res,next){
  //const authHeader = req.headers['authorization']
  //const token =  authHeader && authHeader.split(' ')[1]
  token = req.session.user.accessToken
  if (token == null) return res.sendStatus(401) //UnAuthenticated

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err,user)=>{
      if(err) return res.sendStatus(403) //Forbidden
      req.user = user
      next()
  })
}


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

















module.exports = router