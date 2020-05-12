const express = require( "express" )
const bcrypt = require( "../node_modules/bcryptjs" )
const jwt = require( "../node_modules/jsonwebtoken" )
const users = require( "../users/users-model" )
const restrict = require( "../middleware/restrict" )

const router = express.Router()

router.post( "/register", async ( req, res, next ) => {
  try {
    const { username } = req.body
    const user = await users.findBy( { username } ).first()

    if( user ) {
      return res.status( 409 ).json( {
        message: "Username is already taken"
      } )
    }

    res.status( 201 ).json( await users.add( req.body ) )
  } catch ( err ) {
    next( err )
  }
} )

router.post( "/login", async ( req, res, next ) => {
const authErr = {
  message: "Invalid Credentials"
}

  try {
    const user = await users.findBy( { username: req.body.username } ).first()

    const passwordValid = await bcrypt.compare( req.body.password, user.password )
    if ( !passwordValid ) {
      return res.status( 401 ).json( authErr )
    }

    const tokenPayload = {
      userId: user.id
    }

    res.cookie( "token", jwt.sign( tokenPayload, process.env.JWT_SECRET ) )
    res.json( {
      message: `Welcome ${ user.username }`
    } )
  } catch ( err ) {
    next( err )
  }
} )
module.exports = router