const fs = require('fs');
const csv = require('csv-parser');
const KNN = require('ml-knn');
const prompt = require('prompt-sync')({ sigint: true });

let cars = [];
let brandEncoder = {};
let brandDecoder = {};
let knnModel;

// Load and preprocess data
function loadData(callback) {
    fs.createReadStream("D:/Users/suraj/Downloads/final.csv")  // Adjust path as needed
        .pipe(csv())
        .on('data', (row) => {
            // Assume CSV has 'Brand', 'Model', 'Price', 'Year', and 'CarName' columns
            let brand = row.Brand;
            if (!(brand in brandEncoder)) {
                const encodedValue = Object.keys(brandEncoder).length;
                brandEncoder[brand] = encodedValue;
                brandDecoder[encodedValue] = brand;
            }
            cars.push({
                Brand: brandEncoder[brand],
                Model: row.Model,
                Price: parseFloat(row.Price),
                Year: parseInt(row.Year),
                CarName: row.CarName
            });
        })
        .on('end', () => {
            console.log('CSV file successfully processed.');
            callback();
        });
}

// Train the KNN model
function trainModel() {
    const features = cars.map(car => [car.Brand, car.Price, car.Year]);
    const labels = cars.map(car => car.CarName);
    knnModel = new KNN(features, labels, { k: 5 });  // Train with 5 neighbors
    console.log('KNN model trained.');
}

// Function to make predictions based on user input
function recommendCars(price, year, brand) {
    if (!knnModel) {
        console.error('Model is not trained yet!');
        return;
    }

    // Convert brand to encoded value
    const encodedBrand = brandEncoder[brand];
    if (encodedBrand === undefined) {
        console.log(`Sorry, brand "${brand}" not found in the data.`);
        return;
    }

    // Define price range for recommendations
    const minPrice = price - 500000;  // Adjust the range as desired
    const maxPrice = price + 500000;

    // Filter the dataset based on the input range
    let filteredCars = cars.filter(car => 
        car.Brand === encodedBrand &&
        car.Price >= minPrice &&
        car.Price <= maxPrice &&
        car.Year >= year - 2 &&
        car.Year <= year + 2
    );

    if (filteredCars.length === 0) {
        console.log('No cars match your criteria.');
        return;
    }

    // Prepare features for KNN
    const featureSamples = filteredCars.map(car => [car.Brand, car.Price, car.Year]);
    const predictions = knnModel.predict(featureSamples);

    // Display top recommendations
    console.log("Recommended Cars:");
    filteredCars.slice(0, 5).forEach((car, index) => {
        console.log(`${index + 1}. ${predictions[index]} | Price: ${car.Price} | Year: ${car.Year} | Brand: ${brandDecoder[car.Brand]}`);
    });
}

// Main function
loadData(() => {
    trainModel();

    // User input for car features
    const price = parseFloat(prompt("Enter your price range (e.g., 7000000): "));
    const year = parseInt(prompt("Enter the desired year (e.g., 2020): "));
    const brand = prompt("Enter the car brand (e.g., BMW): ");

    recommendCars(price, year, brand);
});
