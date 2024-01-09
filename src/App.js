import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { Button, Typography } from "@mui/material";
import { db } from "./config/firebase";
import {
  addDoc,
  getDocs,
  collection,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";

const App = () => {
  const [data, setData] = useState("");
  const [userData, setUserData] = useState([]);
  const [refresh, setRefresh] = useState(false);

  const addData = async (element) => {
    try {
      element.preventDefault();

      const userObj = {
        data,
      };
      const docRef = await addDoc(collection(db, "users"), userObj);
      console.log(docRef);
      setRefresh(!refresh);
    } catch (error) {
      console.log(error);
    }
  };

  const getData = async () => {
    try {
      const arr = [];
      const docSnap = await getDocs(collection(db, "users"));

      docSnap.forEach((doc) => {
        arr.push({
          ...doc.data(),
          id: doc.id,
        });
      });
      setUserData([...arr]);
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    getData();
  }, [refresh]);

  const editData = async (id) => {
    console.log("editData", id);
    const editValue = prompt("What do you want to");

    const userObj = {
      data: editValue,
    };

    await updateDoc(doc(db, "users", id), userObj);
    setRefresh(!refresh);
  };
  const deleteData = async (id) => {
    const docRef = doc(db, "users", id);
    const del = await deleteDoc(docRef);
    const userObj = {
      data: del,
    };
    setRefresh(!refresh);
  };

  return (
    <>
      <Box
        component="form"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          "& > :not(style)": { m: 5, width: "75ch" },
        }}
        noValidate
        autoComplete="off"
      >
        <Typography
          level="h1"
          sx={{
            textAlign: "center",
          }}
        >
          TODO LIST
        </Typography>
        <TextField
          onChange={(e) => setData(e.target.value)}
          id="outlined-basic"
          label="Whats in your mind..."
          variant="outlined"
        />
        <Button onClick={addData}>ADD</Button>
        <div>
          {userData.map((user, index) => (
            <div
              key={index}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                border: "1px solid #ddd",
                borderRadius: "5px",
                padding: "8px",
                margin: "8px 0",
              }}
            >
              <ul>
                <span
                  sx={{
                    m: 5,
                    textAlign: "center",
                    fontSize: "1.2rem",
                  }}
                >
                  {user.data}
                </span>
              </ul>
              <div
                sx={{
                  display: "flex",
                  gap: "8px",
                }}
              >
                <Button onClick={() => editData(user.id)}>EDIT</Button>
                <Button onClick={() => deleteData(user.id)}>DELETE</Button>
              </div>
            </div>
          ))}
        </div>
      </Box>
    </>
  );
};

export default App;
