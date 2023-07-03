import { NotAcceptableException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { StoreStatus, StoreType } from '@prisma/client';
import { is } from 'typia';

import { PrismaService } from 'src/prisma';
import { PaymentGatewayService } from 'src/lib/payment-gateway/payment-gateway.service';
import { mockingPaymentInfo } from 'src/utils/mocking-helper/mocking-payment';

import { PaymentService } from './payment.service';

import { PaymentStatus, UserType } from 'src/types';

describe('PaymentService', () => {
  let service: PaymentService;
  let testPrisma: PrismaService;
  // data
  let order;
  let user;
  let store;
  let menu;
  let orderItem;
  let orderDto;
  let paymentProcessArgs: PaymentProcessArgs;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaymentService, PrismaService, PaymentGatewayService],
    }).compile();

    service = module.get<PaymentService>(PaymentService);
    testPrisma = module.get(PrismaService);

    const random = Math.floor(Math.random() * 1000) + 1;

    user = await testPrisma.user.create({
      data: {
        email: `michael${random}@gmail.com`,
        name: 'michael',
        password: 'qwer123123',
        type: UserType.CUSTOMER,
      },
    });

    store = await testPrisma.store.create({
      data: {
        name: `Sample Store${random}`,
        type: StoreType.KOREAN,
        status: StoreStatus.OPEN,
        businessNumber: `1234567890${random}`,
        phoneNumber: '010-1234-5678',
        postalNumber: '12345',
        address: 'Seoul, Korea',
        openingTime: 1,
        closingTime: 1,
        cookingTime: 1,
      },
    });

    menu = await testPrisma.menu.create({
      data: {
        storeId: store.storeId,
      },
    });

    order = await testPrisma.order.create({
      data: {
        userId: user.userId,
        storeId: store.storeId,
      },
    });

    orderItem = await testPrisma.orderItem.createMany({
      data: [
        {
          orderId: order.orderId,
          quantity: 1,
          menuId: menu.menuId,
        },
      ],
    });
    orderDto = {
      ...order,
      user,
    };

    paymentProcessArgs = {
      paymentCreateDto: mockingPaymentInfo(),
      order,
      user,
    };
  });
  afterAll(async () => {
    const deleteOrderItem = testPrisma.orderItem.deleteMany();
    await testPrisma.$transaction([deleteOrderItem]);
    const deleteUser = testPrisma.user.deleteMany();
    const deleteMenu = testPrisma.menu.deleteMany();
    await testPrisma.$transaction([deleteMenu]);
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
    await testPrisma.$transaction([deletePayment]);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const issue = (issue: string) => {
    return `throw error with ${issue}`;
  };

  describe('send payment request to payment-gateway', () => {
    describe('validate payment request', () => {
      it(issue('unathorized card holder'), async () => {
        await expect(
          service.makePayment({
            ...paymentProcessArgs,
            paymentCreateDto: mockingPaymentInfo({ cardHolderName: 'dan' }),
          }),
        ).rejects.toThrow();
      });
      it(issue('invalid card number format'), async () => {
        await expect(
          service.makePayment({
            ...paymentProcessArgs,
            paymentCreateDto: mockingPaymentInfo({
              cardNumber: '4124-1244-4124-414',
            }),
          }),
        ).rejects.toThrow();
      });
    });
    describe('payment request to PG', () => {
      it(issue('unacceptable card'), async () => {
        await expect(
          service.makePayment({
            ...paymentProcessArgs,
            paymentCreateDto: mockingPaymentInfo({
              cardNumber: '1111-1111-1111-1111',
            }),
          }),
        ).rejects.toThrow();
      });
    });
    describe('payment creation', () => {
      it('payment successfully created', async () => {
        const result = await service.makePayment(paymentProcessArgs);
        expect(is<Payment>(result)).toBe(true);
      });
    });
  });

  describe('cancel payment request', () => {
    describe('validate cancel request', () => {
      it(issue('no payment data'), async () => {
        await service.makePayment(paymentProcessArgs);
        await expect(service.cancelPayment(123123)).rejects.toThrow(
          NotFoundException,
        );
      });
      it(issue('status not completed'), async () => {
        await service.makePayment({
          ...paymentProcessArgs,
          paymentCreateDto: mockingPaymentInfo({
            paymentStatus: PaymentStatus.canceled,
          }),
        });
        await expect(service.cancelPayment(orderDto.orderId)).rejects.toThrow();
      });
    });

    describe('cancel request to PG', () => {
      it(issue('invalid paymentGatewayId'), async () => {
        await testPrisma.payment.create({
          data: {
            ...mockingPaymentInfo(),
            paymentGatewayId: '123456',
            orderId: orderDto.orderId,
          },
        });
        await expect(service.cancelPayment(orderDto.orderId)).rejects.toThrow(
          NotAcceptableException,
        );
      });
    });

    describe('update payment status', () => {
      it('payment data is successfully updated', async () => {
        await service.makePayment(paymentProcessArgs);
        const result = await service.cancelPayment(order.orderId);
        expect(is<Payment>(result)).toBe(true);
        expect(result.paymentStatus).toBe(PaymentStatus.canceled);
      });
    });
  });
});
