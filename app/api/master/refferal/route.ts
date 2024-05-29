import { Refferal } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/components/prisma";

export const dynamic = 'force-dynamic'

export const GET = async (req: NextRequest) => {
    const result = await prisma.refferal.findMany({where: {is_active: true}});
    return NextResponse.json(result, {status: 200, statusText: "OK"});
}

export const POST = async (req: NextRequest) => {
    const data:Refferal = await req.json();
    try{
        const find = await prisma.refferal.findFirst({where: {name: data.name}});
        if(find && find.is_active === false){
            await prisma.refferal.update({where: {name: data.name}, data: {name: data.name, is_active: true}});
            return NextResponse.json({msg: "Data refferal berhasil ditambahkan"}, {status: 201, statusText: "OK"});
        }
        const saveData = await prisma.refferal.create({data: data});
        return NextResponse.json({msg: "Data refferal berhasil ditambahkan"}, {status: 201, statusText: "OK"});
    }catch(err){
        console.log(err);
        return NextResponse.json({msg: "Server Error"}, {status: 500, statusText: "INTERNAL SERVER ERROR"});
    }
}

export const PUT = async(req: NextRequest) => {
    const data:Refferal = await req.json();
    try{
        const find = await prisma.refferal.findFirst({where: {id: data.id}});
        if(!find) return NextResponse.json({msg: "Data refferal tidak ditemukan"}, {status: 404, statusText: "NOT FOUND"});
        await prisma.refferal.update({
            where: {id: data.id},
            data: {
                name: data.name
            }
        });
        return NextResponse.json({msg: "Update data refferal berhasil"}, {status: 200, statusText: "OK"});
    }catch(err){
        console.log(err);
        return NextResponse.json({msg: "Server Error"}, {status: 500, statusText: "INTERNAL SERVER ERROR"});
    }
}

export const DELETE = async (req: NextRequest) => {
    const {id} = await req.json();
    try{
        const find = await prisma.refferal.findFirst({where: {id: id}});
        if(!find) return NextResponse.json({msg: "Data refferal tidak ditemukan"}, {status: 404, statusText: "NOT FOUND"});
        await prisma.refferal.update({
            where: {id: id},
            data: {
                is_active: false
            }
        });
        return NextResponse.json({msg: "Data refferal berhasil dihapus"}, {status: 200, statusText: "OK"});
    }catch(err){
        console.log(err);
        return NextResponse.json({msg: "Server Error"}, {status: 500, statusText: "INTERNAL SERVER ERROR"});
    }
}