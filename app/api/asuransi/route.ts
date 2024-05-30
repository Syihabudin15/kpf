import { DataDataPengajuan } from "@/components/utils/Interfaces";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/components/prisma";
import { daysInMonth } from "@/components/utils/inputUtils";

export const GET = async (req: NextRequest) => {
    const page: number = <any>req.nextUrl.searchParams.get("page") || 1;
    const name = req.nextUrl.searchParams.get("name");
    const month = req.nextUrl.searchParams.get("month") || "2024-"+new Date().getMonth()+1;
    const isTrue = req.nextUrl.searchParams.get("is-true");
    const skip = (page-1) * 20;

    let result: DataDataPengajuan[] = [];

    if(name){
        result = <any>await prisma.dataPengajuan.findMany({
            where: {
                pembayaran_asuransi: isTrue ? true : false,
                is_active: true,
                status_pencairan: "TRANSFER",
                DataPembiayaan: {
                    created_at: {
                        gte: month+"-01",
                        lte: month+"-"+daysInMonth(parseInt(month.split("-")[1]),parseInt(month.split("-")[0]))
                    }
                },
                OR: [
                    {nama: {contains: name}},
                    {nopen: {contains: name}},
                    {DataPembiayaan: {
                        Produk: {
                            name: {contains: name}
                        }
                    }},
                    {Bank: {
                        name: {contains: name}
                    }},
                    {
                        DataPembiayaan: {
                            JenisPembiayaan: {
                                name: {contains: name}
                            }
                        }
                    }
                ]
            },
            include: {
                DataPembiayaan: {
                    include: {
                        User: true,
                        Produk: true,
                        JenisPembiayaan: true
                    }
                },
                User: true,
                Bank: true
            },
            skip: skip,take: 20
        })
    }else{
        result = <any>await prisma.dataPengajuan.findMany({
            where: {
                pembayaran_asuransi: isTrue ? true : false,
                is_active: true,
                status_pencairan: "TRANSFER",
                DataPembiayaan: {
                    created_at: {
                        gte: month+"-01",
                        lte: month+"-"+daysInMonth(parseInt(month.split("-")[1]),parseInt(month.split("-")[0]))
                    }
                }
            },
            include: {
                DataPembiayaan: {
                    include: {
                        User: true,
                        Produk: true,
                        JenisPembiayaan: true
                    }
                },
                User: true,
                Bank: true
            },
            skip: skip,take: 20
        })
    }
    return NextResponse.json({data: result}, {status: 200});
}


export const POST = async (req: NextRequest) => {
    const data = await req.json();

    const find = await prisma.dataPengajuan.findFirst({where: {id: data.id}});
    if(!find) return NextResponse.json({msg: "Maaf data tidak ditemukan. mohon refresh dan coba lagi!"}, {status: 404});
    
    await prisma.dataPengajuan.update({
        where: {
            id: data.id
        },
        data: {
            pembayaran_asuransi: find.pembayaran_asuransi ? false : true,
            tanggal_pembayaran_asuransi: data.tanggal_pembayaran_asuransi ? new Date(data.tanggal_pembayaran_asuransi).toISOString() : new Date()
        }
    });

    return NextResponse.json({msg: "Berhasil update data pembayaean asuransi!"}, {status: 200});
}