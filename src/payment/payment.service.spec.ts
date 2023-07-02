import { Test, TestingModule } from '@nestjs/testing';

import { PaymentGatewayService } from 'src/lib/payment-gateway/payment-gateway.service';
import { PrismaService } from 'src/prisma';

import { PaymentService } from './payment.service';

import { NotAcceptableException, NotFoundException } from '@nestjs/common';
import { Payment, StoreStatus, StoreType, UserType } from '@prisma/client';
import { PaymentStatus } from 'src/types';
import { mockingOrderDto } from 'src/utils/mocking-helper/mocking-order';
import { mockingPaymentCreateDto, mockingPaymentDto } from 'src/utils/mocking-helper/mocking-payment';
import { is } from 'typia';
import { after, before } from 'node:test';

describe('PaymentService', () => {
  let service: PaymentService;
  let testPrisma: PrismaService;
  // data
  let order;
  let user;
  let store
  let menu;
  let orderItem
  let orderDto;


  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaymentService, PrismaService, PaymentGatewayService],
    })
      .compile();

    service = module.get<PaymentService>(PaymentService);
    testPrisma = module.get(PrismaService);

    const random = Math.floor(Math.random() * 1000) + 1;

    user = await testPrisma.user.create({
      data:
      {
        email: 'michael' + random + '@gmail.com',
        name: 'michael',
        password: 'qwer123123',
        type: UserType.CUSTOMER,
      },

    });

    store = await testPrisma.store.create({
      data:
      {
        name: 'Sample Store' + random,
        type: StoreType.KOREAN,
        status: StoreStatus.OPEN,
        businessNumber: '1234567890' + random,
        phoneNumber: '010-1234-5678',
        postalNumber: '12345',
        address: 'Seoul, Korea',
        openingTime: 1,
        closingTime: 1,
        cookingTime: 1,
      },
    });


    menu = await testPrisma.menu.create({
      data:
      {
        storeId: store.storeId,
      },
    });

    order = await testPrisma.order.create({
      data: {
        userId: user.userId,
        storeId: store.storeId,
      }
    });

    orderItem = await testPrisma.orderItem.createMany({
      data: [{
        orderId: order.orderId,
        quantity: 1,
        menuId: menu.menuId,
      },]
    })
    orderDto = {
      ...order, user: user
    }

  });
  afterAll(async () => {
    const deleteOrderItem = testPrisma.orderItem.deleteMany();
    await testPrisma.$transaction([
      deleteOrderItem,
    ]);
    const deleteUser = testPrisma.user.deleteMany();
    const deleteMenu = testPrisma.menu.deleteMany();
    await testPrisma.$transaction([
      deleteMenu,
    ]);
    const deleteStore = testPrisma.store.deleteMany();
    const deleteOrder = testPrisma.order.deleteMany();
    await testPrisma.$transaction([
      deleteOrderItem,
      deleteOrder,
      deleteUser,
      deleteStore,
    ]);
  });
  afterEach(async () => {
    const deletePayment = testPrisma.payment.deleteMany();
    await testPrisma.$transaction([
      deletePayment,
    ]);
  })

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const issue = (issue: string) => {
    return `throw error with ${issue}`;
  };

  describe('send payment request to payment-gateway', () => {
    describe('validate payment request', () => {
      it(issue('unathorized card holder'), async () => {
        await expect(service.makePayment(mockingPaymentCreateDto({ cardHolderName: "dan" }), orderDto)).rejects.toThrow();
      });
      it(issue('invalid card number format'), async () => {
        await expect(service.makePayment(mockingPaymentCreateDto({ cardNumber: '4124-1244-4124-414' }), orderDto)).rejects.toThrow();
      });
    });
    describe('payment request to PG', () => {
      it(issue('unacceptable card'), async () => {
        await expect(service.makePayment(mockingPaymentCreateDto({ cardNumber: '1111-1111-1111-1111' }), orderDto)).rejects.toThrow();
      });
    });
    describe('payment creation', () => {
      it('payment successfully created', async () => {
        const result = await service.makePayment(mockingPaymentCreateDto(), orderDto)
        expect(is<Payment>(result)).toBe(true)
      });
    });
  });

  describe('cancel payment request', () => {
    describe('validate cancel request', () => {
      it(issue('no payment data'), async () => {
        await service.makePayment(mockingPaymentCreateDto(), orderDto)
        await expect(service.cancelPayment(123123)).rejects.toThrow(NotFoundException);
      });
      it(issue('status not completed'), async () => {
        await service.makePayment(mockingPaymentCreateDto({ paymentStatus: PaymentStatus.canceled }), orderDto)
        await expect(service.cancelPayment(orderDto.orderId)).rejects.toThrow();
      });
    });

    describe('cancel request to PG', () => {
      it(issue('invalid paymentGatewayId'), async () => {
        await testPrisma.payment.create({ data: { ...mockingPaymentCreateDto(), paymentGatewayId: '123456', orderId: orderDto.orderId } })
        await expect(service.cancelPayment(orderDto.orderId)).rejects.toThrow(NotAcceptableException);
      });
    });

    describe('update payment status', () => {
      it('payment data is successfully updated', async () => {

        await service.makePayment(mockingPaymentCreateDto(), orderDto)
        const result = await service.cancelPayment(order.orderId)
        expect(is<Payment>(result)).toBe(true)
        expect(result.paymentStatus).toBe(PaymentStatus.canceled)
      });
    });
  });
});
