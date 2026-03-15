class BankingSystem {
    constructor(){
        this.accounts = new Map();
        this.transfers = new Map();
        this.nextTransferId = 1;
        this.cashbacks = [];
    }

    createAccount(accountId){
        if(this.accounts.has(accountId)) return false
        this.accounts.set(accountId, {balance: 0, activity: 0});
        return true
    }

    deposit(accountId, amount){
        if(!this.accounts.has(accountId)) return "";
        let account = this.accounts.get(accountId);
        account.balance += amount;
        account.activity += amount;
        return String(account.balance);
    }

    withdraw(accountId, amount, timestamp){
        if(!this.accounts.has(accountId)) return "";
        let account = this.accounts.get(accountId);
        if(account.balance < amount) return "";
        account.balance -= amount;
        account.activity += amount;
        const cashbackAmount = Math.floor(amount * 0.02);
        this.cashbacks.push({
            accountId: accountId,
            amount: cashbackAmount,
            time: timestamp + 10
        })
        return String(account.balance);
    }

    topActivity(n){
        const accountsArray = Array.from(this.accounts.entries());
        accountsArray.sort((a, b) => {
            if(b[1].activity != a[1].activity) return b[1].activity - a[1].activity;
            return a[0].localCompare(b[0])
        });
        const result = [];
        for(let i = 0; i < Math.min(n, accountsArray.length); i++){
            const accountId = accountsArray[i][0];
            const activity = accountsArray[i][1].activity;
            result.push(`${accountId} (${activity})`);
        }
        return result.join(", ")
    }

    transfer(fromId, toId, amount){
        if(!this.accounts.has(fromId) || !this.accounts.has(toId)) return "";
        const fromAccount = this.accounts.get(fromId);
        if(fromAccount.balance < amount) return "";
        fromAccount.balance -= amount;
        fromAccount.activity += amount;
        const transferId = "transfer" + this.nextTransferId;
        this.nextTransferId++;
        this.transfers.set(transferId, {from: fromId, to: toId, amount: amount});
        return transferId;
    }

    acceptTransfer(accountId, transferId){
        if(!this.transfers.has(transferId)) return "";
        const transfer = this.transfers.get(transferId);
        if(transfer.to !== accountId) return "false";
        const receiver = this.accounts.get(accountId);
        receiver.balance += transfer.amount;
        receiver.activity += transfer.amount;
        this.transfers.delete(transferId);
        return "true";
    }

    mergeAccounts(accountId1, accountId2){
        if(!this.accounts.has(accountId1) || !this.accounts.has(accountId2)) return "false";
        if(accountId1 == accountId2) return "false";
        const account1 = this.accounts.get(accountId1);
        const account2 = this.accounts.get(accountId2);
        account1.balance += account2.balance;
        account1.activity += account2.activity;
        for(const [transferId, transfer] of this.transfers.entries()){
            if(transfer.from == accountId2) transfer.from = accountId1;
            if(transfer.to == accountId2) transfer.to = accountId1;
        }
        this.accounts.delete(accountId2);
        return "true";
    }

    processCashbacks(currentTime){
        const remainingCashbacks = [];
        for(const cashback of this.cashbacks) {
            if(cashback.time <= currentTime) {
                const account = this.accounts.get(cashback.accountId);
                if(account){
                    account.balance += cashback.amount;
                    account.activity += cashback.amount;
                } else {
                    remainingCashbacks.push(cashback);
                }
            }
        }
        this.cashbacks = remainingCashbacks
    }
}

function solution(queries){
    const bank = new BankingSystem();
    const result = [];

    for(const q of queries){
        const operation = q[0];
        const timestamp = q[1];
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
  ["CREATE_ACCOUNT","1","A1"],
  ["DEPOSIT","2","A1","500"],
  ["PAY","3","A1","200"],
  ["TOP_ACTIVITY","86400010","1"]
];

console.log(solution(queries));
