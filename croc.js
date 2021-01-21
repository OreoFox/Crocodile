const bodyParser = require("body-parser");
const express = require('express');
const hbs = require("hbs");
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server, {
    cors: {
        origin: '*:*',
        methods: ["GET", "POST"]
    }
})
const urlencodedParser = bodyParser.urlencoded({extended: false});
const port = process.env.PORT || 3000;
let names = [];
let nm = ['Alice', 'Kirito', 'Kisagama', 'Asegawa', 'Kurosao']
let themes = ['Чуи', 'Стринги', 'Дарт Вейдер', 'Декольте', 'Лиса', 'Волк', 'Выдра', 'Бегемот', 'Стриптиз', 'Кетчуп', 'Яблоко', 'Кристалл', 'Чайник', 'Подушка', 'Кроссовок'];
let currentTheme = '';
let currentDrawer = '';


app.set("view engine", "hbs");

app.get('/crocodile', (req, res) => {
    res.render('croc.hbs', {
    });
});

app.get('/', (req, res) => {
    res.send('Hello World')
});

app.get('/res', (req, res) => {
    names = [];
});

app.post('/postcomment', urlencodedParser, (req, res) => {
    let message = {
        "name": req.body.nickname,
        "comment": req.body.comment
    };
    io.emit('comment', message);
});

io.sockets.on('connection', socket => {
    socket.on('image', data => {
        if (data.name == currentDrawer) {
            io.emit('draw', data.img);
        } else {
            
        }
    });
    socket.on('clear', data => {
        if (data == currentDrawer) {
            io.emit('clear', data);
        }
    });
    socket.on('comment', data => {
        if (data == currentTheme) {
            changeDrawer();
            io.emit('win')
            io.emit('clear', data);
        }
    });
    socket.on('setname', data => {
        if (names.includes(data.name)) {
            let num = Math.floor(Math.random() * nm.length);
            let name = nm[num]
            names.push(name);
            let newdata = {
                "id": data.id,
                "name": name
            }
            io.emit('changeName', newdata);
        } else {
            names.push(data.name);
        }
        console.log(names);
    });

    setTimeout(() => {
        changeDrawer();
    }, 5000)
});

function changeDrawer() {
    io.emit('clear', 0);
    let drawer = '';
    let theme = '';
    let num = Math.floor(Math.random() * names.length);
    let numt = Math.floor(Math.random() * themes.length);
    drawer = names[num];
    theme = themes[numt];
    currentTheme = theme;
    let data = {
        "drawer": drawer,
        "theme": theme
    }
    console.log(drawer);
    currentDrawer = drawer;
    io.emit('changeDrawer', data);
    io.emit('amIDraw', drawer);
}

server.listen(port, async () => {
    console.log(`Started`);
});
