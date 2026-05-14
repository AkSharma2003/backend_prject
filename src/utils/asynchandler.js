const asyncHandler=(requastHandler)=>{
    return (req,res,next)=>{
        Promise.resolve(requastHandler(req,res,next))
        .catch((err)=>next(err))
    }
}

export { asyncHandler }