let ejs = require('ejs');
const express = require('express');
const path = require('path');
const app = express();
app.use(express.urlencoded({ extended: true }));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

const cart = [];

app.get('/products', (req, res)=>{
    res.render('products');
})
app.post('/add-to-cart', (req, res)=>{
    const product = req.body.product; 
    const price = parseFloat(req.body.price);

    cart.push({
        name: product,
        price: price, 
    })

    res.redirect('/products');
})
app.post('/remove-from-cart', (req, res) => {
    const productToRemove = req.body.product;
    const priceToRemove = req.body.price;
    
    const indexToRemove = cart.findIndex(item => 
        item.name === productToRemove && item.price == priceToRemove
    );
    
    if (indexToRemove !== -1) {
        cart.splice(indexToRemove, 1);
    }
    
    res.redirect('/cart');
});

app.get('/cart', (req, res)=>{
    res.render('cart', {cart: cart });
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})
