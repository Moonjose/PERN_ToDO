const express = require("express");
const {PrismaClient} = require("@prisma/client");

const prisma = new PrismaClient();

const toDosRoutes = express.Router()

// C
toDosRoutes.post("/todos", async (req, res) => {
    const {name} = req.body;
    const todo = await prisma.todo.create({data:{
        name,
    }});

    return res.status(201).json(todo);
})
// R
toDosRoutes.get("/todos", async (req, res) => {
    const todos = await prisma.todo.findMany();
    return res.status(200).json(todos);
})
// U
toDosRoutes.put("/todos", async (req, res) => {
    const {name, id, status} = req.body;

    if (!id){
        return res.status(400).json("ID is mandatory!")
    }

    const todoAlreadyExists = await prisma.todo.findUnique({
        where: {
            id
        }
    });

    if (!todoAlreadyExists) {
        return res.status(404).json("ID not exist!")
    }

    const todo = await prisma.todo.update({
        where:{
            id,
        },
        data: {
            name,
            status,
        }
    });
    return res.status(200).json(todo);
})
// D
toDosRoutes.delete("/todos/:id", async (req, res) => {
    const { id } = req.params;
    const parsedID = parseInt(id);

    if (!parsedID){
        return res.status(400).json("ID is mandatory!")
    }

    const todoAlreadyExists = await prisma.todo.findUnique({
        where: {
            id: parsedID
        }
    });

    if (!todoAlreadyExists) {
        return res.status(404).json("ID not exist!")
    }

    await prisma.todo.delete({
        where:{
            id: parsedID
        }
    });
    return res.status(200).send();
})

toDosRoutes.delete("/nuke", async (req, res) => {
    await prisma.todo.deleteMany();
    return res.status(200).json("All itens deleted!");
})
module.exports = toDosRoutes;
