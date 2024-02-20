import {Observable} from "rxjs";
import {BankAccountViewModel} from "@models";


export abstract class BankAccountService {

  abstract getBankAccounts(buildingId: string): Observable<BankAccountViewModel[]>;

  abstract getBankAccount(buildingId: string, bankAccountId: string): Observable<BankAccountViewModel>;

  abstract createBankAccount(buildingId: string, bankAccount: BankAccountViewModel): Observable<any>;

  abstract updateBankAccount(buildingId: string, bankAccountId: string, bankAccount: BankAccountViewModel): Observable<any>;

  abstract deleteBankAccount(buildingId: string, bankAccountId: string): Observable<any>;
}
