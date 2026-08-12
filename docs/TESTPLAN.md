# Account Management System - Test Plan

## Overview
This test plan covers the business logic of the COBOL Account Management System application. The system manages account operations including viewing balance, crediting funds, debiting funds, and validating transactions against the current balance.

---

## Test Cases

| Test Case ID | Test Case Description | Pre-conditions | Test Steps | Expected Result | Actual Result | Status | Comments |
|---|---|---|---|---|---|---|---|
| TC-001 | View initial account balance | System is running, account initialized with default balance of 1000.00 | 1. Select menu option 1 (View Balance) | Display message "Current balance: 001000.00" | | | |
| TC-002 | Credit account with valid positive amount | System is running with balance of 1000.00 | 1. Select menu option 2 (Credit Account)<br>2. Enter amount: 100.00 | Display message "Amount credited. New balance: 001100.00" and balance is updated to 1100.00 | | | |
| TC-003 | Credit account with small amount | System is running with balance of 1000.00 | 1. Select menu option 2 (Credit Account)<br>2. Enter amount: 0.01 | Display message "Amount credited. New balance: 001000.01" | | | Test boundary condition for decimal values |
| TC-004 | Credit account with large amount | System is running with balance of 1000.00 | 1. Select menu option 2 (Credit Account)<br>2. Enter amount: 999999.99 | Display message "Amount credited. New balance: 1000999.99" | | | Test upper boundary limit |
| TC-005 | Debit account with valid amount less than balance | System is running with balance of 1000.00 | 1. Select menu option 3 (Debit Account)<br>2. Enter amount: 200.00 | Display message "Amount debited. New balance: 000800.00" and balance is updated to 800.00 | | | |
| TC-006 | Debit account with amount equal to balance | System is running with balance of 1000.00 | 1. Select menu option 3 (Debit Account)<br>2. Enter amount: 1000.00 | Display message "Amount debited. New balance: 000000.00" and balance becomes 0 | | | Test boundary condition where debit equals balance |
| TC-007 | Debit account with amount exceeding balance | System is running with balance of 1000.00 | 1. Select menu option 3 (Debit Account)<br>2. Enter amount: 1500.00 | Display message "Insufficient funds for this debit." and balance remains 1000.00 | | | Validation: debit should fail if amount exceeds balance |
| TC-008 | Debit account with amount of 0.01 more than balance | System is running with balance of 1000.00 | 1. Select menu option 3 (Debit Account)<br>2. Enter amount: 1000.01 | Display message "Insufficient funds for this debit." and balance remains 1000.00 | | | Test boundary condition at edge of insufficient funds |
| TC-009 | Multiple sequential credits | System is running with initial balance of 1000.00 | 1. Select menu option 2 (Credit Account)<br>2. Enter amount: 100.00<br>3. Confirm new balance is 1100.00<br>4. Select menu option 2 again<br>5. Enter amount: 50.00<br>6. Confirm new balance is 1150.00 | First credit: balance = 1100.00; Second credit: balance = 1150.00; Both operations persist | | | Test that balances persist across multiple operations |
| TC-010 | Multiple sequential debits | System is running with initial balance of 1000.00 | 1. Select menu option 3 (Debit Account)<br>2. Enter amount: 200.00<br>3. Confirm new balance is 800.00<br>4. Select menu option 3 again<br>5. Enter amount: 150.00<br>6. Confirm new balance is 650.00 | First debit: balance = 800.00; Second debit: balance = 650.00; Both operations persist | | | Test that balances persist across multiple operations |
| TC-011 | Mixed credit and debit operations | System is running with initial balance of 1000.00 | 1. Credit 200.00 (balance = 1200.00)<br>2. Debit 150.00 (balance = 1050.00)<br>3. Credit 300.00 (balance = 1350.00)<br>4. View Balance to verify final balance | All operations succeed with correct intermediate and final balance of 1350.00 | | | Test combination of credit and debit operations |
| TC-012 | Credit followed by debit exceeding new balance | System is running with initial balance of 1000.00 | 1. Credit 100.00 (balance = 1100.00)<br>2. Debit 1100.00 (balance should become 0)<br>3. Attempt to debit 500.00 | First two operations succeed with balance = 0.00; Third debit fails with message "Insufficient funds for this debit." | | | Test debit validation after credit operation |
| TC-013 | Invalid menu choice - negative number | System is running and displaying menu | 1. Enter choice: -1 | Display message "Invalid choice, please select 1-4." and return to menu | | | Test input validation for invalid negative choice |
| TC-014 | Invalid menu choice - number outside range | System is running and displaying menu | 1. Enter choice: 5 | Display message "Invalid choice, please select 1-4." and return to menu | | | Test input validation for choice outside valid range |
| TC-015 | Invalid menu choice - non-numeric input | System is running and displaying menu | 1. Enter choice: A | Display message "Invalid choice, please select 1-4." or system error handling | | | Test input validation for non-numeric entry |
| TC-016 | Exit program - option 4 | System is running with menu displayed | 1. Select menu option 4 (Exit) | Display message "Exiting the program. Goodbye!" and program terminates | | | |
| TC-017 | Menu display correctness | System is started | Display the menu | Menu displays all four options:<br>1. View Balance<br>2. Credit Account<br>3. Debit Account<br>4. Exit | | | Verify menu text and numbering |
| TC-018 | Balance persistence after multiple operations | System is running with initial balance of 1000.00 | 1. Credit 50.00 (balance = 1050.00)<br>2. View balance<br>3. Exit program<br>4. Restart program | After restart, initial balance displayed is 1000.00 (not 1050.00) | | | Test data persistence behavior (expected: no persistence between sessions) |
| TC-019 | Debit with fractional amount | System is running with balance of 1000.50 | 1. Select menu option 3 (Debit Account)<br>2. Enter amount: 0.25 | Display message "Amount debited. New balance: 001000.25" and balance updated correctly | | | Test decimal precision in debit operations |
| TC-020 | Credit with fractional amount | System is running with balance of 1000.00 | 1. Select menu option 2 (Credit Account)<br>2. Enter amount: 0.75 | Display message "Amount credited. New balance: 001000.75" and balance updated correctly | | | Test decimal precision in credit operations |
| TC-021 | Zero credit amount | System is running with balance of 1000.00 | 1. Select menu option 2 (Credit Account)<br>2. Enter amount: 0.00 | Display message "Amount credited. New balance: 001000.00" (no change in balance) | | | Test edge case with zero credit |
| TC-022 | Zero debit amount | System is running with balance of 1000.00 | 1. Select menu option 3 (Debit Account)<br>2. Enter amount: 0.00 | Display message "Amount debited. New balance: 001000.00" (no change in balance) | | | Test edge case with zero debit |
| TC-023 | Verify balance display format | System displays a balance | Balance is displayed | Balance is displayed in format: ###.## (e.g., 001000.00 for 1000.00) | | | Verify correct formatting of currency display |
| TC-024 | Menu loop continues after operation | System is running with operations performed | 1. Select option 1 (View Balance)<br>2. Complete operation<br>3. Verify menu redisplays | Menu displays again allowing multiple operations without restarting | | | Test that menu loops correctly |
| TC-025 | Consecutive failed debit attempts | System is running with balance of 500.00 | 1. Attempt debit 1000.00 (fails)<br>2. Verify balance remains 500.00<br>3. Attempt debit 600.00 (fails)<br>4. Verify balance remains 500.00 | Both debit attempts fail; balance remains 500.00 after each failed attempt | | | Test that failed operations don't corrupt balance |

