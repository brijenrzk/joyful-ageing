"use client"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose
} from "@/components/ui/dialog"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useEffect, useState } from "react"
import { collection, addDoc, doc, getDocs, query, where, updateDoc, onSnapshot, deleteDoc } from 'firebase/firestore';
import { db } from "@/firebase/config"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"


const Page = () => {

    const [helperList, setHelperList] = useState([])
    const [name, setName] = useState("")
    const [gender, setGender] = useState("")
    const [phone, setPhone] = useState("")
    const { toast } = useToast()


    const getHelpers = async () => {


        const q = query(collection(db, "helper"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const cities = [];
            querySnapshot.forEach((doc) => {
                cities.push(doc.data());
            });
            setHelperList(cities)
            console.log("Current cities in CA: ", cities.join(", "));
        });


        // const querySnapshot = await getDocs(collection(db, "helper"));
        // let c = []
        // querySnapshot.forEach((doc) => {
        //     // doc.data() is never undefined for query doc snapshots
        //     c.push(doc.data());
        // });
        // setHelperList(c);
    }


    useEffect(() => {

        getHelpers()

    }, []);

    const deleteData = async (id) => {
        const q = query(collection(db, "helper"), where("id", "==", id));
        let c = ''
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            c = doc.id
            console.log(doc.id, " => ", doc.data());
        });

        await deleteDoc(doc(db, "helper", c));
        console.log()
        alert("deleted")
    }


    const addData = async (name, gender, phone) => {
        try {
            const docRef = await addDoc(collection(db, "helper"), {
                name: name,
                gender: gender,
                id: phone,
                bookedDate: []
            });
            console.log("Document written with ID: ", docRef.id);
            toast({
                description: "Helper has been added",
            })
            return true;
        } catch (e) {
            console.log(e)
            return false;
        }
    }



    const handleSubmit = async (e) => {
        e.preventDefault();
        const added = await addData(name, gender, phone);
        if (added) {
            setName("");
            setGender("")
            setPhone("")
            alert("Data added.")

        }

    }

    return (
        <div className="h-full relative">
            <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-[80] bg-gray-900">
                <Sidebar />
            </div>
            <div className="md:pl-72">
                <div className="mt-20 flex flex-row w-11/12 justify-between mx-auto">
                    <h1 className="text-2xl font-bold">Helpers</h1>
                    <Dialog>
                        <DialogTrigger><Button>Add Helper</Button></DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Assign the Helper</DialogTitle>
                                <DialogDescription>
                                    <form onSubmit={handleSubmit}>
                                        <Input className="mt-4 mb-4" type='text' value={name} id="name" onChange={(e) => setName(e.target.value)} placeholder='Name' required />
                                        <div className="flex flex-row mb-4">
                                            <p className="mr-4">Gender : </p>
                                            Male
                                            <input className="ml-2 mr-8" type='radio' name="gender" value="Male" onChange={(e) => setGender(e.target.value)} />
                                            Female
                                            <input className="ml-2" type='radio' name="gender" value="Female" onChange={(e) => setGender(e.target.value)} />
                                        </div>

                                        <Input className="mb-4" type='phone' value={phone} onChange={(e) => setPhone(e.target.value)} placeholder='Phone Number' />

                                        <DialogClose asChild>
                                            <Button type="submit" >Add Data</Button>
                                        </DialogClose>
                                    </form>
                                </DialogDescription>
                            </DialogHeader>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* //contents */}
                <div className="w-11/12 mx-auto mt-20">
                    {helperList.length != 0 ?
                        <Table>
                            <TableCaption>A list of helpers</TableCaption>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Contact Number</TableHead>
                                    <TableHead>Gender</TableHead>
                                    <TableHead>Action</TableHead>

                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {helperList.map((h) => (
                                    <TableRow key={h.id}>
                                        <TableCell className="font-medium">{h.name}</TableCell>
                                        <TableCell>{h.id}</TableCell>
                                        <TableCell>{h.gender}</TableCell>
                                        <TableCell><Button variant="destructive" onClick={() => deleteData(h.id)}>Delete</Button></TableCell>
                                    </TableRow>
                                ))}

                            </TableBody>
                        </Table>
                        :
                        <h1>No Helpers.</h1>
                    }
                </div>



            </div>
        </div>
    )
}

export default Page