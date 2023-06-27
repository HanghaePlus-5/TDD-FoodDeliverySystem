export class CustomOrder {
    static lastOrderId = 0;
    id: number = CustomOrder.lastOrderId;
    customerName: string;

    constructor(customerName: string) {
        CustomOrder.lastOrderId++;
        this.id = this.id;
        this.customerName = customerName;
    }
}
