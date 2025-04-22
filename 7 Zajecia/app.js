let ejs = require('ejs');
const express = require('express');
const path = require('path');
const app = express();
app.use(express.urlencoded({ extended: true }));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

const cart = [];
const ListaProduktow = [
    'Masło',
    'Chleb pszenny',
    'Mleko',
    'Ser żółty',
    'Jogurt naturalny',
    'Jajka',
    'Mąka pszenna',
    'Cukier biały',
    'Olej rzepakowy',
    'Makaron spaghetti',
    'Ryż biały',
    'Kawa ziarnista',
    'Herbata czarna',
    'Czekolada mleczna',
    'Jabłka'
];
const ceny = {
    'Masło': 8.99,
    'Chleb pszenny': 4.99,
    'Mleko': 3.99,
    'Ser żółty': 14.99,
    'Jogurt naturalny': 2.99,
    'Jajka': 9.99,
    'Mąka pszenna': 4.99,
    'Cukier biały': 5.99,
    'Olej rzepakowy': 12.99,
    'Makaron spaghetti': 6.99,
    'Ryż biały': 7.99,
    'Kawa ziarnista': 24.99,
    'Herbata czarna': 10.99,
    'Czekolada mleczna': 8.99,
    'Jabłka': 6.99
};


app.get('/', (req, res)=>{
    res.redirect('/products');
})

app.get('/products', (req, res)=>{
    res.render('products', {products: ListaProduktow, prices: ceny});
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

app.get('/filter', (req, res)=>{
    const minPrice = parseFloat(req.query.minPrice) || 0;
    const maxPrice = parseFloat(req.query.maxPrice) || Infinity;

    if(maxPrice < minPrice){
        return res.status(400).send("Największa cena ma być większa niż najmniejsza.");
    }

    let FilteredProducts = ListaProduktow.filter(product =>{
        const price = ceny[product];
        return price >= minPrice && price <= maxPrice;
    })

    res.render('products', {products: FilteredProducts, prices: ceny});
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
})
