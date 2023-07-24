/* eslint-disable */
import { Prisma, PrismaClient } from '@prisma/client';

import { MenuStatus, StoreStatus, StoreType, UserType } from 'src/types';
import { clearDatabase } from 'src/utils/clearDatabase';

export const init = async (client: PrismaClient) => {
  await clearDatabase(client);

  const userCount = await client.user.count();
  if (userCount === 0) {
    console.log('user is empty... creating users');
    for (let i = 0; i < 10; i++) {
      const data = { ...userTemplate };
      data.email = `test${i}@test.com`;
      data.name = `test${i}`;
      data.type = i > 5 ? UserType.BUSINESS : UserType.CUSTOMER;

      await client.user.create({ data });
    }
  }

  const users = await client.user.findMany();
  console.log('users: ', users);

  const storeCount = await client.store.count();
  if (storeCount === 0) {
    console.log('store is empty... creating stores');
    for (const user of users) {
      if (user.type === UserType.BUSINESS) {
        const data = { ...storeTemplate };
        data.name = `${user.name}'s store`;
        data.userId = user.userId;
        data.businessNumber = `123-456-789${user.userId}`;
        await client.store.create({ data });
      }
    }
  }

  const stores = await client.store.findMany();
  console.log('stores: ', stores);

  const menuCount = await client.menu.count();
  if (menuCount === 0) {
    console.log('menu is empty... creating menus');
    for (const store of stores) {
      for (let i = 0; i < Math.random() * 10 + 3; i++) {
        const data = { ...menuTemplate };
        data.name = `${store.name}-${i}`;
        data.price = Math.floor(Math.random() * 100) * 100;
        data.storeId = store.storeId;
        await client.menu.create({ data });
      }
    }
  }

  const menus = await client.menu.findMany();
  console.log('menus: ', menus.map((menu) => menu.name));
};

/**
 * models
 * User
 * Store
 * Menu
 * Order
 * OrderItem
 * Payment
 * Review
 * Favourite
 */

const userTemplate: Prisma.UserCreateInput = {
  email: '',
  password: 'qwe1234',
  name: '',
  type: UserType.CUSTOMER,
};

// const storeTemplate: Prisma.StoreCreateInput = {
const storeTemplate: Prisma.StoreUncheckedCreateInput = {
  name: '',
  address: '',
  businessNumber: '',
  closingTime: 0,
  cookingTime: 30,
  openingTime: 12,
  phoneNumber: '010-1234-5678',
  postalNumber: '12345',
  type: StoreType.CAFE,
  status: StoreStatus.OPEN,
  userId: 1,
};

const menuTemplate: Prisma.MenuUncheckedCreateInput = {
  name: '',
  price: 0,
  storeId: 1,
  inventory: 100,
  status: MenuStatus.OPEN,
};

/* eslint-disable */