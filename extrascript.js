/* Update Name on homepage */

document.getElementById("fname").addEventListener("keypress", function(event) {
    if (event.key === "Enter") { // Check if the pressed key is "Enter"
        event.preventDefault(); // Prevent the default action (optional)
        document.getElementById("enterButton").click(); // Trigger the button click
    }
});

function handleClick() {
    var name = document.getElementById("fname").value;

    if (name.trim() !== "") {
        localStorage.setItem("userName", name);
    } else {
        localStorage.setItem("userName", "Trainer");
    }

    window.location.href = 'index.html'; // Redirect to the next page
}