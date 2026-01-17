const express = require( "express" );
const app = express();

app.set( "view engine", "ejs" );
app.use( express.urlencoded( { extended: true } ) );

let tasks = [];

// HOME
app.get( "/", ( req, res ) => {
      res.render( "index", { tasks } );
} );

// ADD TASK
app.post( "/add-task", ( req, res ) => {
      tasks.push( req.body.task );
      res.redirect( "/" );
} );

// DELETE TASK
app.get( "/delete/:id", ( req, res ) => {
      tasks.splice( req.params.id, 1 );
      res.redirect( "/" );
} );

app.listen( 8080, () => {
      console.log( "Server running at http://localhost:8080" );
} );
