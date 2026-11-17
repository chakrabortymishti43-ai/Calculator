// Getting the calculator display
const display = document.getElementById("display");

// Getting all calculator buttons
const keys = document.querySelector(".keys");

// Stores the current mathematical expression
let expression = "";
let justCalculated = false;


// Function to update the display
function updateDisplay(value = expression) {
    display.value = value || "0";
}


// Function to handle number and operator clicks
function appendValue(value) {

    const operators = ["+", "-", "*", "/"];

    if (justCalculated && !operators.includes(value)) {
        expression = "";
    }

    justCalculated = false;

    // Prevent multiple decimal points in one number
    if (value === ".") {

        const currentNumber = expression.split(/[+\-*/]/).pop();

        if (currentNumber.includes(".")) return;

        if (currentNumber === "") {
            value = "0.";
        }
    }

    // Handle mathematical operators
    if (operators.includes(value)) {

        if (!expression && value !== "-") return;

        if (operators.includes(expression.slice(-1))) {
            expression = expression.slice(0, -1);
        }
    }

    expression += value;

    updateDisplay();
}


// Function to calculate the result
function calculate() {

    if (!expression || /[+\-*/.]$/.test(expression)) return;

    try {

        // Validate the mathematical expression
        if (!/^[0-9+\-*/.() ]+$/.test(expression)) {
            throw new Error("Invalid input");
        }

        const result = Function(
            '"use strict"; return (' + expression + ')'
        )();

        // Handle division by zero and invalid results
        if (!Number.isFinite(result)) {

            updateDisplay("Cannot divide by 0");

            expression = "";
            justCalculated = true;

            return;
        }

        expression = String(Number(result.toFixed(10)));

        updateDisplay();

        justCalculated = true;

    } catch {

        updateDisplay("Error");

        expression = "";
        justCalculated = true;
    }
}


// Function to clear everything
function clearDisplay() {

    expression = "";
    justCalculated = false;

    updateDisplay();
}


// Function to delete the last character
function deleteLast() {

    expression = expression.slice(0, -1);

    justCalculated = false;

    updateDisplay();
}


// Handle calculator button clicks
keys.addEventListener("click", (event) => {

    const button = event.target.closest("button");

    if (!button) return;

    if (button.dataset.action === "clear") {
        clearDisplay();
    }

    else if (button.dataset.action === "delete") {
        deleteLast();
    }

    else if (button.dataset.action === "calculate") {
        calculate();
    }

    else if (button.dataset.value) {
        appendValue(button.dataset.value);
    }

});


// Handle keyboard input
document.addEventListener("keydown", (event) => {

    if (/^[0-9.]$/.test(event.key)) {
        appendValue(event.key);
    }

    else if (["+", "-", "*", "/"].includes(event.key)) {
        appendValue(event.key);
    }

    else if (event.key === "Enter" || event.key === "=") {
        event.preventDefault();
        calculate();
    }

    else if (event.key === "Backspace") {
        deleteLast();
    }

    else if (event.key === "Escape") {
        clearDisplay();
    }

});