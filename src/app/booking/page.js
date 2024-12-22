'use client'
import { Sidebar } from "@/components/sidebar"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { collection, addDoc, doc, getDocs, query, where, updateDoc, onSnapshot, arrayUnion } from 'firebase/firestore';
import { db } from "@/firebase/config";
import { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";

const Page = () => {
    const [bookings, setBookings] = useState([])
    const [allBookings, setAllBookings] = useState([])
    const [loading, setLoading] = useState(false)
    const [assign, setAssign] = useState(null)
    const [helpers, setHelpers] = useState([])
    const [allHelpers, setAllHelpers] = useState([])

    // Helpers
    const getHelpers = async () => {
        const querySnapshot = await getDocs(collection(db, "helper"));
        let c = []
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            c.push(doc.data());
        });
        setAllHelpers(c);
    }


    //Get bookings of null helper
    const getPendingBookings = async () => {
        const q = query(collection(db, "booking"), where("helper", "==", null));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const cities = [];
            querySnapshot.forEach((doc) => {
                cities.push(doc.data());
            });
            setBookings(cities)
            console.log(bookings);
            console.log("nt", bookings.data)
        });
    }


    //All bookings
    const getAllBookings = async () => {
        const q = query(collection(db, "booking"), where("helper", "!=", null));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const cities = [];
            querySnapshot.forEach((doc) => {
                cities.push(doc.data());
            });
            setAllBookings(cities)
            console.log(allBookings);
        });
    }

    useEffect(() => {

        getHelpers()
        getAllBookings()
        getPendingBookings()

    }, []);


    //Assign helper

    const assignHelper = async (e, id, dates) => {
        e.preventDefault();
        const q = query(collection(db, "booking"), where("id", "==", id));

        const querySnapshot = await getDocs(q);
        let c = []
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            c = doc.id
            console.log(doc.id, " => ", doc.data());
        });
        console.log("id :", id)
        const bookRef = doc(db, "booking", c);
        await updateDoc(bookRef, {
            helper: assign
        })

        const h = query(collection(db, "helper"), where("name", "==", assign));
        const querySn = await getDocs(h);
        let d = []
        querySn.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            d = doc.id
        });

        const helpRef = doc(db, "helper", d);
        await updateDoc(helpRef, {
            bookedDate: arrayUnion(dates)
        })

    }
    //get specific helpers
    const getSpecificHelpers = async (dates) => {
        let ch = null
        setHelpers([])
        console.log("passed date : ", dates)
        const q = query(collection(db, "helper"), where("bookedDate", "array-contains", dates));
        const querySnapshot = await getDocs(q);
        let c = []
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            c.push(doc.data());
            console.log(doc.data())
        });
        ch = allHelpers
        console.log(c)
        let ca = ch.filter(item => !c.some(removeItem => removeItem.name === item.name));
        console.log(ca)
        setHelpers(ca);
    }


    const getName = async (id) => {
        const q = query(collection(db, "usersList"), where("userId", "==", id));
        const querySnapshot = await getDocs(q);
        let c = []
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            c = doc.data().fullname
            console.log(doc.id, " => ", doc.data().fullname);
        });
        console.log(c)
        return c
    }



    return (
        <div className="h-full relative">
            <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-[80] bg-gray-900">
                <Sidebar />
            </div>
            <div className="md:pl-72">
                <div className="mt-20 flex flex-row w-11/12 justify-between mx-auto">
                    <h1 className="text-2xl font-bold">New Bookings</h1>
                </div>

                {/* //contents */}
                <div className="w-11/12 mx-auto mt-20">
                    {bookings.length != 0 ?
                        <Table>
                            <TableCaption>New Bookings</TableCaption>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Booked By</TableHead>
                                    <TableHead>Booked For</TableHead>
                                    <TableHead>Address</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Time</TableHead>
                                    <TableHead>Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {bookings.map((h) => (
                                    <TableRow>
                                        <TableCell className="font-medium">{h.userName}</TableCell>
                                        <TableCell>{h.category}</TableCell>
                                        <TableCell>{h.address}</TableCell>
                                        <TableCell>{h.date}</TableCell>
                                        <TableCell>{h.time}</TableCell>
                                        <TableCell>          <Dialog>
                                            <DialogTrigger><Button variant="secondary" onClick={() => getSpecificHelpers(h.date)}>Assign</Button></DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Assign the Helper</DialogTitle>
                                                    <DialogDescription>
                                                        <form onSubmit={(e) => assignHelper(e, h.id, h.date)} className="flex flex-col justify-center items-center">
                                                            <select onChange={(e) => setAssign(e.target.value)} required className="w-3/4 mt-6 mb-6 h-14">
                                                                <option disabled selected>Select</option>
                                                                {helpers.map((h) => (<option value={h.name}>{h.name}</option>))}
                                                            </select>
                                                            <DialogClose asChild>
                                                                <Button type="submit" className="w-2/4 h-10" >Assign</Button>
                                                            </DialogClose>
                                                        </form>
                                                    </DialogDescription>
                                                </DialogHeader>
                                            </DialogContent>
                                        </Dialog></TableCell>

                                    </TableRow>
                                ))}

                            </TableBody>
                        </Table>
                        :
                        <h1>No new Bookings</h1>
                    }
                </div>


                {/* Old Bookings */}
                <div className="mt-20 flex flex-row w-11/12 justify-between mx-auto">
                    <h1 className="text-2xl font-bold">Bookings</h1>
                </div>

                {/* //contents */}
                <div className="w-11/12 mx-auto mt-20">
                    {allBookings.length != 0 ?
                        <Table>
                            <TableCaption>Bookings</TableCaption>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Booked By</TableHead>
                                    <TableHead>Booked For</TableHead>
                                    <TableHead>Address</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Time</TableHead>
                                    <TableHead>Helper</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {allBookings.map((h) => (
                                    <TableRow>
                                        <TableCell className="font-medium">{h.userName}</TableCell>
                                        <TableCell>{h.category}</TableCell>
                                        <TableCell>{h.address}</TableCell>
                                        <TableCell>{h.date}</TableCell>
                                        <TableCell>{h.time}</TableCell>
                                        <TableCell>{h.helper}</TableCell>
                                        <TableCell>{h.status ? "Completed" : "On Going"}</TableCell>
                                    </TableRow>
                                ))}

                            </TableBody>
                        </Table>
                        :
                        <h1>No Bookings</h1>
                    }
                </div>



            </div>
        </div>
    )
}

export default Page