const jwt = require( "jsonwebtoken" )


function restrict( dept ) {
  return async ( req, res, next ) => {
    const authErr = {
      message: "Invalid Credentials"
    }

    try{
      const token = req.cookies.token
      if ( !token ) {
        return res.status( 401 ).json( authErr )
      }

      jwt.verify( token, process.env.JWT_SECRET, ( err ) => {
        if ( err ) {
          return res.status( 401 ).json( authErr )
        }

        next()
      } )
    } catch ( err ) {
      next( err )
    }
  }
}

module.exports = restrict