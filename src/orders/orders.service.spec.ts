import { Test, TestingModule } from '@nestjs/testing';

import { OrdersService } from './orders.service';


import { UserType } from 'src/types';
import { PrismaService } from 'src/prisma';
// import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { PrismaClient } from '@prisma/client';
import { OrderStatus } from 'src/types/orders';



describe('OrdersService', () => {
  let service: OrdersService;
  // let mockPrisma: DeepMockProxy<PrismaClient>;

  const cusomerUser = {
    userId: 1,
    email: 'customer1@delivery.com',
    name: 'Customer Kim',
    password: 'qwe1234',
    type: UserType.CUSTOMER,
  };

  const businessUser = {
    userId: 2,
    email: 'business1@delivery.com',
    name: 'Business Kim',
    password: 'qwe1234',
    type: UserType.BUSINESS,
  };


  const sampleCreaetOrderDTO1 = {
    user: {
      userId: 12345,
      email: "john@example.com",
      name: "John Doe",
      password: "password123",
      type: UserType.CUSTOMER,
    },
    storeId: 67890,
    orderItem: [
      {
        quantity: 2,
        menuId: 101,
      },
      {
        quantity: 1,
        menuId: 102,
      },
    ],
  };
  const order1 = {
    userId: 1,
    storeId: 1,
    paymentId: 1
  };


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        PrismaService,
        ],
    })
      .compile();
      // .useValue(mockDeep<PrismaClient>())

    service = module.get<OrdersService>(OrdersService);
    // mockPrisma = module.get(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Order Creation', () => {
    describe('Order Creates normally', () => {
      // it('should create an order', () => {
      //   expect(() => {
      //     service.createOrder(sampleCreaetOrderDTO1);
      //   }).toThrowError('Method not implemented.');
      //   // let serviceMock =jest.spyOn(service,"saveOrder")
      //   // service.createOrder(order1);
      //   // expect(serviceMock).toBeCalledWith(order1);
      // });

      it('should inform payment module by calling processPayment function', () => {
        let serviceMock =jest.spyOn(service,"callPaymentMethod")
        const testOrder: Order = {
          orderId: 12345,
          userId: 9876,
          storeId: 54321,
          createdAt: new Date('2023-06-28T10:30:00Z'),
          updatedAt: new Date('2023-06-29T15:45:00Z'),
          status: OrderStatus.PAYMENT_PROCESSING,
        };

        service.processPayment(testOrder);
        expect(serviceMock).toBeCalledWith(testOrder);
      });
    });
    // describe('Order General Validation Check', () => {
    //   it('should return error if business ueser tries to make an order', () => {
    //     const result = service.isUserTypeCustomer(1)
    //     expect(result).toBe(false)
    //     // expect(() => {
    //     //   service.addOrder(order1, businessUser);
    //     // }).toThrowError('Only customers are allowed to add orders.');


    //   });
    //   it('should return error if a user tries to make an order from a non-existing store', () => {
    //     const result = service.isValidStore(1)
    //     expect(result).toBe(false)
    //     // expect(() => {
    //     //   service.addOrder(order1, businessUser);
    //     // }).toThrowError('Only customers are allowed to add orders.');

    //   });
    //   it('should return false if a user tries to make an order of a non-existing item', () => {
    //     const result = service.isValidMenu(1)
    //     expect(result).toBe(false)
    //   });

    // });
    // describe('Order Business Validation Check', () => {
    //   it('should return false if a user tries to make an order of more than 10 item', () => {
    //     const orderItemList = [
    //       {
    //         orderId: 1,
    //         quantity: 1,
    //         menuId: 1,
    //       },
    //       {
    //         orderId: 1,
    //         quantity: 2,
    //         menuId: 2,
    //       },
    //       {
    //         orderId: 1,
    //         quantity: 3,
    //         menuId: 3,
    //       },
    //       {
    //         orderId: 1,
    //         quantity: 4,
    //         menuId: 4,
    //       },
    //       {
    //         orderId: 1,
    //         quantity: 5,
    //         menuId: 5,
    //       },
    //       {
    //         orderId: 1,
    //         quantity: 6,
    //         menuId: 6,
    //       },
    //       {
    //         orderId: 1,
    //         quantity: 7,
    //         menuId: 7,
    //       },
    //       {
    //         orderId: 1,
    //         quantity: 8,
    //         menuId: 8,
    //       },
    //       {
    //         orderId: 1,
    //         quantity: 9,
    //         menuId: 9,
    //       },
    //       {
    //         orderId: 1,
    //         quantity: 10,
    //         menuId: 10,
    //       },
    //       {
    //         orderId: 1,
    //         quantity: 11,
    //         menuId: 11,
    //       },
    //     ];
    //     const orderItem1 = { 
    //       orderId: 1,
    //       quantity: 1,
    //       menuId: 1,
    //     }
    //     const result = service.isOrderItemCountInRange(orderItemList)
    //     expect(result).toBe(false)
    //   });

    //   it('should return false if a user tries to make an order of 0 item', () => {
    //     const orderItem1 = []
    //     const result = service.isOrderItemCountInRange(orderItem1)
    //     expect(result).toBe(false)
    //   });

    //   it('should return error if a user tries to make an order while incomplete order exists', () => {
    //     const result = service.hasOngoingOrder(1)
    //     expect(result).toBe(false)
    //   });

    //   it('should return false if a user tries to make an order with not enough stock', () => {
    //     const result = service.hasOngoingOrder(1)
    //     expect(result).toBe(false)
    //   });

    // });
  });
});
