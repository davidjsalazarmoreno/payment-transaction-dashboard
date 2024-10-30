import { nanoid } from "nanoid";

export type Transaction = {
    id: string;
    date: string;
    description: string;
    amount: number;
};

const mockTransactions: Transaction[] = [
    {
        id: nanoid(),
        date: "2023-05-01",
        description: "Online Purchase",
        amount: 50.00,
    },
    {
        id: nanoid(),
        date: "2023-05-03",
        description: "Subscription Renewal",
        amount: 15.99,
    },
    {
        id: nanoid(),
        date: "2023-05-05",
        description: "Transfer to Savings",
        amount: 200.00,
    },
    {
        id: nanoid(),
        date: "2023-05-10",
        description: "Grocery Shopping",
        amount: 75.50,
    },
    {
        id: nanoid(),
        date: "2023-05-15",
        description: "Restaurant Bill",
        amount: 45.00,
    },
    {
        id: nanoid(),
        date: "2023-05-18",
        description: "Online Course",
        amount: 99.99,
    },
    {
        id: nanoid(),
        date: "2023-05-20",
        description: "Gas Station",
        amount: 40.00,
    },
    {
        id: nanoid(),
        date: "2023-05-22",
        description: "Movie Tickets",
        amount: 30.00,
    },
    {
        id: nanoid(),
        date: "2023-05-25",
        description: "Clothing Store",
        amount: 120.50,
    },
    {
        id: nanoid(),
        date: "2023-05-28",
        description: "Phone Bill",
        amount: 65.00,
    },
    {
        id: nanoid(),
        date: "2023-05-30",
        description: "Gym Membership",
        amount: 50.00,
    },
    {
        id: nanoid(),
        date: "2023-07-30",
        description: "Gym Membership 3",
        amount: 50.00,
    },
    {
        id: nanoid(),
        date: "2023-08-20",
        description: "Gym Membership 4",
        amount: 50.00,
    },
    {
        id: nanoid(),
        date: "2023-08-21",
        description: "Gym Membership 5",
        amount: 50.00,
    },
    {
        id: nanoid(),
        date: "2023-08-30",
        description: "Gym Membership 6",
        amount: 50.00,
    },

    
    
];

export const fetchTransactions = (startDate: Date, endDate: Date): Promise<Transaction[] > => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // We can simulate a failure by uncommenting the line below
            // const failure = Math.random() > 0.9;
            const failure = false;
            if (failure) {
                reject(new Error("Failed to fetch transactions"));
            } else {
                const filteredTransactions = mockTransactions.filter(
                    (transaction) => {
                        const transactionDate = new Date(transaction.date);
                        return transactionDate >= startDate &&
                            transactionDate <= endDate;
                    },
                );
                resolve(filteredTransactions);
            }
        }, 500);
    });
};
