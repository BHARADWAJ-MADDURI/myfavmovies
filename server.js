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
                        <a href='/studios/${movie.studio.name}'>${movie.studio.name}</a>
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

app.get('/studios/:studio', async(req, res, next) => {
    try{
        const studio = req.params.studio;
        const movies = await Movie.findAll({
            where: { studio }
        });
        console.log(movies)
        // const html = (`
        // <html>
        // <head>
        //     <title>My Favorite Movies</title>
        // </head>
        //     <body>
        //         <h1>My Favorite Movies</h1>
        //         <a href='/movies'>back</a>
        //         <div>
        //             <ul>
        //             ${movies.map(
        //                 (movie) =>
        //                 `<li>${movie.name} 
        //                 <a href='/studio/${movie.studio.name}'>${movie.studio.name}</a>
        //                 </li>`
        //             ).join('')}
        //             </ul>
        //         </div>
        //     </body>
        // </html>
        // `);
        res.send(movies);
    }
    catch(ex){
        next(ex);
    }
});