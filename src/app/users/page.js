'use client'
import { Sidebar } from "@/components/sidebar"
import { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import { collection, addDoc, doc, getDocs, query, where, updateDoc, onSnapshot } from 'firebase/firestore';
import { db } from "@/firebase/config";

const Page = () => {
    const [userList, setUserList] = useState([])

    const getUsers = async () => {


        const q = query(collection(db, "usersList"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const cities = [];
            querySnapshot.forEach((doc) => {
                cities.push(doc.data());
            });
            setUserList(cities)
            console.log("Current cities in CA: ", cities.join(", "));
        });
    }

    useEffect(() => {

        getUsers()

    }, []);
    return (
        <div className="h-full relative">
            <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-[80] bg-gray-900">
                <Sidebar />
            </div>
            <div className="md:pl-72">
                <div className="mt-20 flex flex-row w-11/12 justify-between mx-auto">
                    <h1 className="text-2xl font-bold">Users</h1>
                </div>

                {/* //contents */}
                <div className="w-11/12 mx-auto mt-20">
                    {userList.length != 0 ?
                        <Table>
                            <TableCaption>A list of helpers</TableCaption>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Contact Number</TableHead>
                                    <TableHead>Gender</TableHead>
                                    <TableHead>Age</TableHead>

                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {userList.map((h) => (
                                    <TableRow>
                                        <TableCell className="font-medium">{h.fullname}</TableCell>
                                        <TableCell>{h.contact}</TableCell>
                                        <TableCell>{h.gender}</TableCell>
                                        <TableCell>{h.age}</TableCell>
                                    </TableRow>
                                ))}

                            </TableBody>
                        </Table>
                        :
                        <h1>Loading...</h1>
                    }
                </div>



            </div>
        </div>
    )
}

export default Page