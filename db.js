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
    const marvel = await Studio.create({name: 'Marvel'});
    const dc = await Studio.create({name: 'DC'});
    await Movie.create({name: 'Black Panther', studioId: marvel.id });
    await Movie.create({name: 'The Batman', studioId: dc.id});
}
 


module.exports = {
    db,
    syncAndSeed,
    modules: {
    Movie,
    Studio
    }
};