import App from './App';

import dotenv from 'dotenv';

async function main() {
    const app = new App();
    app.start();
}

dotenv.config();

main();
