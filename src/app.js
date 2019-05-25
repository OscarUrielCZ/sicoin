const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/sicoin', { useNewUrlParser: true })
    .then(() => {
        const app = require('./server/index');

        app.listen(app.get('port'), () => {
            console.log('Server on port', app.get('port'));
        });
    })
    .catch(err => console.log(err));