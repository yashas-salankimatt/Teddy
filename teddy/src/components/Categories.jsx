import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../providers/UserProvider';
import { auth, firestore } from '../utils/FirebaseConfig';
import {createCategory, deleteCategory} from "../utils/FirestoreConfig";
import Projects from './Projects';
import './Categories.css'

var categories = [];
var currCatName = null;

function Categories(props) {
    const [catState, setCatState] = useState([]);
    
    const createCat = async ({categoryName, archived=false}) => {
        var catDoc = await createCategory({categoryName, archived});
        // console.log("created");
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
        deleteCategory({categoryName, categoryID}).then((retID) => {
            categoryID = retID;
        });
        
        const findInd = categories.findIndex((element) => {
            return (element.categoryID === categoryID || element.categoryName === categoryName);
        });
        if (findInd >= 0){
            categories.splice(findInd, 1);
        }
        setCatState(categories.map((cat) => cat.categoryID));
        // setCatState(tempState);
        // console.log(categories);
        // console.log(catState);
    };

    // called on mount to populate for categories
    useEffect(() => {
        // console.log("Mounted");
        categories = [];
        async function fetchData() {
            const user = auth.currentUser;
            try {
                const snapshot = await firestore.collection("users").doc(user.uid).collection("todo").where('defaultCat', '!=', true).get();
                if (snapshot.empty){
                    console.log("No categories for this user");
                    return;
                }
                snapshot.forEach((cat) => {
                    categories.push({
                        categoryID: cat.id,
                        categoryName: cat.data().categoryName,
                        catDoc: cat.ref,
                        archived: cat.data().archived,
                        defaultCat: false
                    });
                });
                setCatState(categories.map((cat) => cat.categoryID));
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
                {catState.map((element) => (
                    <Projects catID={element} deleteCatFunc={deleteCat} key={element}></Projects>
                ))}
            </ul>
        </div>
    );
}

export default Categories;