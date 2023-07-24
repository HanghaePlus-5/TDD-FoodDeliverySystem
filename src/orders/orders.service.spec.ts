import { Test, TestingModule } from '@nestjs/testing';
import { Menu, Store } from '@prisma/client';

import { PrismaModule, PrismaService } from 'src/prisma';
// import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { OrderStatus } from 'src/types/orders';

import { OrderCreateDto } from './dto/order-create.dto';
import { OrdersService } from './orders.service';

import { UserType } from 'src/types';

describe('OrdersService', () => {
  let service: OrdersService;
  let testPrisma: PrismaService;
  let user1: User;
  let user2: User;
  let store: Store;
  let menu1: Menu;
  let menu2: Menu;
  let menu3: Menu;
  let menu4: Menu;
  let menu5: Menu;
  let menu6: Menu;
  let menu7: Menu;
  let menu8: Menu;
  let menu9: Menu;
  let menu10: Menu;
  let menu11: Menu;
  let menu12: Menu;
  let sampleCreaetOrderDTO1: OrderCreateDto;
  let sampleCreaetOrderDTO2: OrderCreateDto;
  let sampleCreaetOrderDTO3: OrderCreateDto;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PrismaModule,
      ],
      providers: [
        OrdersService,
        ],
    })
      .compile();
      // .useValue(mockDeep<PrismaClient>())

    service = module.get<OrdersService>(OrdersService);
    testPrisma = module.get(PrismaService);
    // create sample user
    // user1 = await testPrisma.user.create({
    //   data:
    //     {
    //       email: 'customerUser@gmail.com',
    //       name: 'Customer Kim',
    //       password: 'qwer123123',
    //       type: UserType.CUSTOMER,
    //     },
    // });

    // user2 = await testPrisma.user.create({
    //   data:
    //     {
    //       email: 'businessUser@gmail.com',
    //       name: 'Business Kim',
    //       password: 'qwer123123',
    //       type: UserType.CUSTOMER,
    //     },

    // });

    // store = await testPrisma.store.create({
    //   data:
    //   {
    //     name: 'Sample Store',
    //     type: StoreType.KOREAN,
    //     status: StoreStatus.OPEN,
    //     businessNumber: '1234567890',
    //     phoneNumber: '010-1234-5678',
    //     postalNumber: '12345',
    //     address: 'Seoul, Korea',
    //     openingTime: 1,
    //     closingTime: 1,
    //     cookingTime: 1,
    //   },
    // });

    // menu1 = await testPrisma.menu.create({
    //   data:
    //     {
    //       storeId: store.storeId,
    //     },
    // });
    // menu2 = await testPrisma.menu.create({
    //   data:
    //     {
    //       storeId: store.storeId,
    //     },
    // });
    // menu3 = await testPrisma.menu.create({
    //   data:
    //     {
    //       storeId: store.storeId,
    //     },
    // });
    // menu4 = await testPrisma.menu.create({
    //   data:
    //     {
    //       storeId: store.storeId,
    //     },
    // });
    // menu5 = await testPrisma.menu.create({
    //   data:
    //     {
    //       storeId: store.storeId,
    //     },
    // });
    // menu6 = await testPrisma.menu.create({
    //   data:
    //     {
    //       storeId: store.storeId,
    //     },
    // });
    // menu7 = await testPrisma.menu.create({
    //   data:
    //     {
    //       storeId: store.storeId,
    //     },
    // });
    // menu8 = await testPrisma.menu.create({
    //   data:
    //     {
    //       storeId: store.storeId,
    //     },
    // });
    // menu9 = await testPrisma.menu.create({
    //   data:
    //     {
    //       storeId: store.storeId,
    //     },
    // });
    // menu10 = await testPrisma.menu.create({
    //   data:
    //     {
    //       storeId: store.storeId,
    //     },
    // });
    // menu11 = await testPrisma.menu.create({
    //   data:
    //     {
    //       storeId: store.storeId,
    //     },
    // });
    // menu12 = await testPrisma.menu.create({
    //   data:
    //     {
    //       storeId: store.storeId,
    //     },
    // });

    // sampleCreaetOrderDTO1 = {
    //   user: user1,
    //   storeId: store.storeId,
    //   orderItem: [
    //     {
    //       quantity: 2,
    //       menuId: menu1.menuId,
    //     },
    //     {
    //       quantity: 1,
    //       menuId: menu2.menuId,
    //     }, {
    //       quantity: 2,
    //       menuId: menu3.menuId,
    //     },
    //     {
    //       quantity: 1,
    //       menuId: menu4.menuId,
    //     }, {
    //       quantity: 2,
    //       menuId: menu5.menuId,
    //     },
    //     {
    //       quantity: 1,
    //       menuId: menu6.menuId,
    //     }, {
    //       quantity: 2,
    //       menuId: menu7.menuId,
    //     },
    //     {
    //       quantity: 1,
    //       menuId: menu8.menuId,
    //     }, {
    //       quantity: 2,
    //       menuId: menu9.menuId,
    //     },
    //     {
    //       quantity: 1,
    //       menuId: menu10.menuId,
    //     }, {
    //       quantity: 2,
    //       menuId: menu11.menuId,
    //     },
    //     {
    //       quantity: 1,
    //       menuId: menu12.menuId,
    //     },
    //   ],
    // };

    // sampleCreaetOrderDTO2 = {
    //   user: user2,
    //   storeId: store.storeId,
    //   orderItem: [
    //     {
    //       quantity: 1,
    //       menuId: menu3.menuId,
    //     },
    //     {
    //       quantity: 1,
    //       menuId: menu2.menuId,
    //     },
    //   ],
    // };

    // sampleCreaetOrderDTO3 = {
    //   user: user2,
    //   storeId: store.storeId,
    //   orderItem: [
    //   ],
    // };
  });

  // afterAll(async () => {
  //   const deleteOrderItem = testPrisma.orderItem.deleteMany();

  //   await testPrisma.$transaction([
  //     deleteOrderItem,
  //   ]);
  //   const deleteUser = testPrisma.user.deleteMany();
  //   const deleteMenu = testPrisma.menu.deleteMany();
  //   await testPrisma.$transaction([
  //     deleteMenu,
  //   ]);
  //   const deleteStore = testPrisma.store.deleteMany();

  //   const deleteOrder = testPrisma.order.deleteMany();

  //   await testPrisma.$transaction([
  //     deleteOrderItem,
  //     deleteOrder,
  //     deleteUser,
  //     deleteStore,

  //   ]);
  // });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // describe('Order Creation', () => {
  //   describe('Order Creates normally', () => {
  //     it('should create an order', async () => {
  //       const result = await service.createOrder(sampleCreaetOrderDTO1);
  //       expect(result).toBe(true);
  //     });

  //     it('should inform payment module by calling processPayment function', () => {
  //       const serviceMock = jest.spyOn(service, 'callPaymentMethod');
  //       const testOrder: Order = {
  //         orderId: 12345,
  //         userId: 9876,
  //         storeId: 54321,
  //         createdAt: new Date('2023-06-28T10:30:00Z'),
  //         updatedAt: new Date('2023-06-29T15:45:00Z'),
  //         status: OrderStatus.PAYMENT_PROCESSING,
  //       };

  //       service.processPayment(testOrder);
  //       expect(serviceMock).toBeCalledWith(testOrder);
  //     });
  //   });
  //   describe('Order General Validation Check', () => {
  //     it('should return true if customer ueser tries to make an order', () => {
  //       const serviceMock = jest.spyOn(service, 'verifyType');
  //       const result = service.isUserTypeCustomer(user1.userId);
  //       expect(serviceMock).toBeCalledWith(user1.userId);
  //     });

  //     it('should return false if business ueser tries to make an order', () => {
  //       const serviceMock = jest.spyOn(service, 'verifyType');
  //       const result = service.isUserTypeCustomer(user2.userId);
  //       expect(serviceMock).toBeCalledWith(user2.userId);
  //     });

  //     it('should return true if a user tries to make an order from a existing store', async () => {
  //       const { storeId } = store;
  //       const result = await service.isValidStore(storeId);
  //       expect(result).toBe(true);
  //       // expect(() => {
  //       //   service.addOrder(order1, businessUser);
  //       // }).toThrowError('Only customers are allowed to add orders.');
  //     });

  //     it('should return error if a user tries to make an order of a non-existing item', async () => {
  //       const storeId = store.storeId - 1;
  //       await expect(service.isValidStore(storeId)).rejects.toThrowError();
  //     });
  //   });
  // });

  // describe('Order Business Validation Check', () => {
  //   it('should return false if a user tries to make an order of more than 10 item', () => {
  //     const result = service.isOrderItemCountInRange(sampleCreaetOrderDTO1.orderItem);
  //     expect(result).toBe(false);
  //   });

  //   it('should return false if a user tries to make an order of 0 item', () => {
  //     const result = service.isOrderItemCountInRange(sampleCreaetOrderDTO3.orderItem);
  //     expect(result).toBe(false);
  //   });

  //   it('should return true if a user have on going order', async () => {
  //     const order1 = await testPrisma.order.create({
  //       data: {
  //         userId: user1.userId,
  //         storeId: store.storeId,
  //       },
  //     });
  //     console.log(order1);
  //     const result = await service.hasOngoingOrder(user1.userId);
  //     expect(result).toBe(true);
  //   });

  //   it('should return false if a user tries to make an order with not enough stock', async () => {
  //     const result = await service.isValidMenu(menu1.menuId);
  //     expect(result).toBe(true);
  //   });
  // });
});
