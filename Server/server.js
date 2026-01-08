const http = require( 'http' );
const fs = require( 'fs' );
const server = http.createServer( ( req, res ) => {
      let filepath = '';
      switch(req.url){
            case '/':
                  filepath = './index.html';
                  break;
            case '/about':
                  filepath = './about.html';
                  break;
            case '/product':
                  filepath = './product.html';
                  break;
            case '/blog':
                  filepath = './blog.html';
                  break;
            default:
                  filepath = './notfound.html';
                  break;
      }
      let result = fs.readFileSync( filepath, 'utf8');
      res.end(result);
} );
server.listen( 8000, ( err ) => {
      if ( err ) {
            console.log(err);
            return;
      }
      console.log( "Server is start at http://localhost:8000" );
} ); 