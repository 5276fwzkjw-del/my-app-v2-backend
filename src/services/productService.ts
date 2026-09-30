import { db } from "../prisma/db";

export const addingProduct = async ({
  name,
  description,
  price,
  inventory_count,
  category,
}: any) => {
  const count = Number(inventory_count);
  const cleanName = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  const ExistingProduct = await db.orm.public.Products.where({
    name: name,
  }).first();
  if (ExistingProduct) {
    //i know i should be checking with the id, but i didnt put a uniq(name,or id) so let me check to avoid 5+ items
    const product = await db.orm.public.Products.where({
      name: cleanName,
    }).update({
      inventory_count: ExistingProduct.inventory_count + count,
    });
    return product;
  }
  const product = await db.orm.public.Products.create({
    name: cleanName,
    description: description,
    price: price,
    inventory_count: count,
    category,
  });
  return product;
};
export const gettingProducts = async () => {
  const products = await db.orm.public.Products.all();
  return products;
};
export const creatingCart = async ({ user, productId }: any) => {
  const cart = await db.orm.public.Cart.upsert({
    create: { user_id: user.id },
    update: {},
    conflictOn: {
      user_id: user.id,
    },
  });
  const existingItem = await db.orm.public.Cart_items.where({
    cart_id: cart.id,
    product_id: productId,
  }).first();
  if (existingItem) {
    return await db.orm.public.Cart_items.where({ id: existingItem.id }).update(
      { quantity: existingItem.quantity + 1 },
    );
  }
  else{
    await db.orm.public.Cart_items.create({
    cart_id: cart.id,
    product_id: productId,
    quantity: 1,
    });
  }
  return { cart, existingItem };
};
export const ordering = async ({shipping_address,user}: any) => {

    const cart= await db.orm.public.Cart.where({user_id:user.id}).first();
    //am not checking if the cart exists or,
    if(!cart){
        return []
    }
    const cart_item = await db.orm.public.Cart_items.where({cart_id:cart.id}).all();
    if(cart_item.length ===0){
        return []
    }
    let total= 0.0;
    let orderItem = [];
    for(const item of cart_item){
        const product = await db.orm.public.Products.where({id:item.product_id}).first();
        if(!product){
            continue
        }
        const price = Number(product.price);
        const quantity=item.quantity;
        total+=price * quantity;
        orderItem.push({
            product_id:product.id,
            quantity:quantity,
            price:product.price
        });
    };
    const order = await db.orm.public.Orders.create({
        user_id:user.id,
        payment_status:'Pending',
        total_amount:total.toString(),
        shipping_address
    });
    for (const item of orderItem){
        await db.orm.public.Order_items.create({
            order_id:order.id,
            product_id:item.product_id,
            quantity:item.quantity,
            price_per_item:item.price
        })
    }
    for(const item of cart_item){
        await db.orm.public.Cart_items.where({id:item.id}).delete();
    }
    return {
        order,
        item:orderItem
    }
   
};
export const gettingCart=async(user:any)=>{
    const cart = await db.orm.public.Cart.where({user_id:user.id}).first();
    if(!cart){
        return [];
    }
    //let get our cartItems
    const cart_item = await db.orm.public.Cart_items.where({cart_id:cart.id}).all();
    //i learnt since we its an object, we loop throw it so that we get each item
    //and to get the item we loop throw Products
    const results=[];
    for(const item of cart_item){
        const product = await db.orm.public.Products.where({id:item.product_id}).first();
        if(!product){
            continue
        }
        results.push({
            ...item, //we need the cart_item
            product
        })
    }
    return results
};
export const gettingOrder = async(user:any)=>{
     const order = await db.orm.public.Orders.where({user_id:user.id}).all();
    if(order.length===0){
       return [];
    }
    const results=[];
    for(const orders of order){
        const orderItems = await db.orm.public.Order_items.where({order_id:orders.id}).all();
        const item =[];
        for(const prod of orderItems){
            const product =await db.orm.public.Products.where({id:prod.product_id}).first();
            item.push({
                ...prod,
                product
            });
        }
        
        results.push({
            order:orders,
            items:item
        })
    }
    return results
};
export const updatingQty=async({increase,decrease,product,user}:any)=>{
    const cart =await db.orm.public.Cart.where({user_id:user.id}).first();
    if(!cart){
        return [];
    }
    const cart_item = await db.orm.public.Cart_items.where({cart_id:cart.id,
        product_id:product}).first();
    if(!cart_item){
        return {
            removed:true,
            product:product
        };
    }
    if(increase){
        const updatedItem = await db.orm.public.Cart_items.where({id:cart_item.id}).update({
            quantity:cart_item.quantity + 1
        });
        return updatedItem
    }
    if(decrease){
        if(cart_item.quantity===1){
            await db.orm.public.Cart_items.where({id:cart_item.id}).delete();
            return {
                removed:true,
                product:product
            };
        }
        const updatedItem = await db.orm.public.Cart_items.where({id:cart_item.id}).update({
            quantity:cart_item.quantity - 1
        });
        return updatedItem;

    };
    throw new Error('No quantity action provided');
};
export const deleting=async({product,user}:any)=>{
    const cart = await db.orm.public.Cart.where({user_id:user.id}).first();
    if(!cart){
        throw new Error('cart not found');
    }
    const cart_item = await db.orm.public.Cart_items.where({cart_id:cart.id,product_id:product}).delete();
    if(!cart_item){
        throw new Error(' item not found');
    }
    return cart_item
};
export const  addingAdress=async({user,title,fullName,phone,streetAddress,city,country}:any)=>{
    const address = await db.orm.public.ShippingAddress.where({user_id:user.id}).create({
        user_id:user.id,
        title:title,
        full_name:fullName,
        phone:phone,
        address:streetAddress,
        city:city,
        country:country,
        isDefault:false
    });
    return address;

};
export const gettingAddress=async(user:any)=>{
    const address = await db.orm.public.ShippingAddress.where({user_id:user.id}).all();//why all the user can have more than one address
    return address;

};
export const updatingAdd=async({user,id}:any)=>{
    const selectedAddress = await db.orm.public.ShippingAddress.where({id:id,user_id:user.id}).first();
    if(!selectedAddress){
        throw new Error('Sorry no shipping Address here')
    }
    const addresses = await db.orm.public.ShippingAddress.where({user_id:user.id}).all();
    for (const address of addresses){
        await db.orm.public.ShippingAddress.where({id:address.id}).update({
            isDefault:false
        })
    }
    const updated = await db.orm.public.ShippingAddress.where({id:selectedAddress.id}).update({
        isDefault:true
    });
    return updated;
};
export const deletingAdd=async({user,id}:any)=>{
    const address = await db.orm.public.ShippingAddress.where({
        id:id,
        user_id:user.id
    }).delete();
    return address
}