const express = require( 'express' );
const server = express();

server.set( 'view engine', 'ejs' );
server.use( express.urlencoded( { extended: true } ) );

let students = [];

// HOME + LIST
server.get( "/", ( req, res ) => {
      res.render( "index", { students } );
} );

// ADD STUDENT
server.post( "/add-student", ( req, res ) => {
      students.push( req.body );
      res.redirect( "/" );
} );

// DELETE STUDENT
server.get( "/delete-student/:id", ( req, res ) => {
      let id = req.params.id;
      students = students.filter( student => student.id != id );
      res.redirect( "/" );
} );

// EDIT PAGE
server.get( "/edit-student/:id", ( req, res ) => {
      let id = req.params.id;
      let record = students.find( student => student.id == id );
      res.render( "editStudent", { student: record } );
} );

// UPDATE STUDENT
server.post( "/update-student", ( req, res ) => {
      let { id, name, email, course } = req.body;

      let index = students.findIndex( student => student.id == id );
      students[ index ] = { id, name, email, course };

      res.redirect( "/" );
} );

server.listen( 8080, () => {
      console.log( "Server Start at http://localhost:8080" );
} );
