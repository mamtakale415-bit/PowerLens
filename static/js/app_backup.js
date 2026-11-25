document.getElementById('billForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const units = Number(document.getElementById('units').value);
    const rate = Number(document.getElementById('rate').value);
    const result = document.getElementById('result');

    if (!Number.isFinite(units) || !Number.isFinite(rate) || units < 0 || rate < 0) {
        result.textContent = 'Please enter valid non-negative numbers.';
        return;
    }

    const amount = units * rate;
    result.textContent = 'Estimated electricity charge: INR ' +
        amount.toFixed(2) + ' (' + units + ' units x INR ' + rate + ' per unit).';
});
