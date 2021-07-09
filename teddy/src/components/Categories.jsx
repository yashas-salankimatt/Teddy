import React, { useEffect, useState } from 'react';
import { auth, firestore } from '../utils/FirebaseConfig';
import {createCategory, deleteCategory} from "../utils/FirestoreConfig";
import Projects from './Projects';

const categories = [];

function Categories(props) {
    const [catState, setCatState] = useState([]);
    
    const createCat = async ({categoryName, archived=false}) => {
        var catDoc = await createCategory({categoryName, archived});
        console.log("created");
        catDoc = await catDoc;
        var catDocID = catDoc.id;
        categories.push({
            categoryID: catDocID,
            categoryName: categoryName,
            catDoc,
            archived: archived,
            defaultCat: false
        });
        // setCatState(categories.map((cat) => cat.catDoc));
        setCatState(categories.map((cat) => cat.categoryID));
        // console.log(catState);
    };
    
    const deleteCat = ({categoryID=null, categoryName=null}) => {
        var categoryID = deleteCategory({categoryName, categoryID});
        
        const findInd = categories.findIndex((element) => {
            return element.categoryID === categoryID || element.categoryName === categoryName;
        });
        if (findInd >= 0){
            categories.splice(findInd, 1);
        }
        setCatState(categories.map((cat) => cat.categoryID));
        // setCatState(tempState);
        console.log(categories);
        console.log(catState);
    };

    // called on mount to populate for categories
    useEffect(() => {
        async function fetchData() {
            const user = auth.currentUser;
            try {
                const snapshot = await firestore.collection("users").doc(user.uid).collection("todo").where('defaultCat', '!=', true).get();
                if (snapshot.empty){
                    console.log("No categories for this user");
                    return;
                }
                var initState = catState;
                snapshot.forEach((cat) => {
                    categories.push({
                        categoryID: cat.id,
                        categoryName: cat.data().categoryName,
                        catDoc: cat.ref,
                        archived: cat.data().archived,
                        defaultCat: false
                    });
                    initState.push(cat.id);
                });
                setCatState(categories.map((cat) => cat.categoryID));
                console.log(categories);
                console.log(catState);
            } catch (error) {
                console.log("Error in trying to get data from DB on mount");
                console.log(error);
            }
        }
        fetchData();
    }, []);

    useEffect(() => {
        console.log("test");
        console.log(catState);
    }, [catState]);


    return (
        <div>
            <form></form>
            <button onClick={() => createCat({
                categoryName: "TestCat"
            })}>
                Create Category
            </button>
            <button onClick={() => deleteCat({categoryName: "TestCat"})}>
                Delete Category
            </button>
            <ul>{catState.map((element) => (
                <Projects catID={element} key={element}></Projects>
            ))}</ul>
        </div>
    );
}

export default Categories;