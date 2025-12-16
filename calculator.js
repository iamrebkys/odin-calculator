function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function divide(a, b) {
    if (b === 0) {
        throw new Error("Division by zero is not allowed.");
    }
    return a / b;
}

function operate(operator, a, b) {
    switch (operator) {
        case '+':
            return add(a, b);
        case '-':
            return subtract(a, b);
        case '*':
            return multiply(a, b);
        case '/':
            return divide(a, b);
        default:
            throw new Error("Invalid operator.");
    }
}

// Calculator states
let currentValue = "0";
let firstValue = null;
let operator = null;
let waitingForSecond = false; // Boolean: did we just press an operator?


// Update the display
const displayEl = document.getElementById("displayValue");

function updateDisplay() {
    displayEl.textContent = currentValue;
}

updateDisplay();

// Input Handlers
function inputDigit(digit) {
    // Case 1: If an operator is pressed, refresh for the next number
    if (waitingForSecond) {
        currentValue = digit;
        waitingForSecond = false;
        updateDisplay();
        return;
    }

    // Case 2: Avoid leading zeros (Normal typing)
    currentValue = (currentValue === "0") ? digit : currentValue + digit; //e.g. "0" + "5" -> "05" == "5"
    updateDisplay();
}

function inputDecimal() {
    // If an operator was pressed, we start the next number as "0"
    if (waitingForSecond) {
        currentValue = "0.";
        waitingForSecond = false;
        updateDisplay();
        return;
    }

    // Prevent multiple decimal points
    if (currentValue.includes(".")) return;

    currentValue += ".";
    updateDisplay();
    
}

function handleOperator(nextOp) {
    const inputNumber = Number(currentValue);

    // Scenerio 1: first operator press -> store firstValue & operator
    if (firstValue === null) {
        firstValue = inputNumber;
        operator = nextOp;
        waitingForSecond = true;
        return;
    }

    // Scenerio 2: Operator change
    if (waitingForSecond) {
        operator = nextOp;
        return;
    }

    // Scenerio 3: Chaining calculations (already has firstValue AND typed another operator and num)
    try {
        const result = operate(operator, firstValue, inputNumber);
        currentValue = String(result);
        firstValue = result;
        operator = nextOp;
        waitingForSecond = true;
        updateDisplay();
    } catch (err) {
        currentValue = "Error";
        firstValue = null;
        operator = null;
        waitingForSecond = false;
        updateDisplay();
        console.error(err);
    }
}

function handleEquals() {
    // Runs only if there is already an operator and firstValue
    if (operator === null || firstValue === null) return;

    const secondValue = Number(currentValue);

    try {
        const result = operate(operator, firstValue, secondValue);
        currentValue = String(result);

        // Resets so that user can start a new calculation
        firstValue = null;
        operator = null;
        waitingForSecond = false;

        updateDisplay();
    } catch (err) {
        currentValue = "Error";
        firstValue = null;
        operator = null;
        waitingForSecond = false;
        updateDisplay();
        console.error(err);
    }
}

function handleClear() {
    currentValue = "0";
    firstValue = null;
    operator = null;
    waitingForSecond = false;
    updateDisplay();
}

function handleDelete() {
    // Don't delete right after pressing operator
    if (waitingForSecond) return;

    currentValue = currentValue.length > 1 ? currentValue.slice(0, -1) : "0";
    updateDisplay();
}

// Event Listeners
document.querySelectorAll(".btnNumber").forEach(btn => {
    btn.addEventListener("click", () => {
        const val = btn.textContent.trim();
        if (val === ".") inputDecimal();
        else inputDigit(val);
    });
});

document.querySelectorAll(".btnOperator").forEach(btn => {
    const symbol = btn.textContent.trim();

    if (symbol === "=") {
        btn.addEventListener("click", handleEquals);
    } else {
        const op = symbol === "×" ? "*" : symbol === "÷" ? "/" : symbol;
        btn.addEventListener("click", () => handleOperator(op));
    }
});

document.getElementById("clear")?.addEventListener("click", handleClear);
document.getElementById("delete")?.addEventListener("click", handleDelete);
