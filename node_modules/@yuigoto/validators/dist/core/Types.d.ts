export declare type CreditCardItem = {
    name: string;
    slug: string;
    pattern: RegExp;
};
export declare type CreditCardCollection = {
    [key: string]: CreditCardItem;
};
