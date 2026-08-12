jest.mock('prompt-sync', () => jest.fn(() => '4'));

const { DataLayer, AccountOperations, AccountManagementApp } = require('../index.js');

describe('Account Management System', () => {
  let consoleSpy;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  test('TC-001: initial balance displays correctly', () => {
    const dataLayer = new DataLayer();
    const operations = new AccountOperations(dataLayer);

    operations.viewBalance();

    expect(console.log).toHaveBeenCalledWith('Current balance: 001000.00');
    expect(dataLayer.read()).toBe(1000);
  });

  test('TC-002/TC-003: credit operations update the balance and format decimals', () => {
    const dataLayer = new DataLayer();
    const operations = new AccountOperations(dataLayer);

    operations.credit(100);
    operations.credit(0.01);

    expect(dataLayer.read()).toBeCloseTo(1100.01, 2);
    expect(console.log).toHaveBeenCalledWith('Amount credited. New balance: 001100.01');
  });

  test('TC-005/TC-006: valid debit and exact-balance debit succeed', () => {
    const dataLayer = new DataLayer();
    const operations = new AccountOperations(dataLayer);

    operations.debit(200);
    operations.debit(800);

    expect(dataLayer.read()).toBe(0);
    expect(console.log).toHaveBeenCalledWith('Amount debited. New balance: 000000.00');
  });

  test('TC-007/TC-008: insufficient-funds debits are rejected and preserve balance', () => {
    const dataLayer = new DataLayer();
    const operations = new AccountOperations(dataLayer);

    operations.debit(1500);
    operations.debit(1000.01);

    expect(dataLayer.read()).toBe(1000);
    expect(console.log).toHaveBeenCalledWith('Insufficient funds for this debit.');
    expect(console.log).toHaveBeenCalledTimes(2);
  });

  test('TC-009/TC-010/TC-011: sequential and mixed operations persist correctly', () => {
    const dataLayer = new DataLayer();
    const operations = new AccountOperations(dataLayer);

    operations.credit(100);
    operations.credit(50);
    operations.debit(150);
    operations.credit(300);

    expect(dataLayer.read()).toBe(1300);
    expect(console.log).toHaveBeenCalledWith('Amount credited. New balance: 001150.00');
    expect(console.log).toHaveBeenCalledWith('Amount debited. New balance: 001000.00');
    expect(console.log).toHaveBeenCalledWith('Amount credited. New balance: 001300.00');
  });

  test('TC-012: credit then exact-balance debit should empty the account', () => {
    const dataLayer = new DataLayer();
    const operations = new AccountOperations(dataLayer);

    operations.credit(100);
    operations.debit(1100);
    operations.debit(500);

    expect(dataLayer.read()).toBe(0);
    expect(console.log).toHaveBeenCalledWith('Amount debited. New balance: 000000.00');
    expect(console.log).toHaveBeenCalledWith('Insufficient funds for this debit.');
  });

  test('TC-017: menu display includes all valid options', () => {
    const app = new AccountManagementApp();

    app.displayMenu();

    expect(console.log).toHaveBeenCalledWith('Account Management System');
    expect(console.log).toHaveBeenCalledWith('1. View Balance');
    expect(console.log).toHaveBeenCalledWith('2. Credit Account');
    expect(console.log).toHaveBeenCalledWith('3. Debit Account');
    expect(console.log).toHaveBeenCalledWith('4. Exit');
  });

  test('TC-013/TC-014/TC-015/TC-016: invalid menu entries are rejected and exit ends the app', () => {
    const app = new AccountManagementApp();
    app.prompt = jest.fn()
      .mockReturnValueOnce('5')
      .mockReturnValueOnce('4');

    app.run();

    expect(console.log).toHaveBeenCalledWith('Invalid choice, please select 1-4.');
    expect(console.log).toHaveBeenCalledWith('Exiting the program. Goodbye!');
  });

  test('TC-018: each new session starts with the default balance', () => {
    const first = new DataLayer();
    first.write(1050);

    const restarted = new DataLayer();

    expect(first.read()).toBe(1050);
    expect(restarted.read()).toBe(1000);
  });

  test('TC-019/TC-020: fractional debit and credit values are handled correctly', () => {
    const dataLayer = new DataLayer();
    const operations = new AccountOperations(dataLayer);

    operations.debit(0.25);
    operations.credit(0.75);

    expect(dataLayer.read()).toBeCloseTo(1000.5, 2);
    expect(console.log).toHaveBeenCalledWith('Amount debited. New balance: 000999.75');
    expect(console.log).toHaveBeenCalledWith('Amount credited. New balance: 001000.50');
  });

  test('TC-021/TC-022: zero-amount credit and debit are valid no-op operations', () => {
    const dataLayer = new DataLayer();
    const operations = new AccountOperations(dataLayer);

    operations.credit(0);
    operations.debit(0);

    expect(dataLayer.read()).toBe(1000);
    expect(console.log).toHaveBeenCalledWith('Amount credited. New balance: 001000.00');
    expect(console.log).toHaveBeenCalledWith('Amount debited. New balance: 001000.00');
  });

  test('TC-023/TC-024: balance formatting and menu loop resume between actions', () => {
    const app = new AccountManagementApp();
    app.prompt = jest.fn()
      .mockReturnValueOnce('1')
      .mockReturnValueOnce('2')
      .mockReturnValueOnce('50')
      .mockReturnValueOnce('4');

    app.run();

    expect(console.log).toHaveBeenCalledWith('Current balance: 001000.00');
    expect(console.log).toHaveBeenCalledWith('Amount credited. New balance: 001050.00');
    expect(console.log).toHaveBeenCalledWith('Exiting the program. Goodbye!');
  });

  test('TC-025: consecutive failed debit attempts keep the balance unchanged', () => {
    const dataLayer = new DataLayer();
    const operations = new AccountOperations(dataLayer);
    dataLayer.write(500);

    const oldBalance = dataLayer.read();
    operations.debit(1000);
    operations.debit(600);

    expect(dataLayer.read()).toBe(oldBalance);
    expect(console.log).toHaveBeenCalledWith('Insufficient funds for this debit.');
    expect(console.log).toHaveBeenCalledTimes(2);
  });
});
