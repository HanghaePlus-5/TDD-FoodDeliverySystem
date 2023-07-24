import { PrismaClient } from '@prisma/client';

export const clearDatabase = async (client: PrismaClient) => {
  const reviewCount = await client.review.count();
  if (reviewCount > 0) await client.review.deleteMany();

  const favouriteCount = await client.favourite.count();
  if (favouriteCount > 0) await client.favourite.deleteMany();

  const paymentCount = await client.payment.count();
  if (paymentCount > 0) await client.payment.deleteMany();

  const orderItemCount = await client.orderItem.count();
  if (orderItemCount > 0) await client.orderItem.deleteMany();

  const orderCount = await client.order.count();
  if (orderCount > 0) await client.order.deleteMany();

  const menuCount = await client.menu.count();
  if (menuCount > 0) await client.menu.deleteMany();

  const storeCount = await client.store.count();
  if (storeCount > 0) await client.store.deleteMany();

  const userCount = await client.user.count();
  if (userCount > 0) await client.user.deleteMany();
};
