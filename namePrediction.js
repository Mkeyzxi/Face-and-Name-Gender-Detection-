const predictGenderFromName = async (name) => {
    const response = await fetch('data.json');
    const data = await response.json();

    const nameWords = name.toLowerCase().split(' ');

    const usersWithName = data.users.filter(user => {
    const userWords = user.name.toLowerCase().split(' ');
    return nameWords.some(word => userWords.includes(word));
    });

    if (usersWithName.length === 0) {
      // jika tidak ditemukan dalam data, gunakan heuristik
    predictGenderByPattern(name);
    return;
    }

    const genderCounts = usersWithName.reduce((counts, user) => {
        counts[user.gender] =  (counts[user.gender] || 0) + 1;
        return counts;
    }, {});

    const predictedGender = Object.keys(genderCounts).reduce((a, b) => genderCounts[a] > genderCounts[b] ? a : b);

    const totalOccurrences = usersWithName.length;
    const accuracy = ((genderCounts[predictedGender] / totalOccurrences) * 100).toFixed(2);

    if (accuracy == 50.00) {
        document.getElementById('result').innerText = `Name Prediction : female and male (Accuracy: ${accuracy}%)`;
    } else {
        document.getElementById('result').innerText = `Name Prediction : ${predictedGender} (Accuracy: ${accuracy}%)`;
        document.getElementById('result').classList.add('translate-x-0')
        document.getElementById('result').classList.remove('translate-x-5')
    }
};

const predictGenderByPattern = (name) => {
const nameLower = name.toLowerCase();

    let predictedGender;
    if (nameLower.endsWith('a') || nameLower.endsWith('i') || nameLower.endsWith('h') || nameLower.endsWith('s')) {
        predictedGender = 'female';
    } else if (nameLower.endsWith('o') || nameLower.endsWith('u') || nameLower.endsWith('r')) {
        predictedGender = 'male';
    } else {
        predictedGender = 'unknown';
    }

    document.getElementById('result').innerText = `Name Prediction : ${predictedGender} (by prediction)`;
    document.getElementById('result').classList.add('translate-x-0')
    document.getElementById('result').classList.remove('translate-x-5')
};

document.getElementById('genderPredictionForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const name = document.getElementById('nameInput').value;
    predictGenderFromName(name);
});