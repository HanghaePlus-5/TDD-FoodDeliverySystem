export class CustomOrder {
    static lastOrderId = 0;
    id: number = CustomOrder.lastOrderId;
    userId: number;
    status: string;

    constructor(userId: number) {
        CustomOrder.lastOrderId++;
        this.id = this.id;
        this.userId = userId;
        this.status = "paymentProcessing"
    }
}
