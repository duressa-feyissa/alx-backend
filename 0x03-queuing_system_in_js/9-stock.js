import express from 'express';
import redis from 'redis';
import { promisify } from 'util';

const client = redis.createClient();
const redisGet = promisify(client.get).bind(client);

const app = express();
const port = 1245;

const listProducts = [
    {
        itemId: 1,
        itemName: 'Suitcase 250',
        price: 50,
        initialAvailableQuantity: 4,
    },
    {
        itemId: 2,
        itemName: 'Suitcase 450',
        price: 100,
        initialAvailableQuantity: 10,
    },
    {
        itemId: 3,
        itemName: 'Suitcase 650',
        price: 350,
        initialAvailableQuantity: 2,
    },
    {
        itemId: 4,
        itemName: 'Suitcase 1050',
        price: 550,
        initialAvailableQuantity: 5,
    },
];

function getItemById(id) {
    return listProducts.filter((item) => item.itemId === id)[0];
}

client.on('error', (error) => {
    console.log(`Redis client not connected to the server: ${error.message}`);
});

client.on('connect', () => {
    console.log('Redis client connected to the server');
});

function reserveStockById(itemId, stock) {
    client.set(`item.${itemId}`, stock);
}

async function getCurrentReservedStockById(itemId) {
    const stock = await redisGet(`item.${itemId}`);
    return stock;
}


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

app.get('/list_products', (req, res) => {
    res.json(listProducts);
});

app.get('/list_products/:itemId', async (req, res) => {
    const itemId = Number(req.params.itemId);
    const item = getItemById(itemId);

    if (!item) {
        res.json({status: 'Product not found'});
        return;
    }
    
    // check if stock exists in redis and set current quantity to current stock
    // else the current quantity is the initial available quantity
    const currentStock = await getCurrentReservedStockById(itemId);
    if (!currentStock) {
        await reserveStockById(itemId, item.initialAvailableQuantity);
        item.currentQuantity = item.initialAvailableQuantity;
    } else {
        item.currentQuantity = currentStock;
    }
    res.json(item);
});


app.get('/reserve_product/:itemId', async (req, res) => {
    const itemId = Number(req.params.itemId);
    const item = getItemById(itemId);

    if (!item) {
        res.json({ status: 'Product not found' });
        return;
    }

    let currentStock = await getCurrentReservedStockById(itemId);
    if (currentStock === null) currentStock = item.initialAvailableQuantity;

    if (currentStock <= 0) {
        res.json({status: 'Not enough stock available', itemId});
        return;
    }

    reserveStockById(itemId, Number(currentStock) - 1);

    res.json({status: 'Reservation confirmed', itemId});
});
