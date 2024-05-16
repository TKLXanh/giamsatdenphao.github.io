const express = require("express");
const session = require("express-session");
const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = "mongodb+srv://admin:admin@cluster0.tsod3fd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

const app = express();
const port = 3001;

app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

// Cấu hình session middleware
app.use(session({
    secret: 'secret_key', // Chuỗi bí mật để ký và mã hóa session ID
    resave: false,
    saveUninitialized: true
}));

app.listen(port, () => {
    console.log('Server is running on port: ', port);
});

let collectionUser;
let collectionDeviceData;

client.connect()
    .then(() => {
        console.log('Connected successfully to MongoDB!');
        const db = client.db("DENPHAO");
        collectionUser = db.collection('UserAccounts');
        collectionDeviceData = db.collection('Device');
        app.post('/login', async (req, res) => {
            try {
                const user = await collectionUser.findOne({ UserName: req.body.Username });
                if (!user) {
                    return res.render("login", { validAlert: "Username not found" });
                }
                if (req.body.Password === user.Password) {
                    const devices = await collectionDeviceData.find().toArray();
                    // Truyền dữ liệu đến trang home
                    const deviceData = devices.map(device => ({
                        name: device.Name,
                        status: device.Status,
                        battery: device.Battery
                    }));
                    
                    // Lưu trạng thái đăng nhập vào session
                    req.session.loggedIn = true;
                    // Đăng nhập thành công, chuyển hướng đến trang home
                    return res.render("home", { deviceData })
                } else {
                    return res.render("login", { validAlert: "Incorrect password" });
                }
            } catch (err) {
                console.error('Error during login process:', err);
                return res.render("login", { validAlert: "An error occurred. Please try again." });
            }
        });
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err);
    });

// Route cho trang home
app.get('/home', (req, res) => {
    // Kiểm tra xem người dùng đã đăng nhập hay chưa
    if (!req.session.loggedIn) {
        // Nếu chưa đăng nhập, chuyển hướng đến trang đăng nhập
        return res.redirect("/");
    }
    // Nếu đã đăng nhập, hiển thị trang home
    res.render("home");
});

// Route cho trang đăng nhập
app.get('/', (req, res) => {
    res.render("login");
});
