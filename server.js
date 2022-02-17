const express = require('express');
const { redirect } = require('express/lib/response');
const app = express();
const { db, syncAndSeed, modules: { Movie, Studio } }= require('./db');
const methodOverride = require('method-override');

const setup = async() => {
    await db.authenticate();
    await syncAndSeed();
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log(`listening on port ${port}`);
    })
};

setup();

app.use(express.urlencoded({ extended: false}));
app.use(methodOverride('delete'));
app.get('/', (req, res) => res.redirect('/movies'));

app.delete('/movies/:id', async (req, res, next) => {
    try{
        const movie = await Movie.findByPk(req.params.id);
        await movie.destroy();
        //console.log(movie);
        //res.send(movie)
        res.redirect(`/studios/${movie.studioId}`);
    }
    catch(ex){
        next(ex);
    }
});

app.post('/movies', async(req, res, next)=> {
    try{
        const movie = await Movie.create(req.body);
        res.redirect(`/studios/${movie.studioId}`);
    }
    catch(ex){
        next(ex);
    }
});

app.get('/movies', async(req, res, next) => {
    try{
        const movies = await Movie.findAll({ include: [Studio] });
        const studios = await Studio.findAll();
        const options = await studios.map( (studio) => {
            return `<option value= '${studio.id}'>
                    ${studio.name}
                    </option>`;
        }).join('');
        const html = (` 
        <html>
        <head>
            <title>My Favorite Movies</title>
        </head>
            <body>
                <h1>My Favorite Movies</h1>
                <form method = 'POST'>
                    <input name = 'name' placeholder = 'movie name' />
                    <select name = 'studioId'>
                        ${ options }
                    </select>
                    <button>Add Movie</button>
                </form>
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
                <h1> ${studio.name.toUpperCase()} MOVIES</h1>
                <div>
                    ${studio.movies.map(
                        (movie) =>
                        ` <ul>
                            <li>${movie.name} <form method='POST' action='/movies/${movie.id}?delete=delete'> <button> Delete Movie</button> </form> </li>
                        </ul>`
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