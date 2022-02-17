const express = require('express');
const { redirect } = require('express/lib/response');
const app = express();
const { db, syncAndSeed, modules: { Movie, Studio } }= require('./db');


const setup = async() => {
    await db.authenticate();
    await syncAndSeed();
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log(`listening on port ${port}`);
    })
};

setup();

app.get('/', (req, res) => res.redirect('/movies'));

app.get('/movies', async(req, res, next) => {
    try{
        const movies = await Movie.findAll({ include: [Studio] });
        const html = (`
        <html>
        <head>
            <title>My Favorite Movies</title>
        </head>
            <body>
                <h1>My Favorite Movies</h1>
                <div>
                    <ul>
                    ${movies.map(
                        (movie) =>
                        `<li>${movie.name} 
                        <a href='/studios/${movie.studioId}'>${movie.studio.name}</a>
                        </li>`
                    ).join('')}
                    </ul>
                </div>
            </body>
        </html>
        `);
        res.send(html);
    }
    catch(ex){
        next(ex);
    }
});

app.get('/studios/:id', async(req, res, next) => {
    try{
        //const studio = req.params.studio;
        const studio = await Studio.findByPk(req.params.id, {
            include: [ Movie ]
        });
        const html = (`
        <html>
        <head>
            <title>My Favorite Movies</title>
        </head>
            <body> 
                <a href='/movies'>My Fav Movies List</a>
                <div>
                    ${studio.movies.map(
                        (movie) =>
                        `<h1> ${studio.name.toUpperCase()} MOVIES</h1>
                            <ol>
                                <li>${movie.name}</li>
                             </ol>`
                    ).join('')}
                </div>
            </body>
        </html>
        `);
        res.send(html);
    }
    catch(ex){
        next(ex);
    }
});