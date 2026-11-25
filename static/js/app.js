document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("billForm");
    const result = document.getElementById("result");

    if (form) {
        form.addEventListener("submit", async function (event) {
            event.preventDefault();

            const units = Number(document.getElementById("units").value);
            const rate = Number(document.getElementById("rate").value);

            if (!Number.isFinite(units) || !Number.isFinite(rate) ||
                units <= 0 || rate <= 0) {
                result.textContent = "Please enter valid positive numbers.";
                return;
            }

            const csrfInput = form.querySelector(
                'input[name="csrfmiddlewaretoken"]'
            );

            result.textContent = "Saving your electricity bill...";

            try {
                const response = await fetch("/bills/", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRFToken": csrfInput ? csrfInput.value : ""
                    },
                    body: JSON.stringify({
                        units: units,
                        rate_per_unit: rate
                    })
                });

                const contentType = response.headers.get("content-type") || "";

                if (!contentType.includes("application/json")) {
                    throw new Error(
                        "Server returned an HTML error instead of JSON. HTTP " +
                        response.status
                    );
                }

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || "Unable to save bill.");
                }

                result.textContent =
                    "Bill saved successfully! Amount: INR " +
                    Number(data.total_amount).toFixed(2) +
                    " | Bill ID: " + data.id;

            } catch (error) {
                result.textContent = "Error: " + error.message;
            }
        });
    }

    document.querySelectorAll(".nav-link").forEach(function (link) {
        link.addEventListener("click", function () {
            document.querySelectorAll(".nav-link").forEach(function (item) {
                item.classList.remove("active");
            });
            link.classList.add("active");
        });
    });
});
