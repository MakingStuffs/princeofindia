/* global require __dirname console module*/
const path = require('path');

module.exports = function(app, compiler) {

    app.get('/offers', (req, res) => {
        compiler.outputFileSystem.readFile(path.resolve(__dirname, '../../dist/', 'offers.html'), (err, result) => {
            if (err) {
                console.log(err)
            } else {
                res.set('content-type', 'text/html')
                res.send(result)
                res.end()
            }
        });
    });
    
    app.get('/menu', (req, res) => {
        compiler.outputFileSystem.readFile(path.resolve(__dirname, '../../dist/', 'menu.html'), (err, result) => {
            if (err) {
                console.log(err)
            } else {
                res.set('content-type', 'text/html')
                res.send(result)
                res.end()
            }
        });
    });

    app.get('/about', (req, res) => {
        compiler.outputFileSystem.readFile(path.resolve(__dirname, '../../dist/', 'about.html'), (err, result) => {
            if (err) {
                console.log(err)
            } else {
                res.set('content-type', 'text/html')
                res.send(result)
                res.end()
            }
        });
    });

    app.get('/takeout', (req, res) => {
        compiler.outputFileSystem.readFile(path.resolve(__dirname, '../../dist/', 'takeout.html'), (err, result) => {
            if (err) {
                console.log(err)
            } else {
                res.set('content-type', 'text/html')
                res.send(result)
                res.end()
            }
        });
    });
}