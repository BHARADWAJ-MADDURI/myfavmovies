const { STRING, Sequelize } = require('sequelize');
const db = new Sequelize(process.env.DATABASE_URL ||'postgres://localhost/movielist_db');


const Movie = db.define('movies', {
    name: {
        type: STRING,
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: true
        }
    }
});

const Studio = db.define('studios', {
    name: {
        type: STRING,
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: true
        }
    }
});

Movie.belongsTo(Studio);
Studio.hasMany(Movie);


const syncAndSeed = async() => {
    await db.sync({ force: true });
    const marvel = await Studios.create({name: 'marvel'});
    const dc = await Studios.create({name: 'dc'});
    await Movies.create({name: 'Black Panther', studioId: marvel.id });
    await Movies.create({name: 'The Batman', studioId: dc.id});
}
 


module.exports = {
    db,
    syncAndSeed,
    modules: {
    Movie,
    Studio
    }
};