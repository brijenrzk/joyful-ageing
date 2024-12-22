'use client'
import { Button } from '@/components/ui/button';
import { db } from '../firebase/config'
import { collection, addDoc, doc, getDocs, query, where, updateDoc, onSnapshot, getCountFromServer, deleteDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Sidebar } from '@/components/sidebar';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog"
import { Input } from '@/components/ui/input';



export default function Home({ children }) {


  const [userCount, setUserCount] = useState(0)
  const [bookingCount, setBookingCount] = useState(0)
  const [helperrCount, setHelperCount] = useState(0)
  const [category, setCategory] = useState([])
  const [name, setName] = useState("")
  const [price, setPrice] = useState(0)



  const getUsersCount = async () => {
    const coll = collection(db, "usersList");
    const snapshot = await getCountFromServer(coll);
    setUserCount(snapshot.data().count)
  }
  const getBookingCount = async () => {
    const coll = collection(db, "booking");
    const snapshot = await getCountFromServer(coll);
    setBookingCount(snapshot.data().count);
  }
  const getHelperCount = async () => {
    const coll = collection(db, "helper");
    const snapshot = await getCountFromServer(coll);
    setHelperCount(snapshot.data().count);
  }

  const getCategory = async () => {


    const q = query(collection(db, "category"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const cities = [];
      querySnapshot.forEach((doc) => {
        cities.push(doc.data());
      });
      setCategory(cities)
    });
  }

  useEffect(() => {

    getUsersCount();
    getBookingCount();
    getHelperCount();
    getCategory();

  }, []);




  const addData = async () => {
    let id = name + Math.floor(Math.random() * 100000)
    try {
      const docRef = await addDoc(collection(db, "category"), {
        id: id,
        name: name,
        price: price,
      });
      console.log("Document written with ID: ", docRef.id);
      return true;
    } catch (e) {
      console.log(e)
      return false;
    }
  }


  const handleSubmit = async (e) => {
    e.preventDefault();
    const added = await addData();
    if (added) {
      setName("");
      setPrice(0)
      alert("Category added.")

    }

  }


  const deleteData = async (id) => {
    const q = query(collection(db, "category"), where("id", "==", id));
    let c = ''
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      c = doc.id
      console.log(doc.id, " => ", doc.data());
    });

    await deleteDoc(doc(db, "category", c));
    console.log()
    alert("deleted")
  }


  return (
    <div className="h-full relative">
      <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-[80] bg-gray-900">
        <Sidebar />
      </div>
      <div className="md:pl-72">
        <div className="w-11/12 mx-auto mt-20">
          <div>
            <div className="flex flex-row gap-4 w-full">
              <div className="bg-white px-14 py-6 rounded-lg drop-shadow-2xl h-48 w-1/3">
                <p className="text-gray-400 mb-2">Number of Users</p>
                <h5 className="text-blue-300 text-6xl font-bold mt-8">{userCount}</h5>
              </div>
              <div className="bg-white px-14 py-6 rounded-lg drop-shadow-2xl  h-48 w-1/3">
                <p className="text-gray-400 mb-2">Number of Bookings</p>
                <h5 className="text-green-300 text-6xl font-bold mt-8">{bookingCount}</h5>
              </div>
              <div className="bg-white px-14 py-6 rounded-lg drop-shadow-2xl  h-48 w-1/3">
                <p className="text-gray-400 mb-2">Number of Helpers</p>
                <h5 className="text-orange-300 text-6xl font-bold mt-8">{helperrCount}</h5>
              </div>
            </div>
          </div>
          {/* Categories */}
          <div className='mt-20'>
            <div className="mb-14 flex flex-row w-full justify-between mx-auto">
              <h1 className="text-2xl font-bold">Category</h1>
              <Dialog>
                <DialogTrigger><Button>Add Category</Button></DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Category</DialogTitle>
                    <DialogDescription>
                      <form onSubmit={handleSubmit}>
                        <Input className="mt-4 mb-4" type='text' value={name} id="name" onChange={(e) => setName(e.target.value)} placeholder='Category Name' required />
                        <p className='mb-2'>Price</p>
                        <Input className="mb-4" type='number' value={price} onChange={(e) => setPrice(e.target.value)} placeholder='Price' />

                        <DialogClose asChild>
                          <Button type="submit" >Add Category</Button>
                        </DialogClose>
                      </form>
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </div>
            {category.length != 0 ?
              <Table>
                <TableCaption>Categories</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category Name</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {category.map((h) => (
                    <TableRow>
                      <TableCell className="font-medium">{h.name}</TableCell>
                      <TableCell>{h.price}</TableCell>
                      <TableCell><Button variant="destructive" onClick={() => deleteData(h.id)}>Delete</Button></TableCell>
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
    </div>
  );
}
