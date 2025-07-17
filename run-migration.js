const { exec } = require('child_process');

console.log('Running TypeORM migration...');

exec('npm run migration:run', (error, stdout, stderr) => {
  if (error) {
    console.error('Error running migration:', error);
    return;
  }
  if (stderr) {
    console.error('Migration stderr:', stderr);
  }
  console.log('Migration output:', stdout);
  console.log('Migration completed successfully!');
}); 