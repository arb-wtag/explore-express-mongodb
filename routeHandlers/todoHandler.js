const express=require('express');
const mongoose=require('mongoose');
const router=express.Router();
const todoSchema=require('../schemas/todoSchema');
const userSchema=require('../schemas/userSchema')
const Todo=mongoose.models.Todo || mongoose.model('Todo',todoSchema);
const checkLogin=require('../middlewares/checkLogin');
const User=mongoose.models.User || mongoose.model('User',userSchema);


router.get('/active',async(req,res)=>{
    const todo=new Todo();
    const data= await todo.findActive();
    res.status(200).json({
        data,
    });
});

router.get('/db',async(req,res)=>{
    const data= await Todo.findByDB();
    res.status(200).json({
        data,
    });
});

router.get('/language',async(req,res)=>{
    const data= await Todo.find().byLanguage('joss');
    res.status(200).json({
        data,
    });
});

router.get('/',checkLogin,async(req,res)=>{
    try{
        const data=await Todo.find({'status':'active'}).populate("user","name username");
        res.status(200).json({
            'result':data,
            'message': 'Get Todo is successful'
        });
    }
    catch(error)
    {
        res.status(500).json({
            'error': 'There was a server side error!',
        });
    }
});

router.get('/:id',async(req,res)=>{
    try{
        const data=await Todo.find({_id:req.params.id});
        res.status(200).json({
            'result':data,
            'message': 'Get Todo is successful'
        });
    }
    catch(error)
    {
        res.status(500).json({
            'error': 'There was a server side error!',
        });
    }
});

router.post('/',checkLogin,async(req,res)=>{
    const newTodo=new Todo({
        ...req.body,
        user: req.userId
    });
    try{
        const currentTodo=await newTodo.save();
        await User.updateOne({
            _id: req.userId
        },{
            $push: {
                todos: currentTodo._id
            }
        });
        res.status(200).json({
            'message': 'Todo was successfully inserted!',
        });
    }
    catch(error)
    {
        console.log(error);
        res.status(500).json({
            'error': 'There was a server side error',
        });
    }
});

router.post('/all',async(req,res)=>{
    try{
        await Todo.insertMany(req.body);
        res.status(200).json({
            'message': 'Todos were inserted successfully',
        });
    }
    catch(error)
    {
        res.status(500).json({
            'error':'There was a server side error!',
        });
    }
});

router.put('/:id',async(req,res)=>{
    try
    {
        await Todo.updateOne({_id:req.params.id},
            {
                $set: {
                    status: "active",
                },
            },
        );
        res.status(200).json({
            'message':"Todo was updated successfully!",
        });
    }
    catch(error)
    {
        res.status(500).json({
            'error':'There was a server side error!',
        });
    }
});

router.delete('/:id',async(req,res)=>{
    try{
        await Todo.deleteOne({_id:req.params.id});
        res.status(200).json({
            'message': 'Todo is deleted successfully'
        });
    }
    catch(error)
    {
        res.status(500).json({
            'error': 'There was a server side error!',
        });
    }
});

module.exports=router;