---

## Test Summary

**Total Test Cases:** 25

### Test Case Categories:

1. **Basic Operations (TC-001, TC-002, TC-005, TC-016):** Core functionality - View, Credit, Debit, Exit
2. **Boundary Conditions (TC-003, TC-004, TC-006, TC-008, TC-020, TC-022):** Extreme values and edge cases
3. **Validation & Error Handling (TC-007, TC-008, TC-013, TC-014, TC-015, TC-021, TC-025):** Input validation and error scenarios
4. **Data Consistency (TC-009, TC-010, TC-011, TC-012, TC-024):** Multiple operations and balance persistence
5. **Display & Format (TC-017, TC-023):** User interface and output formatting
6. **Integration Tests (TC-018, TC-019):** System behavior across sessions and operations

### Business Logic Validated:

- ✓ Account balance initialization (1000.00)
- ✓ Credit operation (adds to balance)
- ✓ Debit operation (subtracts from balance)
- ✓ Insufficient funds validation (debit fails if amount > balance)
- ✓ Decimal precision handling (.00, .01, .99, etc.)
- ✓ Balance persistence within session
- ✓ Menu-driven interface with valid input handling
- ✓ Program termination on exit selection
- ✓ Error messages for invalid operations
- ✓ Currency formatting in display

---

## Notes for Node.js Implementation

When migrating this logic to Node.js, ensure the following:

1. **State Management:** Implement a data store (database or in-memory) to manage the current balance
2. **Input Validation:** Validate numeric inputs and ensure amount > 0 for operations
3. **Transaction Logic:** Implement the debit validation (amount <= balance) before performing the operation
4. **API Design:** Create endpoints for:
   - `GET /balance` - View balance
   - `POST /credit` - Credit account
   - `POST /debit` - Debit account
   - `POST /validate-debit` - Validate if debit is possible
5. **Error Handling:** Implement proper error responses for invalid operations
6. **Data Persistence:** Choose appropriate persistence layer (database, file system, etc.)
7. **Testing:** Use these test cases to create unit tests and integration tests in Jest or similar framework
