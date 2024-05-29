import { UnitCabang } from "@prisma/client"
import { NextRequest, NextResponse } from "next/server"
import prisma from "@/components/prisma";

export const dynamic = 'force-dynamic'

export const POST = async (req: NextRequest) => {
    const data:UnitCabang = await req.json();
    try{
        const find = await prisma.unitCabang.findFirst({where: {
            OR: [
                {name: data.name},
                {kode_area: data.kode_area}
            ]
        }});
        if(find && (find.is_active === true) && (find.id !== data.id)) {
            return NextResponse.json({msg: "Nama atau kode area cabang sudah tersedia"}, {status: 400, statusText: "BAD REQUEST"});
        }
        if(find && (find.is_active === false) && ((find.id === data.id))){
            await prisma?.unitCabang.update({
                where: {id: find.id},
                data: {
                    name: data.name,
                    kode_area: data.kode_area,
                    is_active: true
                }
            });
            return NextResponse.json({msg: "Data unit cabang berhasil disimpan"}, {status: 201, statusText: "OK"});
        }
        const result = await prisma.unitCabang.create({data: data});
        return NextResponse.json({result, msg: "Data unit cabang berhasil disimpan"}, {status: 201, statusText: "OK"});

    }catch(err){
        console.log(err);
        NextResponse.json({msg: "Server Error"}, {status: 500, statusText: "INTERNAL SERVER ERROR"});
    }
}

export const PUT = async (req: NextRequest) => {
    const data: UnitCabang = await req.json();
    try{
        const find = await prisma.unitCabang.findFirst({where: {id: data.id}});
        if(find && (find.name !== data.name || find.kode_area !== data.kode_area)){
            const searchNameOrArea = await prisma.unitCabang.findFirst({where: {OR: [{name: data.name}, {kode_area: data.kode_area}]}});
            if(searchNameOrArea && (searchNameOrArea.id !== data.id)){
                return NextResponse.json({msg: "Nama unit cabang atau kode area telah tersedia"}, {status: 400, statusText: "BAD REQUEST"});
            }else{
                await prisma.unitCabang.update({
                    where: {id: data.id},
                    data: {
                        name: data.name,
                        kode_area: data.kode_area,
                        is_active: true,
                        unit_pelayanan_id: data.unit_pelayanan_id
                    }
                });
                return NextResponse.json({msg: "Update data unit cabang berhasil"}, {status: 200, statusText: "OK"});
            }
        }else{
            return NextResponse.json({msg: "Data unit cabang tidak ditemukan"}, {status: 404, statusText: "NOT FOUND"});
        }
    }catch(err){
        console.log(err);
        return NextResponse.json({msg: "Server Error"}, {status: 500, statusText: "INTERNAL SERVER ERROR"});
    }
}

export const DELETE = async (req: NextRequest) => {
    const {id} = await req.json();
    const find = await prisma.unitCabang.findFirst({where: {id: id}});
    if(!find) return NextResponse.json({msg: "Data unit cabang tidak ditemukan"}, {status: 404, statusText: "NOT FOUND"});
    try{
        if(find.is_active === true){
            await prisma.$transaction(async(tx) => {
                await tx.unitCabang.update({where: {id: id}, data: {is_active: false}});
                await tx.user.updateMany({
                    where: {unit_cabang_id: id},
                    data: {status_active: false}
                });
            });
        }else{
            await prisma.$transaction(async(tx) => {
                await tx.unitCabang.update({where: {id: id}, data: {is_active: true}});
                await tx.user.updateMany({
                    where: {unit_cabang_id: id},
                    data: {status_active: true}
                });
            });
        }
        return NextResponse.json({msg: "Hapus data unit cabang berhasil"}, {status: 200, statusText: "OK"});
    }catch(err){
        console.log(err);
        return NextResponse.json({msg: "Server Error"}, {status: 500, statusText: "INTERNAL SERVER ERROR"});
    }
}