const errorDev = (err, res) => {
    return res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    })
}

const errorProduction = (err, res) => {
    if(err.isOperational){
        return res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        })
    } else {
        console.log("!!! ERROR !!!");
        return res.status(500).json({
            status: err.status,
            message: "Something went wrong"
        })
    }
}

exports.errorHandler = (err,req,res,next) => {
    //default err object or undefined
    err.statusCode = err.statusCode || 500
    err.status = err.status || "error"

    if(process.env.NODE_ENV === "development"){
        errorDev(err, res)
    } else if (process.env.NODE_ENV === "production"){
        errorProduction(err, res)
    }
}