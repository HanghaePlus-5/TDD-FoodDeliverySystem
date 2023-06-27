export class CustomOrder {
    static lastOrderId = 0;
    id: number = CustomOrder.lastOrderId;
    customerName: string;
    status: string;

    constructor(customerName: string) {
        CustomOrder.lastOrderId++;
        this.id = this.id;
        this.customerName = customerName;
        this.status = "paymentProcessing"
    }
}
