#!/usr/bin/env node

/**
 * Student Account Management System - Node.js Implementation
 * 
 * This application is a modernized conversion of the original COBOL legacy code.
 * It preserves the original business logic, data integrity, and menu options:
 * 
 * - Initial balance: $1000.00
 * - View Balance: Display current account balance
 * - Credit Account: Add funds to the account
 * - Debit Account: Withdraw funds (only if sufficient balance exists)
 * - Insufficient Funds Protection: Prevents overdrafts
 * 
 * Architecture maps to COBOL programs:
 * - DataLayer class: Replaces data.cob (persistence layer)
 * - AccountOperations class: Replaces operations.cob (business logic)
 * - AccountManagementApp class: Replaces main.cob (user interface/menu)
 */

// ============================================================================
// DATA LAYER - Equivalent to data.cob
// Stores and retrieves the persisted account balance
// ============================================================================

class DataLayer {
  constructor() {
    this.storageBalance = 1000.00; // Initial balance
  }

  /**
   * Read the current balance from storage
   * Equivalent to: CALL 'DataProgram' USING 'READ', FINAL-BALANCE
   */
  read() {
    return this.storageBalance;
  }

  /**
   * Write/update the balance in storage
   * Equivalent to: CALL 'DataProgram' USING 'WRITE', FINAL-BALANCE
   */
  write(amount) {
    this.storageBalance = amount;
  }
}

// ============================================================================
// OPERATIONS LAYER - Equivalent to operations.cob
// Implements business logic for account transactions
// ============================================================================

class AccountOperations {
  constructor(dataLayer) {
    this.dataLayer = dataLayer;
  }

  /**
   * TOTAL operation: View the current account balance
   * Equivalent to: WHEN OPERATION-TYPE = 'TOTAL '
   */
  viewBalance() {
    const balance = this.dataLayer.read();
    console.log(`Current balance: ${this.formatBalance(balance)}`);
  }

  /**
   * CREDIT operation: Add funds to the account
   * Equivalent to: WHEN OPERATION-TYPE = 'CREDIT'
   * Business logic:
   * 1. Read current balance
   * 2. Add the credit amount
   * 3. Write new balance to storage
   * 4. Display the new balance
   */
  credit(amount) {
    const currentBalance = this.dataLayer.read();
    const newBalance = currentBalance + amount;
    this.dataLayer.write(newBalance);
    console.log(`Amount credited. New balance: ${this.formatBalance(newBalance)}`);
  }

  /**
   * DEBIT operation: Withdraw funds from the account
   * Equivalent to: WHEN OPERATION-TYPE = 'DEBIT '
   * Business logic:
   * 1. Read current balance
   * 2. Check if sufficient funds (balance >= amount)
   * 3. If yes: subtract amount, write new balance, display result
   * 4. If no: display "Insufficient funds" error, keep balance unchanged
   */
  debit(amount) {
    const currentBalance = this.dataLayer.read();
    if (currentBalance >= amount) {
      const newBalance = currentBalance - amount;
      this.dataLayer.write(newBalance);
      console.log(`Amount debited. New balance: ${this.formatBalance(newBalance)}`);
    } else {
      console.log("Insufficient funds for this debit.");
    }
  }

  /**
   * Format balance for display
   * Matches COBOL format: PIC 9(6)V99 (e.g., "001000.00")
   */
  formatBalance(amount) {
    return amount.toFixed(2).padStart(9, '0');
  }
}

// ============================================================================
// MAIN APPLICATION - Equivalent to main.cob
// Displays the menu and routes user choices to account operations
// ============================================================================

class AccountManagementApp {
  constructor() {
    this.dataLayer = new DataLayer();
    this.operations = new AccountOperations(this.dataLayer);
    this.prompt = require('prompt-sync')({ sigint: true });
  }

  /**
   * Display the main menu
   * Equivalent to: DISPLAY menu items in COBOL
   */
  displayMenu() {
    console.log("--------------------------------");
    console.log("Account Management System");
    console.log("1. View Balance");
    console.log("2. Credit Account");
    console.log("3. Debit Account");
    console.log("4. Exit");
    console.log("--------------------------------");
  }

  /**
   * Prompt user for a transaction amount
   * Validates that input is a positive number
   */
  getAmount() {
    const input = this.prompt("Enter amount: ");
    const amount = parseFloat(input);
    
    if (isNaN(amount) || amount < 0) {
      console.log("Invalid amount. Please enter a valid number.");
      return null;
    }
    
    return amount;
  }

  /**
   * Main application loop
   * Equivalent to: PERFORM UNTIL CONTINUE-FLAG = 'NO' in COBOL
   * 
   * Menu routing:
   * 1 -> View Balance (TOTAL operation)
   * 2 -> Credit Account (CREDIT operation)
   * 3 -> Debit Account (DEBIT operation)
   * 4 -> Exit
   */
  run() {
    let continueFlag = true;

    while (continueFlag) {
      this.displayMenu();
      const choice = this.prompt("Enter your choice (1-4): ");

      switch (choice) {
        case "1":
          // View Balance - CALL 'Operations' USING 'TOTAL '
          this.operations.viewBalance();
          break;

        case "2":
          // Credit Account - CALL 'Operations' USING 'CREDIT'
          const creditAmount = this.getAmount();
          if (creditAmount !== null) {
            this.operations.credit(creditAmount);
          }
          break;

        case "3":
          // Debit Account - CALL 'Operations' USING 'DEBIT '
          const debitAmount = this.getAmount();
          if (debitAmount !== null) {
            this.operations.debit(debitAmount);
          }
          break;

        case "4":
          // Exit - MOVE 'NO' TO CONTINUE-FLAG
          continueFlag = false;
          break;

        default:
          // Invalid choice - equivalent to WHEN OTHER
          console.log("Invalid choice, please select 1-4.");
      }

      console.log(""); // Empty line for readability between operations
    }

    // Exit message - equivalent to: DISPLAY "Exiting the program. Goodbye!"
    console.log("Exiting the program. Goodbye!");
  }
}

// ============================================================================
// APPLICATION ENTRY POINT
// Equivalent to: PROCEDURE DIVISION. MAIN-LOGIC. in COBOL main.cob
// ============================================================================

if (require.main === module) {
  const app = new AccountManagementApp();
  app.run();
}

module.exports = {
  DataLayer,
  AccountOperations,
  AccountManagementApp,
};
