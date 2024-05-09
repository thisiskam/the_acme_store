const { client,
        createTables,
        createUser,
        createProduct,
        createFavorite,
        fetchUsers,
        fetchProducts,
        fetchFavorites,
        deleteFavorite
 } = require('./db')
const express = require('express')
const app = express()
require('dotenv').config()
app.use(require('morgan')('dev'))
app.use(express.json())



app.get('/api/users', async (req, res, next) => {
    try {
        res.send(await fetchUsers())
    }catch(error){
        next(error)
    }
})

app.get('/api/products', async (req, res, next) => {
    try {
        res.send(await fetchProducts())
    }catch(error){
        next(error)
    }
})

app.get('/api/users/:id/favorites', async (req, res, next)=> {
    try {
        res.send(await fetchFavorites(req.params.id))
    }catch(error) {
        next(error)
    }
})

app.post('/api/users/:id/favorites', async(req, res, next)=> {
    try {
      res.status(201).send(await createFavorite({ user_id: req.params.id, product_id: req.body.product_id}));
    }
    catch(error){
      next(error);
    }
  });

app.delete('/api/users/:userId/favorites/:id', async(req, res, next)=> {
    try {
      await deleteFavorite({ id: req.params.id, user_id: req.params.userId });
      res.sendStatus(204);
    }
    catch(error){
      next(error);
    }
  });

const init = async () => {
    // CONTECTED TO PORT
    await client.connect()
    console.log('connected');

    // TABLES CREATED
    await createTables()
    console.log('tables created');

    // CREATE USERS AND PRODUCTS
    const [skyler, chelsea, max, kiara, kameron, megan, nate, surfboard, snowboard, skateboard, volleyball, darts, kite] = await Promise.all([
        createUser({username:'skyler', password:'ollie4'}),
        createUser({username:'chelsea', password:'BuddyBalls'}),
        createUser({username:'max', password:'KiaraIsNice'}),
        createUser({username:'kiara', password:'dancedance'}),
        createUser({username:'kameron', password:'boarderrr4'}),
        createUser({username:'megan', password:'iLoveMichi'}),
        createUser({username:'nate', password:'yewyew'}),
        createProduct({name: 'surfboard'}),
        createProduct({name: 'snowboard'}),
        createProduct({name: 'skateboard'}),
        createProduct({name: 'volleyball'}),
        createProduct({name: 'darts'}),
        createProduct({name: 'kite'})
    ])

    console.log(volleyball.id);

    const favorites = await Promise.all([
        createFavorite({user_id:skyler.id, product_id:volleyball.id}),
        createFavorite({user_id:chelsea.id, product_id:snowboard.id}),
        createFavorite({user_id:max.id, product_id:skateboard.id}),
        createFavorite({user_id:kiara.id, product_id:kite.id}),
        createFavorite({user_id:kameron.id, product_id:darts.id}),
        createFavorite({user_id:megan.id, product_id:surfboard.id}),
        createFavorite({user_id:nate.id, product_id:skateboard.id})
    ])

    await deleteFavorite({user_id:chelsea.id, id:favorites[1].id})

    // LISTENING
    const port = process.env.PORT
    app.listen(port, console.log(`listening on port ${port}`))
}

init()