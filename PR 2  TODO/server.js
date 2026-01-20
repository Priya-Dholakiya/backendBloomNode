const express = require( 'express' );
const app = express();

// Middleware
app.use( express.urlencoded( { extended: true } ) );
app.set( 'view engine', 'ejs' );

// Dummy Database
let tasks = [];

// HOME
app.get( '/', ( req, res ) => {
    res.render( 'index', { tasks } );
} );

// ADD TASK
app.post( '/addtask', ( req, res ) => {
    const newTask = {
        id: Date.now(),
        task: req.body.task,
        timeout: req.body.timeout,
        status: 'pending' // pending / loved / important / done
    };
    tasks.push( newTask );
    res.redirect( '/' );
} );

// DELETE TASK
app.get( '/deletetask/:id', ( req, res ) => {
    tasks = tasks.filter( t => t.id != req.params.id );
    res.redirect( '/' );
} );

// MARK AS LOVED
app.get( '/favtask/:id', ( req, res ) => {
    tasks = tasks.map( t => t.id == req.params.id ? { ...t, status: 'loved' } : t );
    res.redirect( '/' );
} );

// MARK AS IMPORTANT
app.get( '/importanttask/:id', ( req, res ) => {
    tasks = tasks.map( t => t.id == req.params.id ? { ...t, status: 'important' } : t );
    res.redirect( '/' );
} );

// MARK AS COMPLETED
app.get( '/completetask/:id', ( req, res ) => {
    tasks = tasks.map( t => t.id == req.params.id ? { ...t, status: 'done' } : t );
    res.redirect( '/' );
} );

// SERVER
app.listen( 8049, () => console.log( '🌸 Server running at http://localhost:8049' ) );
