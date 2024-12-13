/* eslint-disable prettier/prettier */
import fs from 'fs';

const readJsonFile = (filePath) => {
  try {
    const data = fs.readFileSync(filePath, 'utf8'); // Read the file synchronously
    return JSON.parse(data); // Parse the file contents as JSON
  } catch (error) {
    console.error('Error reading JSON file:', error);
    return null;
  }
};

const processData = (data) => {
  // Example: Add a random duration to each workout
  const getRandomDuration = () => {
    const durations = [5, 10, 15, 20];
    const randomIndex = Math.floor(Math.random() * durations.length);
    return durations[randomIndex];
  };

  const getIntensity = () => {
    const intensities = ['low', 'high', 'medium'];
    const randomIndex = Math.floor(Math.random() * intensities.length);
    return intensities[randomIndex];
  };

  const getGoal = () => {
    const goals = [
      'Lose weight',
      'Build muscle',
      'Improve endurance',
      'Increase flexibility',
      'General fitness',
    ];
    const randomIndex = Math.floor(Math.random() * goals.length);
    return goals[randomIndex];
  };

  return data.map((workout) => ({
    name: workout.name,
    duration: getRandomDuration(),
    intensity: getIntensity(),
    instructions: workout.instructions.join(' '),
    muscle_group: [...workout.primaryMuscles, ...workout.secondaryMuscles].join(
      ', ',
    ),
    equipmentRequired: workout.equipment,
    workoutType: workout.category,
    fitness_level: workout.level,
    goal: getGoal(),
  }));
};

const writeJsonFile = (filePath, data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8'); // Write the data to the file with pretty print
    console.log('Data has been written to', filePath);
  } catch (error) {
    console.error('Error writing JSON file:', error);
  }
};

const main = () => {
  const inputFilePath = './exercises.json';
  const outputFilePath = 'output.json';

  const jsonData = readJsonFile(inputFilePath);

  if (jsonData) {
    const processedData = processData(jsonData);
    writeJsonFile(outputFilePath, processedData);
  }
};

main();
