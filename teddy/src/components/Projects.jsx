import React, { useEffect, useState } from 'react';
import { getCatDoc } from '../utils/FirestoreConfig';
import './Projects.css';


function Projects ({catID, deleteCatFunc}) {
    var projects = [];
    var currProjName = null;

    const [catDoc, setCatDoc] = useState(null);
    const [categoryName, setCatName] = useState("");
    const [projState, setProjState] = useState([]);
    const [showChildren, setShowChildren] = useState(false);

    // TODO IMPLEMENT CREATE PROJECT POPUP
    const createProj = ({projectName}) => {

    };
    

    useEffect(() => {
        getCatDoc({categoryID: catID}).then((ret) => {
            setCatDoc(ret);
            // console.log(ret);
        });
        
    }, []);

    useEffect(() => {
        projects = [];
        if (catDoc){
            catDoc.get().then((retDoc) => {
                setCatName(retDoc.data().categoryName);
                // console.log(retDoc.data());
            });
            async function fetchData() {
                try {
                    const snapshot = await catDoc.collection("projects").get();
                    if (snapshot.empty){
                        console.log("No projects for category " + categoryName);
                        return;
                    }
                    snapshot.forEach((proj) => {
                        projects.push({
                            projectID: proj.id,
                            projectName: proj.data().projectName,
                            projDoc: proj.ref,
                            description: proj.data().description,
                            completed: proj.data().completed
                        });
                    });
                    setProjState(projects.map((proj) => proj.projectID));
                } catch (error) {
                    console.log("Error in trying to get projects for category " + categoryName);
                    console.log(error);
                }
            }
            fetchData();
        }
    }, [catDoc]);

    useEffect(() => {
        console.log(projState);
    }, [projState]);

    const projectInputHandler = (event) => {
        currProjName = event.target.value;
    }

    return (
        <div className='CategoryItem'>
            {catDoc && <li className='CategoryListItem' key={catDoc.id}>
                {categoryName}
               {showChildren &&  <div>
                    <h5>Projects</h5>
                    <div className='CreateProjectWrapper'>
                        <form>
                            <input className='form-control' type='text' onChange={projectInputHandler} placeholder="Enter project name" name="projInput"></input>
                        </form>
                        <button className='btn btn-secondary m-1' onClick={() => {}}>
                            +
                        </button>
                        <button className='btn btn-secondary m-1' onClick={() => {}}>
                            -
                        </button>
                    </div>
                    <ul className='ProjectsList'>
                        {projState.map((element) => (
                            <li key={element}>{element}</li>
                            // INSERT TASKS ELEMENT HERE
                        ))}
                    </ul>
                </div>}
            </li>}
            <button className='EditButton btn btn-secondary' onClick={() => {
                setShowChildren(!showChildren);
            }}>Show Projects</button>
            <button className='EditButton btn btn-secondary'>Edit</button>
            <button className='DeleteButton btn btn-secondary' onClick={() => {deleteCatFunc({categoryID: catID})}}>Delete</button>
        </div>
    );
}

export default Projects;