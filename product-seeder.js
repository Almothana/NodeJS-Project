const Product = require('../models/product');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/shopping',{ useNewUrlParser: true });// important to add mongodb://

const products = [
    
    new Product({
    imagePath :'https://datika.me/wa-data/public/shop/products/72/42/4272/images/11289/11289.970.jpg',
    title: 'NEED FOR SPEED',
    description:'Electronic Arts PS4 Need for Speed 2019.',
    price:429
}),
new Product({
    imagePath :'https://i.ytimg.com/vi/ZlAZ_YjpJQw/maxresdefault.jpg',
    title: 'Tekken 7',
    description:'Love, Revenge, fight.',
    price:249
}),
new Product({
    imagePath :'https://cdn02.nintendo-europe.com/media/images/10_share_images/games_15/nintendo_switch_4/H2x1_NSwitch_MortalKombat11_image1600w.jpg',
    title: 'Mortal Kombat 11',
    description:'MK is back better than ever. ',
    price:990
}),
new Product({
    imagePath :'https://farm8.staticflickr.com/7927/47177433891_0f3f6a7c92_b.jpg',
    title: 'Dead or Alive 6',
    description:'The renowned fighting franchise, DEAD OR ALIVE.',
    price:590
}),
new Product({
    imagePath :'https://www.elgiganten.se/image/dv_web_D180001002205423/PS4DAYSGONE/days-gone-ps4.jpg?$fullsize$',
    title: 'Days Gone',
    description:'Days Gone is an open-world action game.',
    price:599
}),
new Product({
    imagePath :'https://file-cdn.scdkey.com/product/20180615165312_scdk.jpg',
    title: 'Fifa 19',
    description:'EA SPORTS™ FIFA 19 drivs av Frostbite™*. ',
    price:349
})

];

let done= 0;
for (let i = 0; i < products.length; i++) {
    products[i].save(() => {
        done++;
        if(done === products.length){
            exit();
        }
    });
    
}

function exit(){
    mongoose.disconnect();
}
