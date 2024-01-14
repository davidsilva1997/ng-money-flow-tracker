export class FinancialTransaction {
    public id: string;
    public description: string;
    public amount: number;
    public date: Date;
    public categoryId: string;
    public paymentMethodId: string;
    public notes: string;
    public tags: string[];
    public isIncome: boolean;

    constructor(id: string, description: string, amount: number, date: Date, categoryId: string, paymentMethodId: string, notes: string, tags: string[], isIncome: boolean) {
        this.id = id;
        this.description = description;
        this.amount = amount;
        this.date = date;
        this.categoryId = categoryId;
        this.paymentMethodId = paymentMethodId;
        this.notes = notes;
        this.tags = tags;
        this.isIncome = isIncome;
    }
}