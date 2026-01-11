import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { prisma } from './appDataSource'
import { Whanjeabs } from 'whanjeabs'
import dayjs from 'dayjs'


const env = dotenv.config()


const app = express()


app.use(express.json())
app.use(cors())


let line = new Whanjeabs({ api_key: process.env.WHANJEABS_API_KEY || '', channel_access: process.env.LINE_CHANNEL_ACCESS || '' })

app.get("/list", async (req, res) => {
    let lists = await prisma.list.findMany({
        orderBy: {
            id: 'desc'
        }
    })

    res.status(200).send(lists)
})

app.delete("/list/:id", async (req, res) => {

    let { id } = req.params

    let deleted = await prisma.list.delete({
        where: {
            id: Number(id)
        }
    })

    res.status(200).send({ success: true, message: "Delete Successfully!" })
})


app.post("/list", async (req, res) => {


    let { product, sender, department, from } = req.body

    let lists = await prisma.list.create({
        data: {
            product: product,
            sender: sender,
            from: from,
            department: department,
            status: 0
        }
    })


    // console.log(dayjs(lists.createdAt).format('DD/MM/YY HH:mm'))

    line.push(process.env.ROOM || '', `สินค้า : ${product}\nพนักงาน : ${sender}\nตรวจรับสินค้าเสร็จเมื่อ\n${dayjs(lists.createdAt).format('DD/MM/YY HH:mm')}\n\n${from} -> แผนก${department}\n\n(GR ตรวจรับสินค้าเสร็จสิ้น 🟢)`)

    res.status(201).send({ success: true, message: "Inserted Successfully!" })
})

app.patch("/list", async (req, res) => {


    let { id } = req.body

    let lists = await prisma.list.update({
        data: {
            status: 1
        },
        where: {
            id: id
        }
    })

    line.push(process.env.ROOM || '', `สินค้า : ${lists.product}\nพนักงาน : ${lists.sender}\nตรวจรับสินค้าเสร็จเมื่อ\n${dayjs(lists.createdAt).format('DD/MM/YY HH:mm')}\n\nGR -> แผนก${lists.department}\n\n(PC รับสินค้าสำเร็จ 🟢)`)

    res.status(200).send({ success: true, message: "Updated Successfully!" })
})

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`)
})