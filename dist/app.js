"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var mongodb_1 = require("mongodb");
var consolidate_1 = __importDefault(require("consolidate"));
var bcryptjs_1 = __importDefault(require("bcryptjs"));
//import bodyParser from "body-Parser"
var path_1 = __importDefault(require("path"));
var express_flash_1 = __importDefault(require("express-flash"));
var express_session_1 = __importDefault(require("express-session"));
// Our Express APP config
var app = (0, express_1.default)();
app.use(express_1.default.json());
var PORT = 3000;
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
app.set('view engine', 'html');
app.engine('html', consolidate_1.default.mustache);
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, express_flash_1.default)());
app.use((0, express_session_1.default)({
    secret: 'somevalue',
    resave: false,
    saveUninitialized: false
}));
//listen to port
app.listen(process.env.PORT || PORT, function () {
    console.log("Port is open at ".concat(PORT));
});
//connecting to mongodb
var url = 'mongodb://user:abc123@localhost:27017/?authMechanism=DEFAULT&authSource=users';
var Dbname = "users";
var client = new mongodb_1.MongoClient(url);
var db;
var connect = function (dbName) {
    if (dbName === void 0) { dbName = Dbname; }
    return __awaiter(void 0, void 0, void 0, function () {
        var conn;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, client.connect()];
                case 1:
                    conn = _a.sent();
                    db = conn.db(dbName);
                    return [2 /*return*/, client];
            }
        });
    });
};
connect();
//Get main page
app.get('/', function (req, res) {
    res.render('index');
});
//GET login page
app.get('/login', function (req, res) {
    res.render('login');
});
// GET register page 
app.get('/register', function (req, res) {
    res.render('register');
});
//POST method for login page
app.post('/login', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, hashedpwd, passw, email;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = {
                    email: req.body.email
                };
                return [4 /*yield*/, bcryptjs_1.default.hash(req.body.password, 10)];
            case 1:
                user = (_a.password = _b.sent(),
                    _a);
                hashedpwd = JSON.stringify(db.collection('regusers').findOne({ password: { $eq: user.password } }));
                passw = JSON.stringify(bcryptjs_1.default.compare(user.password, hashedpwd));
                email = db.collection('regusers').findOne({ email: { $eq: user.email } });
                // const result =  db.collection('regusers').find({},{ projection: { _id: 0, firstname:0,lastname:0,email: 1, password: 1 } }).toArray          
                res.render('login', { hashedpwd: hashedpwd, passw: passw, email: email });
                return [2 /*return*/];
        }
    });
}); });
//register user using POST method with encrypted password
app.post('/register', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = {
                    id: Date.now().toString(),
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                    email: req.body.email
                };
                return [4 /*yield*/, bcryptjs_1.default.hash(req.body.password, 10)];
            case 1:
                data = (_a.password = _b.sent(),
                    _a);
                db.collection('regusers').findOne({ email: req.body.email })
                    .then(function (email) {
                    if (email) {
                        var errors = 'Email already exists';
                        res.render('register', {
                            errors: errors
                        });
                        console.log("User already exist");
                    }
                    else {
                        db.collection('regusers').insertOne(data);
                        var success = 'Successfully registered';
                        res.render('index', { success: success });
                    }
                });
                return [2 /*return*/];
        }
    });
}); });
app.get('/Events', function (req, res) {
    db.collection('Events').find({}, { projection: { _id: 0, Event: 1, Time: 1 } }).toArray(function (err, result) {
        if (err)
            console.log("Error");
        else
            result = JSON.stringify(result);
        res.render('Events', { result: result });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6Ii4vc3JjLyIsInNvdXJjZXMiOlsiYXBwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUEsb0RBQXFEO0FBR3JELG1DQUFtQztBQUNuQyw0REFBaUM7QUFDakMsc0RBQTZCO0FBQzdCLHNDQUFzQztBQUN0Qyw4Q0FBdUI7QUFDdkIsZ0VBQWlDO0FBQ2pDLG9FQUFxQztBQUlyQyx5QkFBeUI7QUFDekIsSUFBTSxHQUFHLEdBQUcsSUFBQSxpQkFBTyxHQUFFLENBQUM7QUFDdEIsR0FBRyxDQUFDLEdBQUcsQ0FBQyxpQkFBTyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7QUFDeEIsSUFBTSxJQUFJLEdBQUMsSUFBSSxDQUFBO0FBQ2YsR0FBRyxDQUFDLEdBQUcsQ0FBQyxpQkFBTyxDQUFDLE1BQU0sQ0FBQyxjQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDeEQsR0FBRyxDQUFDLEdBQUcsQ0FBQyxhQUFhLEVBQUMsTUFBTSxDQUFDLENBQUE7QUFDN0IsR0FBRyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUMscUJBQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQTtBQUNuQyxHQUFHLENBQUMsR0FBRyxDQUFDLGlCQUFPLENBQUMsVUFBVSxDQUFDLEVBQUMsUUFBUSxFQUFFLEtBQUssRUFBQyxDQUFDLENBQUMsQ0FBQTtBQUc5QyxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUEsdUJBQUssR0FBRSxDQUFDLENBQUE7QUFDaEIsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFBLHlCQUFPLEVBQUM7SUFDWixNQUFNLEVBQUUsV0FBVztJQUNuQixNQUFNLEVBQUUsS0FBSztJQUNiLGlCQUFpQixFQUFFLEtBQUs7Q0FDM0IsQ0FBQyxDQUFDLENBQUE7QUFHSCxnQkFBZ0I7QUFDaEIsR0FBRyxDQUFDLE1BQU0sQ0FBQyxP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