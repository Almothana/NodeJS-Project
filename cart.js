module.exports = function Cart(oldCart) {
    this.items = oldCart.items || {} ;// to check if there old cart item to added to my cart if not defined useing empty, 0,0
    this.totalQty = oldCart.totalQty || 0;
    this.totalPrice = oldCart.totalPrice || 0;

        // add new item to the cart
    this.add = function(item, id){
        let storedItem = this.items[id];// if yes 
        if(!storedItem){// if not we creat here new storeditem and stored this in mongo 
            storedItem = this.items[id] = {item, qty: 0, price:0};
        }
        storedItem.qty++;// increase the quantity by 1
        storedItem.price = storedItem.item.price * storedItem.qty;
        this.totalQty++;// update Qty
        this.totalPrice += storedItem.item.price;

    };

    this.reduceByOne = function (id) {
        this.items[id].qty--;
        this.items[id].price -= this.items[id].item.price;
        this.totalQty--;
        this.totalPrice -= this.items[id].item.price;

        // for case is qty is 0 
        if (this.items[id].qty <= 0){
            delete this.items[id];
        }
    };
    this.addByOne = function (id) {
        this.items[id].qty++;
        this.items[id].price += this.items[id].item.price;
        this.totalQty++;
        this.totalPrice += this.items[id].item.price;
        
    };

    this.removeItem = function (id) {
        this.totalQty -= this.items[id].qty;
        this.totalPrice -= this.items[id].price;
        delete this.items[id];
    };

    // this needed to be able to output a list of my product groups
    this.generateArray = function () {
      const arr = [];
      for(const id in this.items){
          arr.push(this.items[id]);
      }  
      return arr;
    };
};