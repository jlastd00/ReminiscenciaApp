import app from './app.js';

import './utils/database.js';

app.listen(app.get('port'), () => {
    console.log('Server running on port', app.get('port'));
});
