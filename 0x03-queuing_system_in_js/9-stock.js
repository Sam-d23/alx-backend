import express from 'express';
import redis from 'redis';
import { promisify } from 'util';

// Create an array of products
const listProducts = [
  { id: 1, name: 'Suitcase 250', price: 50, stock: 4 },
  { id: 2, name: 'Suitcase 450', price: 100, stock: 10 },
  { id: 3, name: 'Suitcase 650', price: 350, stock: 2 },
  { id: 4, name: 'Suitcase 1050', price: 550, stock: 5 },
];

// Redis client setup
const client = redis.createClient();
const reserveStock = promisify(client.set).bind(client);
const getReservedStock = promisify(client.get).bind(client);

// Express server setup
const app = express();
const PORT = 1245;

// Helper function to get item by ID
const getItemById = (id) => listProducts.find((item) => item.id === id);

// Reserve stock by ID
const reserveStockById = async (itemId, stock) => {
  await reserveStock(`item.${itemId}`, stock);
};

// Get current reserved stock by ID
const getCurrentReservedStockById = async (itemId) => {
  const stock = await getReservedStock(`item.${itemId}`);
  return stock ? parseInt(stock, 10) : 0;
};

// Route to list all products
app.get('/list_products', (req, res) => {
  const products = listProducts.map(({ id, name, price, stock }) => ({
    itemId: id,
    itemName: name,
    price,
    initialAvailableQuantity: stock,
  }));
  res.json(products);
});

// Route to get product by ID
app.get('/list_products/:itemId', async (req, res) => {
  const itemId = parseInt(req.params.itemId, 10);
  const product = getItemById(itemId);

  if (!product) {
    return res.status(404).json({ status: 'Product not found' });
  }

  const reservedStock = await getCurrentReservedStockById(itemId);
  res.json({
    itemId: product.id,
    itemName: product.name,
    price: product.price,
    initialAvailableQuantity: product.stock,
    currentQuantity: product.stock - reservedStock,
  });
});

// Route to reserve a product by ID
app.get('/reserve_product/:itemId', async (req, res) => {
  const itemId = parseInt(req.params.itemId, 10);
  const product = getItemById(itemId);

  if (!product) {
    return res.status(404).json({ status: 'Product not found' });
  }

  const reservedStock = await getCurrentReservedStockById(itemId);
  if (product.stock - reservedStock < 1) {
    return res.json({
      status: 'Not enough stock available',
      itemId,
    });
  }

  await reserveStockById(itemId, reservedStock + 1);
  res.json({
    status: 'Reservation confirmed',
    itemId,
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
