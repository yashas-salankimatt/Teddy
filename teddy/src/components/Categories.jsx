import React, { useEffect, useState } from 'react';
import { auth, firestore } from '../utils/FirebaseConfig';
import {createCategory, deleteCategory} from "../utils/FirestoreConfig";
import Projects from './Projects';
import './Categories.css'

// TODO: Maybe make these a part of categories as stateful variables?
// var categories = [];
var currCatName = null;

function Categories(props) {
    // const [catState, setCatState] = useState([]);
    const [categories, setCategories] = useState([]);
    
    const createCat = async ({categoryName, archived=false}) => {
        var catDoc = await createCategory({categoryName, archived});
        // console.log("created");
        catDoc = await catDoc;
        var catDocID = catDoc.id;
        var tempCategories = categories.concat();
        tempCategories.push({
            categoryID: catDocID,
            categoryName: categoryName,
            catDoc,
            archived: archived
        });
        setCategories(tempCategories);
        // setCatState(categories.map((cat) => cat.catDoc));
        // setCatState(categories.map((cat) => cat.categoryID));
        // console.log(catState);
    };
    
    const deleteCat = ({categoryID=null, categoryName=null}) => {
        deleteCategory({categoryName, categoryID}).then((retID) => {
            categoryID = retID;
        });
        // setCategories([]);
        
        var tempCategories = categories.concat();
        console.log(tempCategories);
        console.log(categories);
        const findInd = tempCategories.findIndex((element) => {
            return (element.categoryID === categoryID || element.categoryName === categoryName);
        });
        if (findInd >= 0){
            tempCategories.splice(findInd, 1);
        }
        console.log(tempCategories);
        setCategories(tempCategories);
        // setCategories((prevCategories) => {
        //     const findInd = prevCategories.findIndex((element) => {
        //         return element.categoryID === categoryID;
        //     });
        //     if (findInd >= 0){
        //         prevCategories.splice(findInd, 1);
        //     }
        //     return prevCategories;
        // })
        // setCatState(categories.map((cat) => cat.categoryID));
        // setCatState(tempState);
        // console.log(categories);
        // console.log(catState);
    };

    // called on mount to populate for categories
    useEffect(() => {
        // console.log("Mounted");
        // categories = [];
        setCategories([]);
        async function fetchData() {
            const user = auth.currentUser;
            try {
                const snapshot = await firestore.collection("users").doc(user.uid).collection("todo").get();
                if (snapshot.empty){
                    console.log("No categories for this user");
                    return;
                }
                var tempCategories = categories.concat();
                snapshot.forEach((cat) => {
                    tempCategories.push({
                        categoryID: cat.id,
                        categoryName: cat.data().categoryName,
                        catDoc: cat.ref,
                        archived: cat.data().archived,
                    });
                });
                setCategories(tempCategories);
                // setCatState(categories.map((cat) => cat.categoryID));
                // console.log(categories);
                // console.log(catState);
            } catch (error) {
                console.log("Error in trying to get data from DB on mount");
                console.log(error);
            }
        }
        fetchData();
    }, []);

    const categoryInputHandler = (event) => {
        currCatName = event.target.value;
    };

    return (
        <div>
            {/* <h1>Tasks</h1> */}
            <div>
                <h2>Categories</h2>
                <div className='CreateCategoryWrapper'>
                    <form>
                        <input className='form-control' type='text' onChange={categoryInputHandler} placeholder="Enter category name" name="catInput"></input>
                    </form>
                    <button className='btn btn-secondary m-1' onClick={() => createCat({categoryName: currCatName})}>
                        Create Category
                    </button>
                </div>
                <ul className='CategoriesList'>
                    {categories.map((element) => (
                        <Projects catData={{element}} deleteCatFunc={deleteCat} key={element.catID}></Projects>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default Categories;