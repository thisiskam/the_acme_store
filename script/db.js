const pg = require('pg')
const client = new pg.Client(process.env.DB_NAME || "postgress://localhost/the_acme_store")
require('dotenv').config()
const uuid = require('uuid')
const bcrypt = require('bcrypt');

const createTables = async () => {
    const SQL = /* SQL */ `
        DROP TABLE IF EXISTS favorites;
        DROP TABLE IF EXISTS products;
        DROP TABLE IF EXISTS users;
        CREATE TABLE users(
            id UUID PRIMARY KEY,
            username VARCHAR(50) UNIQUE NOT NULL,
            password VARCHAR(100)
        );
        CREATE TABLE products(
            id UUID PRIMARY KEY,
            name VARCHAR(225) UNIQUE NOT NULL
        );
        CREATE TABLE favorites(
            id UUID PRIMARY KEY,
            user_id UUID REFERENCES users(id) NOT NULL,
            product_id UUID REFERENCES products(id) NOT NULL,
            CONSTRAINT unique_favorite_user UNIQUE (product_id, user_id)
        );
    `
    return await client.query(SQL)
}

const createUser = async ({username, password}) => {
    const SQL = /* SQL */ `
        INSERT INTO users(id, username, password)
        VALUES($1,$2,$3)
        RETURNING *
    `
    const response = await client.query(SQL, [uuid.v4(), username, await bcrypt.hash(password, 5)])
    return response.rows[0]
}

const createProduct = async ({name}) => {
    const SQL = /* SQL */ `
        INSERT INTO products(id, name)
        VALUES($1,$2)
        RETURNING *
    `
    const response =  await client.query(SQL, [uuid.v4(), name])
    return response.rows[0]
}

const createFavorite = async({user_id, product_id}) => {
    const SQL = /* SQL */ `
        INSERT INTO favorites(id, user_id, product_id)
        VALUES($1,$2,$3)
        RETURNING *
    `
    const response = await client.query(SQL, [uuid.v4(), user_id, product_id])
    return response.rows[0]
}

const fetchUsers = async() => {
    const SQL = /* SQL */ `
        SELECT * FROM users;
    `
    const response =  await client.query(SQL)
    return response.rows
}

const fetchProducts = async() => {
    const SQL = /* SQL */ `
        SELECT * FROM products;
    `
    const response =  await client.query(SQL)
    return response.rows
}

const fetchFavorites = async(id) => {
    const SQL = /* SQL */ `
        SELECT * FROM favorites
        WHERE user_id = $1
    `
    const response =  await client.query(SQL, [id])
    return response.rows
}

const deleteFavorite = async({id, user_id}) => {
    const SQL = /* SQL */ `
        DELETE FROM favorites
        WHERE id= $1 AND user_id = $2
    `
    await client.query(SQL, [id, user_id])

}

module.exports = {
    client,
    createTables,
    createUser,
    createProduct,
    createFavorite,
    fetchUsers,
    fetchProducts,
    fetchFavorites,
    deleteFavorite
}