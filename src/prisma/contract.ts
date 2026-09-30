import { defineContract, model } from "@prisma/orm-postgres/contract-builder";

export const contract = defineContract({}, ({ field, model, rel }) => {
  const User = model("User", {
    fields: {
      id: field.id.uuidv7String().unique(),
      email: field.text().unique(),
      name: field.text().optional(),
      phone: field.text().optional(),
      password: field.text(),
      createdAt: field.temporal.createdAtString(),
      updatedAt: field.temporal.updatedAtString(),
    },
  });
  const Products = model("Products", {
    fields: {
      id: field.id.uuidv4String().unique(),
      name: field.text(),
      description: field.text(),
      price: field.decimal(),
      inventory_count: field.int(),
      category: field.text(),
      createdAt: field.temporal.createdAtString(),
      updatedAt: field.temporal.updatedAtString(),
    },
  });
  const Cart = model("Cart", {
    fields: {
      id: field.id.uuidv4String().unique(),
      user_id: field.uuidString().unique(),
      createdAt: field.temporal.createdAtString(),
      updatedAt: field.temporal.updatedAtString(),
    },
  });
  const Cart_items = model("Cart_items", {
    fields: {
      id: field.id.uuidv4String().unique(),
      cart_id: field.uuidString(),
      product_id: field.uuidString(),
      quantity: field.int(),
      addedAt: field.temporal.createdAtString(),
    },
  }).attributes(({ fields, constraints }) => ({
    uniques: [constraints.unique([fields.cart_id, fields.product_id])],
  }));
  const Orders = model("Orders", {
    fields: {
      id: field.id.uuidv4String(),
      user_id: field.uuidString(),
      payment_status: field.text(),
      total_amount: field.decimal(),
      shipping_address: field.text(),
      createdAt: field.temporal.createdAtString(),
    },
  });
  const Order_items = model("Order_items", {
    fields: {
      id: field.id.uuidv4String().unique(),
      order_id: field.uuidString(),
      product_id: field.uuidString(),
      quantity: field.int(),
      price_per_item: field.decimal(),
    },
  }).attributes(({ fields, constraints }) => ({
    uniques: [constraints.unique([fields.order_id, fields.product_id])],
  }));
  const Post = model("Post", {
    fields: {
      id: field.id.uuidv7String(),
      title: field.text(),
      content: field.text().optional(),
      authorId: field.uuidString(),
      createdAt: field.temporal.createdAtString(),
      updatedAt: field.temporal.updatedAtString(),
    },
  });
  const ShippingAddress = model("ShippingAddress", {
    fields: {
      id: field.id.uuidv4String(),
      user_id: field.uuidString(),
      full_name: field.text(),
      title:field.text(),
      phone: field.text(),
      address: field.text(),
      city: field.text(),
      country: field.text(),
      isDefault:field.boolean()
    },
  });
  return {
    models: {
      User: User.relations({
        posts: rel.hasMany(Post, { by: "authorId" }),
        customer: rel.hasMany(Orders, { by: "user_id" }),
        customerInCart: rel.hasMany(Cart, { by: "user_id" }),
        shippingAdress:rel.hasMany(ShippingAddress,{by:'user_id'})
      }),
      ShippingAddress:ShippingAddress.relations({
        user_id:rel.belongsTo(User,{from:'user_id',to:'id'})
      }),
      Products: Products.relations({
        itemOrdered: rel.hasMany(Order_items, { by: "product_id" }),
        item: rel.hasMany(Cart_items, { by: "product_id" }),
      }),
      Order_items: Order_items.relations({
        orderNumber: rel.belongsTo(Orders, { from: "order_id", to: "id" }),
        itemOrdered: rel.belongsTo(Products, { from: "product_id", to: "id" }),
      }),
      Orders: Orders.relations({
        customer: rel.belongsTo(User, { from: "user_id", to: "id" }),
      }),
      Cart_items: Cart_items.relations({
        cart: rel.belongsTo(Cart, { from: "cart_id", to: "id" }),
        item: rel.belongsTo(Products, { from: "product_id", to: "id" }),
      }),
      Cart: Cart.relations({
        customer: rel.belongsTo(User, { from: "user_id", to: "id" }),
      }),
      Post: Post.relations({
        author: rel.belongsTo(User, { from: "authorId", to: "id" }),
      }),
    },
  };
});
