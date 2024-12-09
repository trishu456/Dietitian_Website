// about section start
function toggleContent() {
    var moreContent = document.getElementById("more-content");
    var toggleButton = document.getElementById("toggle-button");

    if (moreContent.style.display === "none") {
        moreContent.style.display = "block";
        toggleButton.textContent = "Show Less";
    } else {
        moreContent.style.display = "none";
        toggleButton.textContent = "Show More";
    }
}
// about section end
document.getElementById('disease-select').addEventListener('change', function() {
    const disease = this.value;
    fetch(`/api/diet-chart/${disease}`)
        .then(response => response.json())
        .then(data => {
            const tbody = document.querySelector('#diet-chart-tb tbody');
            tbody.innerHTML = ''; 

            if (data && data.items) {
                data.items.forEach((item, index) => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${index + 1}</td>
                        <td>${item.itemName}</td>
                        <td>${item.value}</td>
                        <td>${item.recommendedFoods.join(', ')}</td>
                    `;
                    tbody.appendChild(row);
                });
            }
        })
        .catch(error => console.error('Error fetching data:', error));
});

// diet-plan start
document.getElementById('userForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const formData = {
        userId: "user_id_here", // Replace with actual user ID from your session or authentication system
        dietPlan: [
            {
                time: "Breakfast",
                item: "Oatmeal with fruits",
                nutrients: {
                    calories: 300,
                    protein: 10,
                    fat: 5,
                    carbs: 55
                }
            },
            // Add more meals here as per your form data
        ]
    };

    fetch('/api/diet-plan', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            alert('Diet plan saved successfully!');
            // You can also redirect or display the diet plan
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
});

// diet-plan end
// bmi script start
document.getElementById('bmi-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const weight = parseFloat(document.getElementById('weight').value);
    const height = parseFloat(document.getElementById('height').value) / 100; // Convert height to meters

    if (weight > 0 && height > 0) {
        const bmi = weight / (height * height);
        document.getElementById('result').innerText = `Your BMI is ${bmi.toFixed(2)}`;
    } else {
        document.getElementById('result').innerText = 'Please enter valid weight and height.';
    }
})
// bmi script end
// calorie  script start



// calorie script end