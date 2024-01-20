const prompt = require('prompt-sync')();

// Game constants
const ROWS = 3;
const COLS = 3;
const SYMBOLS_COUNT = {
    X: 2,
    O: 4,
    Y: 6,
    Z: 8
};

const SYMBOLS_VALUES = {
    X: 5,
    O: 4,
    Y: 3,
    Z: 2
};

// Function to get initial deposit from the player
const deposit = () => {
    while (true) {
        const depositAmount = prompt("Enter a deposit amount not below 500: ");
        const numberDepositAmount = parseFloat(depositAmount);

        if (isNaN(numberDepositAmount) || numberDepositAmount <= 500) {
            console.log("Invalid deposit amount, try again.");
        } else {
            return numberDepositAmount;
        }
    }
};

// Function to get the number of lines to bet on
const getNumberOfLines = () => {
    while (true) {
        const Lines = prompt("Enter the number of lines to bet on (1-3): ");
        const numberOfLines = parseFloat(Lines);

        if (isNaN(numberOfLines) || numberOfLines <= 0 || numberOfLines > 3) {
            console.log("Invalid number of lines, try again.");
        } else {
            return numberOfLines;
        }
    }
};

// Function to get the total bet per line
const getBet = (balance, lines) => {
    while (true) {
        const bet = prompt("Enter the total bet per line: ");
        const numberBet = parseFloat(bet);

        if (isNaN(numberBet) || numberBet <= 0 || numberBet > balance / lines) {
            console.log("Invalid bet, try again.");
        } else {
            return numberBet;
        }
    }
};

// Function to simulate spinning the reels
const spin = () => {
    const resultSymbols = [];
    for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)) {
        for (let i = 0; i < count; i++) {
            resultSymbols.push(symbol);
        }
    }

    const reels = [];
    for (let i = 0; i < COLS; i++) {
        reels.push([]);
        const reelSymbols = [...resultSymbols];
        for (let j = 0; j < ROWS; j++) {
            const randomIndex = Math.floor(Math.random() * reelSymbols.length);
            const selectedSymbol = reelSymbols[randomIndex];
            reels[i].push(selectedSymbol);
            reelSymbols.splice(randomIndex, 1);
        }
    }

    return reels;
};

// Function to transpose the reels
const transpose = (reels) => {
    const rows = [];
    for (let i = 0; i < ROWS; i++) {
        rows.push([]);
        for (let j = 0; j < COLS; j++) {
            rows[i].push(reels[i][j]);
        }
    }
    return rows;
};

// Function to print the rows
const printRows = (rowsArray) => {
    for (const row of rowsArray) {
        let rowString = " ";
        for (const [i, symbol] of row.entries()) {
            rowString += symbol;
            if (i !== row.length - 1) {
                rowString += "|";
            }
        }
        console.log(rowString);
    }
};

// Function to calculate winnings
const getwinnings = (rows, bet, lines) => {
    let winnings = 0;
    for (let row = 0; row < lines; row++) {
        const symbols = rows[row];
        let allSame = true;
        for (const symbol of symbols) {
            if (symbol != symbols[0]) {
                allSame = false;
                break;
            }
        }
        if (allSame) {
            winnings += bet * SYMBOLS_VALUES[symbols[0]];
        }
    }
    return winnings;
};

// Main game function
const game = () => {
    let balance = deposit();

    while (true) {
        console.log("You have a balance of sh" + balance);

        const numberOfLines = getNumberOfLines();
        const bet = getBet(balance, numberOfLines);
        balance -= bet * numberOfLines;

        const reels = spin();
        const rows = transpose(reels);

        console.log(reels);
        console.log(rows);
        printRows(rows);

        const winnings = getwinnings(rows, bet, numberOfLines);
        balance += winnings;
        console.log("You won 🥳🥳 0sh" + winnings.toString());

        if (balance <= 0) {
            console.log("You ran out of money😥!");
            break;
        }

        const playAgain = prompt("Do you want to play again? (y/n)");
        if (playAgain.toLowerCase() !== "y") break;
    }
};

// Start the game
game();
