class Account {
    constructor(accountId){
        this.id = accountId;
        this.balance = 0;
        this.activity = 0;
    }

    deposit(amount) {
        this.balance += amount;
        this.activity += amount;
        return this.balance;
    }

    withdraw(amount) {
        if(this.balance < amount) return null;
        this.balance -= amount;
        this.activity += amount;
        return this.balance;
    }

    merge(otherAccount) {
        this.balance += otherAccount.balance;
        this.activity += otherAccount.activity;
    }
}

class Transfer {
    constructor(transferId, fromAccount, toAccount, amount, timestamp){
        this.id = transferId;
        this.from = fromAccount;
        this.to = toAccount;
        this.amount = amount;
        this.timestamp = timestamp;
    }
}

class Cashback {
    constructor(account, amount, readyTime) {
        this.account = account;
        this.amount = amount;
        this.readyTime = readyTime;
    }
}

class BankingSystem {
    constructor(){
        this.accounts = new Map();
        this.transfers = new Map();
        this.nextTransferId = 1;
        this.cashbacks = [];
    }

    createAccount(accountId){
        if(this.accounts.has(accountId)) return "false";
        this.accounts.set(accountId, new Account(accountId));
        return "true";
    }

    deposit(accountId, amount){
        let account = this.accounts.get(accountId);
        if(!account) return "";
        return String(account.deposit(amount));
    }

    withdraw(accountId, amount, timestamp){
        let account = this.accounts.get(accountId);
        if(!account) return "";
        const newBalance = account.withdraw(amount);
        if(newBalance == null) return ""
        const cashbackAmount = Math.floor(amount * 0.02);
        this.cashbacks.push(new Cashback(account, cashbackAmount, timestamp));
        return String(newBalance);
    }

    topActivity(n){
        const sorted = Array.from(this.accounts.values()).sort((a, b) => b.activity - a.activity);
        return sorted.slice(0, n).map(a => `${a.id}(${a.activity})`).join(", ");
    }

    transfer(fromId, toId, amount){
        const fromAccount = this.accounts.get(fromId);
        const toAccount = this.accounts.get(toId);
        if(!fromAccount || !toAccount || fromId == toId) return "";
        if(fromAccount.balance < amount) return "";
        const transferId = "transfer" + this.nextTransferId++;
        const transfer = new Transfer(transferId, fromAccount, toAccount, amount);
        this.transfers.set(transferId, transfer);
        return transferId;
    }

    acceptTransfer(accountId, transferId){
        const transfer = this.transfers.get(transferId);
        if(!transfer || transfer.to !== accountId) return "false";
        const fromAccount = transfer.from;
        const toAccount = transfer.to;
        fromAccount.withdraw(transfer.amount);
        toAccount.deposit(transfer.amount);
        this.transfers.delete(transferId);
        return "true";
    }

    mergeAccounts(accountId1, accountId2){
        if(!this.accounts.has(accountId1) || !this.accounts.has(accountId2) || accountId1 == accountId2) return "false";
        const account1 = this.accounts.get(accountId1);
        const account2 = this.accounts.get(accountId2);
        account1.merge(account2);
        for(const [transferId, transfer] of this.transfers.entries()){
            if(transfer.from.id == accountId2) transfer.from = account1;
            if(transfer.to.id == accountId2) transfer.to = account1;
        }
        this.accounts.delete(accountId2);
        return "true";
    }

    processCashbacks(currentTime){
        const remainingCashbacks = [];
        for(const cashback of this.cashbacks) {
            if(cashback.readyTime <= currentTime) {
                cashback.account.balance += cashback.amount;
                cashback.account.activity += cashback.amount;
            } else {
                    remainingCashbacks.push(cashback);
            }
        }
        this.cashbacks = remainingCashbacks;
    }
}

function solution(queries){
    const bank = new BankingSystem();
    const result = [];

    for(const q of queries){
        const operation = q[0];
        const timestamp = Number(q[1]);
        bank.processCashbacks(timestamp);
        if(operation == "CREATE_ACCOUNT") result.push(bank.createAccount(q[2]));
        else if(operation == "DEPOSIT") result.push(bank.deposit(q[2], Number(q[3])));
        else if(operation == "WITHDRAW") result.push(bank.withdraw(q[2], Number(q[3]), timestamp));
        else if(operation == "TOP_ACTIVITY") result.push(bank.topActivity(Number(q[2])));
        else if(operation == "TRANSFER") result.push(bank.transfer(q[2], q[3], Number(q[4])));
        else if(operation == "ACCEPT_TRANSFER") result.push(bank.acceptTransfer(q[2], q[3]));
        else if(operation == "MERGE_ACCOUNTS") result.push(bank.mergeAccounts(q[2], q[3]));
    }
    return result;
}

const queries = [
    ["DEPOSIT", "1", "A1", "100"],    
    ["WITHDRAW", "2", "A1", "50"],   
    ["CREATE_ACCOUNT","1","A1"],
    ["CREATE_ACCOUNT","2","A1"],
    ["TRANSFER", "2", "A1", "A2", "50"],
    ["DEPOSIT","2","A1","500"],
    ["WITHDRAW","3","A1","800"],
    ["CREATE_ACCOUNT","2","A2"],
    ["TOP_ACTIVITY","86400015","1"],
    ["CREATE_ACCOUNT", "3", "A3"],
    ["ACCEPT_TRANSFER", "6", "A3", "transfer1"],
    ["ACCEPT_TRANSFER", "6", "A2", "transfer1"]
];

console.log(solution(queries));
