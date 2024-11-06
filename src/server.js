import express from "express"
import handlebars from "express-handlebars"
import Handlebars from "handlebars"
import __dirname from "./dirname.js"
import viewsRoutes from "./routes/views.router.js"
import { allowInsecurePrototypeAccess } from "@handlebars/allow-prototype-access";
import cookieParser from "cookie-parser";
import MongoStore from "connect-mongo";
import session from "express-session";
import initializePassport from "./config/passport.config.js"
import passport from 'passport'
import routes from "./routes/index.js"
import env from "./config/config.js"
import args from "./utils/args.util.js"
import { dbConnect } from "./utils/db.util.js"
import winston from "./middlewares/winstonLogger.mid.js"
import errorHandler from "./middlewares/errorHandler.mid.js"
import winstonLogger from "./utils/winston.util.js"

const app = express()
app.use(express.json())
app.use(express.urlencoded({extended:true}))

//const userName = 'juanfelipediez'
//const password = 'Felipe10'
//const dbName = 'base'

app.use(cookieParser());
app.use(
  session({
    secret: "s3cr3t",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
      mongoUrl: env.MONGO_URI,
      ttl: 15,
    }),
  })
);
initializePassport()
app.use(passport.initialize())
app.use(passport.session())


app.engine("handlebars", handlebars.engine({
  handlebars: allowInsecurePrototypeAccess(Handlebars),
}))
app.set("views", __dirname+"/views")
app.set("view engine", "handlebars")
app.use(express.static(__dirname+"/public"))
app.use(winston)
app.use("/api", routes)
app.use('/', viewsRoutes)
app.use(errorHandler)

const httpServer = app.listen(env.PORT, () => {
  winstonLogger.info(`Server is running on port http://localhost:${env.PORT} as ${args.m}`);
})
dbConnect()

