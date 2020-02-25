'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const { stock, customers } = require("./data/promo.js");

const PORT = process.env.PORT || 8000;
let toDoList = [];

const handleHome = (req, res) =>{
    let title = 'To do list'
    res.render('pages/home', {title: title, toDoList: toDoList})
}
const handleForm = (req, res) => {
    const { item } = req.body;
    toDoList.push(item);
    res.redirect('/');
}
const handleOrderCon = (req, res)=>{
    res.send('order went through!!!!')
}
console.log(stock.shirt)
const checkStock = (item, size)=>{
    console.log(stock.item)
    if (item === 'shirt'){
        if (stock['shirt'][size] > 0){
            return false
        }
    } else if (stock[item] > 0 ){
        return false
    }
    return true;
}
const handleOrder = (req, res) =>{
    const truey = customers.find(customer=>{ 
        return (customer.givenName.toLowerCase() === req.body.givenName.toLowerCase() && 
        customer.address.toLowerCase() === req.body.address.toLowerCase() )});
        
    if (truey){
        res.send({error: 550})
        return console.log('error 550 existing customer')
        } else if (req.body.country.toLowerCase() !== 'canada'){
            res.send({error: 650})
            return console.log('error 650 Outside of delivery zone')
        } else if(checkStock(req.body.order, req.body.size)){
            res.send({error: 450})
            console.log('error 450 out of stock')
        } else {
            res.send({status: 'success'})
            return
}
}

express()
    .use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    })
	.use(morgan('tiny'))
	.use(express.static('public'))
    .use(bodyParser.json())
    .use(express.urlencoded({extended: false}))
    .set('view engine', 'ejs')

    // endpoints
    .post('/order', handleOrder)
    .get('/order-confirmation', handleOrderCon)
    .get('/', handleHome)
    .post('/form-data', handleForm)
    .get('*', (req, res) => res.send('Dang. 404.'))
    .listen(PORT, () => console.log(`Listening on port ${PORT}`));